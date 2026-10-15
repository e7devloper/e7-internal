import type { Metadata } from 'next';
import Link from 'next/link';
import { getCatalog, getKpis } from '@/lib/api';
import { formatBudget, formatDate, formatDateTime, formatNumber } from '@/lib/format';

export const metadata: Metadata = { title: 'Overview' };

function Bars({ rows, fillClass }: { rows: { key: string; label: string; value: number }[]; fillClass?: (key: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="bars">
      {rows.map((r) => (
        <li key={r.key} className={`bar-row${r.value ? '' : ' is-zero'}`}>
          <span>{r.label}</span>
          <span className="track" aria-hidden>
            <span className={`fill ${fillClass?.(r.key) ?? ''}`} style={{ width: `${(r.value / max) * 100}%`, display: 'block' }} />
          </span>
          <b>{formatNumber(r.value)}</b>
        </li>
      ))}
    </ul>
  );
}

export default async function OverviewPage() {
  const [k, catalog] = await Promise.all([getKpis(), getCatalog()]);
  const label = (map: Record<string, string>) => (key: string) => map[key] ?? key;
  const entries = (obj: Record<string, number>, names: (k: string) => string, sort = false) => {
    const rows = Object.entries(obj).map(([key, value]) => ({ key, label: names(key), value }));
    return sort ? rows.sort((a, b) => b.value - a.value) : rows;
  };
  const weekMax = Math.max(1, ...k.perWeek.map((w) => w.count));

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Overview</h1>
          <p>
            {formatNumber(k.totalTickets)} requests in total, {formatNumber(k.ticketsLast30Days)} in the last 30 days, from{' '}
            {formatNumber(k.verifiedClients)} verified clients. Updated {formatDateTime(k.generatedAt)}.
          </p>
        </div>
      </div>

      <div className="chart-grid">
        <section className="panel chart chart-wide" aria-labelledby="c-weeks">
          <h2 id="c-weeks">Requests per week</h2>
          <p>Last 12 weeks. The gold bar is the current week.</p>
          <div className="weeks" aria-hidden>
            {k.perWeek.map((w, i) => (
              <div key={w.weekEnding} className={`week${i === k.perWeek.length - 1 ? ' is-current' : ''}`} title={`${w.count} in the week ending ${formatDate(w.weekEnding)}`}>
                {w.count ? <b>{w.count}</b> : null}
                <span style={{ height: `${(w.count / weekMax) * 85}%` }} />
              </div>
            ))}
          </div>
          <div className="week-labels" aria-hidden>
            {k.perWeek.map((w, i) => (
              <span key={w.weekEnding}>{i % 2 === 1 || i === k.perWeek.length - 1 ? formatDate(w.weekEnding).replace(/ \d{4}$/, '') : ''}</span>
            ))}
          </div>
          <table className="visually-hidden">
            <caption>Requests per week, last 12 weeks</caption>
            <thead>
              <tr>
                <th scope="col">Week ending</th>
                <th scope="col">Requests</th>
              </tr>
            </thead>
            <tbody>
              {k.perWeek.map((w) => (
                <tr key={w.weekEnding}>
                  <td>{formatDate(w.weekEnding)}</td>
                  <td>{w.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel chart" aria-labelledby="c-status">
          <h2 id="c-status">By status</h2>
          <p>
            {k.openOlderThan7Days ? (
              <Link href="/requests?view=overdue">
                {k.openOlderThan7Days} open {k.openOlderThan7Days === 1 ? 'request has' : 'requests have'} waited over a week
              </Link>
            ) : (
              'No open request has waited over a week.'
            )}
          </p>
          <Bars rows={entries(k.byStatus, label(catalog.statuses))} fillClass={(key) => `fill-${key}`} />
        </section>

        <section className="panel chart" aria-labelledby="c-budget">
          <h2 id="c-budget">Budgets by currency</h2>
          <p>Totals stay in each client&rsquo;s currency and are never added across currencies.</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Currency</th>
                  <th scope="col" className="col-count" style={{ textAlign: 'right' }}>
                    Requests
                  </th>
                  <th scope="col" style={{ textAlign: 'right' }}>
                    Total budget
                  </th>
                </tr>
              </thead>
              <tbody>
                {k.byCurrency.map((c) => (
                  <tr key={c.currency}>
                    <td>{c.currency}</td>
                    <td className="col-count" style={{ textAlign: 'right' }}>{formatNumber(c.count)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--heading)' }}>{c.count ? formatBudget(c.totalBudget, c.currency) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel chart" aria-labelledby="c-park">
          <h2 id="c-park">By park type</h2>
          <p>What clients are asking E7 to build.</p>
          <Bars rows={entries(k.byParkType, label(catalog.parkTypes), true)} />
        </section>

        <section className="panel chart" aria-labelledby="c-timeline">
          <h2 id="c-timeline">By timeline</h2>
          <p>When clients want to start.</p>
          <Bars rows={entries(k.byTimeline, label(catalog.timelines))} />
          <h2 style={{ marginTop: 28 }}>Preferred contact</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, margin: '2px 0 16px' }}>How clients asked to be reached.</p>
          <Bars rows={entries(k.byContactMethod, label(catalog.contactMethods), true)} />
        </section>
      </div>
    </main>
  );
}
