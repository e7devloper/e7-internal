'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Nav({ isAdmin }: { isAdmin: boolean }) {
  const path = usePathname();
  const items = [
    { href: '/requests', label: 'Requests' },
    { href: '/overview', label: 'Overview' },
    ...(isAdmin ? [{ href: '/team', label: 'Team' }] : []),
  ];
  return (
    <nav className="nav" aria-label="Main">
      {items.map((i) => (
        <Link key={i.href} href={i.href} aria-current={path.startsWith(i.href) ? 'page' : undefined}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
