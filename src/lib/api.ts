import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { Catalog, Kpis, Staff, Ticket, TicketWithHistory } from './types';

export const SESSION_COOKIE = 'e7_session';
// Matches the API's 12-hour token lifetime.
export const SESSION_MAX_AGE = 12 * 60 * 60;

// Defaults to the live API, so a deploy works without configuration. For local development set
// E7_API_URL=http://localhost:4000/api/staff in .env.local.
const API_URL = (process.env.E7_API_URL || 'https://api.e7entertainments.com/api/staff').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
  }
}

/** Raw call to the staff API. Throws ApiError with the server's human-readable message. */
export async function callApi<T>(path: string, init: { method?: string; body?: unknown; token?: string } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        accept: 'application/json',
        ...(init.body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...(init.token ? { authorization: `Bearer ${init.token}` } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new ApiError("Can't reach the E7 Parks server right now. Try again in a minute.", 503, 'UNREACHABLE');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error ?? 'Something went wrong on the server.', res.status, data.code);
  return data as T;
}

export async function getToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** Authenticated call for pages and actions. A missing or expired session goes to the sign-in page. */
export async function staffApi<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = await getToken();
  if (!token) redirect('/login');
  try {
    return await callApi<T>(path, { ...init, token });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect('/login?expired=1');
    throw err;
  }
}

// Deduplicated per request, so the shell and the page can both ask.
export const getMe = cache(async () => (await staffApi<{ staff: Staff }>('/me')).staff);
export const getCatalog = cache(() => staffApi<Catalog>('/catalog'));

export const getTickets = () => staffApi<{ tickets: Ticket[] }>('/tickets').then((r) => r.tickets);
export const getTicket = (id: number) => staffApi<{ ticket: TicketWithHistory }>(`/tickets/${id}`).then((r) => r.ticket);
export const getKpis = () => staffApi<Kpis>('/kpis');
export const getTeam = () => staffApi<{ staff: Staff[] }>('/team').then((r) => r.staff);
