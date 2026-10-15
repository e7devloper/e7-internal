'use client';

import { CloudOff, RotateCw } from 'lucide-react';

export default function StaffError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Production hides server error messages; ours are written for people, so show them in development only.
  const detail = process.env.NODE_ENV === 'development' ? error.message : null;
  return (
    <main className="page page-narrow">
      <div className="panel detail-empty" style={{ padding: 40 }}>
        <div>
          <CloudOff size={32} aria-hidden style={{ color: 'var(--input-border)' }} />
          <h1 style={{ fontSize: 20, margin: '12px 0 6px' }}>This page couldn&rsquo;t load</h1>
          <p>The E7 Parks server didn&rsquo;t answer. Nothing you changed has been lost.</p>
          {detail ? <p className="hint" style={{ marginTop: 8 }}>{detail}</p> : null}
          <button type="button" className="btn" onClick={reset} style={{ marginTop: 18 }}>
            <RotateCw size={16} aria-hidden />
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
