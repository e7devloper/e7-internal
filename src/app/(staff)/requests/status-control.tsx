'use client';

import { useOptimistic, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Check, LoaderCircle } from 'lucide-react';
import { setStatus } from '../../actions';
import type { Status } from '@/lib/types';

export function StatusControl({ id, current, statuses }: { id: number; current: Status; statuses: Record<Status, string> }) {
  const [shown, setShown] = useOptimistic(current);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const choose = (status: Status) => {
    if (status === shown || pending) return;
    startTransition(async () => {
      setShown(status);
      // Without an id in the URL the pane shows the first request in the list; this one is about to leave
      // the current view, so pin it first to keep the person on the request they changed.
      if (search.get('id') !== String(id)) {
        const params = new URLSearchParams(search);
        params.set('id', String(id));
        router.replace(`${pathname}?${params}`, { scroll: false });
      }
      const data = new FormData();
      data.set('id', String(id));
      data.set('status', status);
      await setStatus(data);
    });
  };

  return (
    <>
      <div className="segmented" role="group" aria-label="Status">
        {(Object.keys(statuses) as Status[]).map((k) => (
          <button key={k} type="button" aria-pressed={k === shown} disabled={pending && k !== shown} onClick={() => choose(k)}>
            {k === shown ? pending ? <LoaderCircle size={15} className="spin" aria-hidden /> : <Check size={15} aria-hidden /> : null}
            {statuses[k]}
          </button>
        ))}
      </div>
      <p className="status-note" aria-live="polite">
        {pending ? `Saving as ${statuses[shown]}…` : 'The client sees this status in the E7 Parks app the next time their requests load.'}
      </p>
    </>
  );
}
