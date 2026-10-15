import type { Ticket } from './types';

const TZ = process.env.DISPLAY_TIME_ZONE ?? 'Asia/Kolkata';
const DAY = 24 * 60 * 60_000;

export const formatBudget = (amount: number, currency: string) =>
  `${currency} ${amount.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', { maximumFractionDigits: 0 })}`;

export const formatNumber = (n: number) => n.toLocaleString('en-IN');

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' });

/** Compact wait age for the ticket stub: "3h", "9d", "5w". */
export function age(iso: string, now = Date.now()) {
  const ms = Math.max(0, now - Date.parse(iso));
  if (ms < 60 * 60_000) return `${Math.max(1, Math.floor(ms / 60_000))}m`;
  if (ms < DAY) return `${Math.floor(ms / (60 * 60_000))}h`;
  if (ms < 7 * DAY * 8) return `${Math.floor(ms / DAY)}d`;
  return `${Math.floor(ms / (7 * DAY))}w`;
}

/** Spelled out, for screen readers and titles: "9 days". */
export function ageLong(iso: string, now = Date.now()) {
  const ms = Math.max(0, now - Date.parse(iso));
  const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;
  if (ms < 60 * 60_000) return plural(Math.max(1, Math.floor(ms / 60_000)), 'minute');
  if (ms < DAY) return plural(Math.floor(ms / (60 * 60_000)), 'hour');
  return plural(Math.floor(ms / DAY), 'day');
}

export const isOverdue = (t: Ticket, now = Date.now()) => t.status === 'open' && now - Date.parse(t.createdAt) > 7 * DAY;

export type AgeGroup = 'week_plus' | 'week' | 'today';

export function ageGroup(iso: string, now = Date.now()): AgeGroup {
  const ms = now - Date.parse(iso);
  if (ms > 7 * DAY) return 'week_plus';
  if (ms > DAY) return 'week';
  return 'today';
}

/** Digits only, for wa.me and tel: links. */
export const phoneDigits = (phone: string) => phone.replace(/[^\d+]/g, '');
