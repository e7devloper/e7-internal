'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

/** Search and view filter. A plain GET form, so it works before JavaScript loads; with it, the list updates as you type. */
export function FilterBar({ view, q, views }: { view: string; q: string; views: Record<string, string> }) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const apply = () => {
    const data = new FormData(form.current!);
    const params = new URLSearchParams();
    const nextView = String(data.get('view'));
    const nextQ = String(data.get('q')).trim();
    if (nextView !== 'open') params.set('view', nextView);
    if (nextQ) params.set('q', nextQ);
    router.replace(`/requests${params.size ? `?${params}` : ''}`, { scroll: false });
  };

  return (
    <form
      ref={form}
      className="filterbar"
      action="/requests"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <div className="search">
        <Search size={16} aria-hidden />
        <label htmlFor="q" className="visually-hidden">
          Search requests
        </label>
        <input
          id="q"
          name="q"
          type="search"
          className="input"
          placeholder="Search requests"
          defaultValue={q}
          autoComplete="off"
          onChange={() => {
            clearTimeout(timer.current);
            timer.current = setTimeout(apply, 250);
          }}
        />
      </div>
      <label htmlFor="view" className="visually-hidden">
        Show
      </label>
      <select id="view" name="view" className="select" defaultValue={view} key={view} onChange={apply}>
        {Object.entries(views).map(([k, label]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </select>
    </form>
  );
}
