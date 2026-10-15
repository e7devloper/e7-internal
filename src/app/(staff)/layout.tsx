import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { getMe } from '@/lib/api';
import { signOut } from '../actions';
import { Nav } from './nav';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="topbar">
        <Link href="/requests" className="brand">
          <span className="brand-mark">
            <img src="/logo-sm.png" alt="" width={32} height={32} />
          </span>
          <span className="brand-name">E7 Internal</span>
        </Link>
        <Nav isAdmin={me.role === 'admin'} />
        <div className="who">
          <Link href="/account" title="Your account">
            <span className="avatar" aria-hidden>
              {initials(me.name)}
            </span>
            <span className="who-name">{me.name}</span>
            <span className="visually-hidden">Your account</span>
          </Link>
          <form action={signOut}>
            <button type="submit" title="Sign out">
              <LogOut size={17} aria-hidden />
              <span className="who-name">Sign out</span>
              <span className="visually-hidden">Sign out</span>
            </button>
          </form>
        </div>
      </header>
      <div id="main">{children}</div>
    </>
  );
}
