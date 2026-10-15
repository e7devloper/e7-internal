'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ApiError, callApi, SESSION_COOKIE, SESSION_MAX_AGE, staffApi } from '@/lib/api';
import type { Staff } from '@/lib/types';

export type FormState = { error?: string; success?: string; email?: string } | undefined;

async function setSession(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

/** Turns API errors into a message for the form; anything else (including redirects) keeps propagating. */
async function attempt(fn: () => Promise<FormState>): Promise<FormState> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }
}

const field = (data: FormData, name: string) => String(data.get(name) ?? '').trim();

/** Only same-site paths, so the sign-in page can't be used to bounce people elsewhere. */
const safeNext = (v: string) => (v.startsWith('/') && !v.startsWith('//') ? v : '/requests');

export async function signIn(_prev: FormState, data: FormData): Promise<FormState> {
  const email = field(data, 'email');
  const password = String(data.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.', email };
  const result = await attempt(async () => {
    const { token } = await callApi<{ token: string }>('/login', { method: 'POST', body: { email, password } });
    await setSession(token);
    return undefined;
  });
  // React resets the form after the action, so hand the email back to keep it filled in.
  if (result?.error) return { ...result, email };
  redirect(safeNext(field(data, 'next')));
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/login');
}

export async function setStatus(data: FormData): Promise<void> {
  const id = Number(data.get('id'));
  const status = field(data, 'status');
  await staffApi(`/tickets/${id}`, { method: 'PATCH', body: { status } });
  revalidatePath('/requests');
}

export async function addStaff(_prev: FormState, data: FormData): Promise<FormState> {
  return attempt(async () => {
    const { staff } = await staffApi<{ staff: Staff }>('/team', {
      method: 'POST',
      body: { name: field(data, 'name'), email: field(data, 'email'), role: field(data, 'role') || 'staff', password: String(data.get('password') ?? '') },
    });
    revalidatePath('/team');
    return { success: `${staff.name} can now sign in with ${staff.email}. Share the temporary password with them directly.` };
  });
}

export async function updateStaff(data: FormData): Promise<void> {
  const id = Number(data.get('id'));
  const body: Record<string, unknown> = {};
  if (data.has('active')) body.active = data.get('active') === 'true';
  if (data.has('role')) body.role = field(data, 'role');
  await staffApi(`/team/${id}`, { method: 'PATCH', body });
  revalidatePath('/team');
}

export async function resetStaffPassword(_prev: FormState, data: FormData): Promise<FormState> {
  return attempt(async () => {
    await staffApi(`/team/${Number(data.get('id'))}`, { method: 'PATCH', body: { password: String(data.get('password') ?? '') } });
    revalidatePath('/team');
    return { success: 'Password reset. They have been signed out everywhere.' };
  });
}

export async function changeOwnPassword(_prev: FormState, data: FormData): Promise<FormState> {
  const newPassword = String(data.get('newPassword') ?? '');
  if (newPassword !== String(data.get('confirmPassword') ?? '')) return { error: "The new passwords don't match." };
  return attempt(async () => {
    const { token } = await staffApi<{ token: string }>('/me/password', {
      method: 'POST',
      body: { currentPassword: String(data.get('currentPassword') ?? ''), newPassword },
    });
    // The old token stopped working the moment the password changed.
    await setSession(token);
    return { success: 'Password changed. Other devices have been signed out.' };
  });
}
