import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Inbox, Mail, MessageCircle, Phone, SearchX } from 'lucide-react';
import { ApiError, getCatalog, getMe, getTicket, getTickets } from '@/lib/api';
import { age, ageGroup, ageLong, formatBudget, formatDateTime, formatNumber, isOverdue, phoneDigits, type AgeGroup } from '@/lib/format';
import type { Catalog, Staff, Ticket, TicketWithHistory } from '@/lib/types';
import { FilterBar } from './filter-bar';
import { StatusControl } from './status-control';

export const metadata: Metadata = { title: 'Requests' };

const DAY = 24 * 60 * 60_000;

const VIEWS = {
  open: 'Needs a reply',
  overdue: 'Open over 7 days',
  new: 'New this week',
  in_review: 'In review',
  quoted: 'Quoted',
  closed: 'Closed',
  all: 'All requests',
} as const;
type View = keyof typeof VIEWS;

// Views about people waiting list the longest wait first; the rest list newest first.
const WAITING_VIEWS: View[] = ['open', 'overdue', 'in_review'];

const WAITING_GROUPS: [AgeGroup, string][] = [
  ['week_plus', 'Waiting 7+ days'],
  ['week', 'This week'],
  ['today', 'Today'],
];
const RECENT_GROUPS: [AgeGroup, string][] = [
  ['today', 'Today'],
  ['week', 'This week'],
  ['week_plus', 'Earlier'],
];

type Search = { view?: string; q?: string; id?: string };

function inView(t: Ticket, view: View, now: number) {
  switch (view) {
    case 'all':
      return true;
    case 'overdue':
      return isOverdue(t, now);
    case 'new':
      return now - Date.parse(t.createdAt) <= 7 * DAY;
    default:
      return t.status === view;
  }
}

function matches(t: Ticket, q: string, catalog: Catalog) {
  if (!q) return true;
  const hay = [t.ref, t.location, t.requester.name, t.requester.email, t.requester.phone, ...t.parkTypes.map((k) => catalog.parkTypes[k] ?? k)]
    .join(' ')
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((word) => hay.includes(word));
}

const parkTitle = (t: Ticket, catalog: Catalog) => t.parkTypes.map((k) => catalog.parkTypes[k] ?? k).join(' · ');

function href(params: { view: View; q: string; id?: number }) {
  const s = new URLSearchParams();
  if (params.view !== 'open') s.set('view', params.view);
  if (params.q) s.set('q', params.q);
  if (params.id) s.set('id', String(params.id));
  return `/requests${s.size ? `?${s}` : ''}`;
}

export default async function RequestsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const view: View = sp.view && sp.view in VIEWS ? (sp.view as View) : 'open';
  const q = (sp.q ?? '').trim();
  const requestedId = Number(sp.id) || null;

  const [tickets, catalog, me] = await Promise.all([getTickets(), getCatalog(), getMe()]);
  const now = Date.now();

  const waiting = WAITING_VIEWS.includes(view);
  const shown = tickets
    .filter((t) => inView(t, view, now) && matches(t, q, catalog))
    .sort((a, b) => (waiting ? 1 : -1) * (Date.parse(a.createdAt) - Date.parse(b.createdAt)));
  const groups = (waiting ? WAITING_GROUPS : RECENT_GROUPS)
    .map(([key, label]) => ({ key, label, items: shown.filter((t) => ageGroup(t.createdAt, now) === key) }))
    .filter((g) => g.items.length);

  const selectedId = requestedId ?? shown[0]?.id ?? null;
  let selected: TicketWithHistory | null = null;
  let selectedMissing = false;
  if (selectedId) {
    try {
      selected = await getTicket(selectedId);
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 404)) throw err;
      selectedMissing = true;
    }
  }

  const counts = {
    overdue: tickets.filter((t) => isOverdue(t, now)).length,
    open: tickets.filter((t) => t.status === 'open').length,
    new: tickets.filter((t) => now - Date.parse(t.createdAt) <= 7 * DAY).length,
    quoted: tickets.filter((t) => t.status === 'quoted').length,
  };
  const kpis: { view: View; label: string; value: number; warn?: boolean }[] = [
    { view: 'overdue', label: 'Open over 7 days', value: counts.overdue, warn: true },
    { view: 'open', label: 'Waiting for a reply', value: counts.open },
    { view: 'new', label: 'New this week', value: counts.new },
    { view: 'quoted', label: 'Quoted', value: counts.quoted },
  ];

  return (
    <main className="page">
      <h1 className="visually-hidden">Requests</h1>
      <div className={`workspace${requestedId ? ' has-selection' : ''}`}>
        <nav className="kpis" aria-label="Quick filters" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
          {kpis.map((k) => (
            <Link
              key={k.view}
              href={href({ view: k.view, q: '' })}
              className={`kpi${k.warn ? ' kpi-warn' : ''}${k.warn && !k.value ? ' is-zero' : ''}`}
              aria-current={view === k.view && !q ? 'true' : undefined}
            >
              {k.label}
              <b>{formatNumber(k.value)}</b>
            </Link>
          ))}
        </nav>

        <section className="panel list-panel" aria-label="Request list">
          <FilterBar view={view} q={q} views={VIEWS} />
          <div className="list-scroll">
            {groups.length ? (
              groups.map((g) => (
                <section key={g.key} aria-labelledby={`g-${g.key}`}>
                  <h2 id={`g-${g.key}`} className={`group-head${waiting && g.key === 'week_plus' && view !== 'in_review' ? ' is-late' : ''}`}>
                    <span>{g.label}</span>
                    <span className="tabular">{g.items.length}</span>
                  </h2>
                  <ul>
                    {g.items.map((t) => (
                      <li key={t.id}>
                        <StubRow ticket={t} catalog={catalog} now={now} current={t.id === selectedId} href={href({ view, q, id: t.id })} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            ) : (
              <EmptyList view={view} q={q} total={tickets.length} />
            )}
          </div>
        </section>

        <section className="panel detail-panel" aria-label="Request details">
          {selected ? (
            <Detail ticket={selected} catalog={catalog} me={me} backHref={href({ view, q })} now={now} />
          ) : (
            <div className="detail detail-empty">
              <div>
                {selectedMissing ? (
                  <>
                    <h2 style={{ fontSize: 18 }}>This request no longer exists</h2>
                    <p style={{ marginTop: 6 }}>The client may have deleted their account, which removes their requests.</p>
                    <Link href={href({ view, q })} className="btn" style={{ marginTop: 16 }}>
                      Back to the list
                    </Link>
                  </>
                ) : (
                  <p>Pick a request from the list to read it here.</p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StubRow({ ticket: t, catalog, now, current, href }: { ticket: Ticket; catalog: Catalog; now: number; current: boolean; href: string }) {
  const late = isOverdue(t, now);
  const status = catalog.statuses[t.status] ?? t.status;
  return (
    <Link href={href} className="stub-row" aria-current={current ? 'true' : undefined} scroll={false}>
      <div className="stub-main">
        <h3>{parkTitle(t, catalog)}</h3>
        <p>
          {t.requester.name} · {t.location} · <span className="tabular">{formatBudget(t.budget, t.currency)}</span>
        </p>
      </div>
      <div className="stub-side">
        <span className={`stub-age${late ? ' is-late' : ''}`} title={`Raised ${ageLong(t.createdAt, now)} ago`}>
          <span aria-hidden>{age(t.createdAt, now)}</span>
          <span className="visually-hidden">
            raised {ageLong(t.createdAt, now)} ago{late ? ', overdue' : ''}
          </span>
        </span>
        <span className={`pill pill-${t.status}`}>{status}</span>
      </div>
    </Link>
  );
}

function EmptyList({ view, q, total }: { view: View; q: string; total: number }) {
  if (!total) {
    return (
      <div className="list-empty">
        <Inbox size={32} aria-hidden />
        <h3>No requests yet</h3>
        <p>When a client sends a request from the E7 Parks app, it appears here straight away.</p>
      </div>
    );
  }
  if (q) {
    return (
      <div className="list-empty">
        <SearchX size={32} aria-hidden />
        <h3>Nothing matches &ldquo;{q}&rdquo;</h3>
        <p>
          Search looks at names, emails, phone numbers, places, park types and references in <b>{VIEWS[view].toLowerCase()}</b>.{' '}
          <Link href={href({ view: 'all', q })}>Search all requests</Link>
        </p>
      </div>
    );
  }
  const message: Partial<Record<View, string>> = {
    open: 'Every request has had a reply. Nice work.',
    overdue: 'No client has waited more than a week.',
    new: 'No new requests in the last 7 days.',
  };
  return (
    <div className="list-empty">
      <Inbox size={32} aria-hidden />
      <h3>{message[view] ?? `No requests are ${VIEWS[view].toLowerCase()}.`}</h3>
      <p>
        <Link href={href({ view: 'all', q: '' })}>See all requests</Link>
      </p>
    </div>
  );
}

function Detail({ ticket: t, catalog, me, backHref, now }: { ticket: TicketWithHistory; catalog: Catalog; me: Staff; backHref: string; now: number }) {
  const first = t.requester.name.split(/\s+/)[0];
  const subject = `Your E7 park request ${t.ref}`;
  const greeting = `Hello ${first}, this is ${me.builtin ? 'the team' : me.name.split(/\s+/)[0]} from E7 Entertainments about your ${parkTitle(t, catalog).toLowerCase()} request (${t.ref}).`;
  const digits = phoneDigits(t.requester.phone);
  const contact = [
    { method: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/${digits.replace('+', '')}?text=${encodeURIComponent(greeting)}`, external: true },
    { method: 'phone', label: 'Call', icon: Phone, href: `tel:${digits}` },
    { method: 'email', label: 'Email', icon: Mail, href: `mailto:${t.requester.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${greeting}\n\n`)}` },
  ].sort((a, b) => Number(b.method === t.contactMethod) - Number(a.method === t.contactMethod));
  const late = isOverdue(t, now);

  return (
    <article className="detail" aria-labelledby="detail-title">
      <Link href={backHref} className="btn btn-quiet btn-sm detail-back" scroll={false}>
        <ArrowLeft size={16} aria-hidden />
        All requests
      </Link>
      <h2 id="detail-title" className="detail-title">
        {parkTitle(t, catalog)}
      </h2>
      <div className="detail-meta">
        <span className="mono">{t.ref}</span>
        <span>Raised {formatDateTime(t.createdAt)}</span>
        <span className={`pill pill-${t.status}`}>{catalog.statuses[t.status]}</span>
        {late ? (
          <span className="pill pill-overdue">
            Waiting {ageLong(t.createdAt, now)}
          </span>
        ) : null}
      </div>

      <div className="requester">
        <strong>{t.requester.name}</strong>
        <a href={`mailto:${t.requester.email}`}>{t.requester.email}</a>
        <a href={`tel:${digits}`} className="tabular">
          {t.requester.phone}
        </a>
      </div>

      <div className="contact">
        {contact.map((c, i) => (
          <a
            key={c.method}
            href={c.href}
            className={`btn${i === 0 ? ' btn-primary' : ''}`}
            {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <c.icon size={16} aria-hidden />
            {c.label} {i === 0 ? `${first} (preferred)` : null}
          </a>
        ))}
      </div>

      <dl className="facts">
        <div>
          <dt>Budget</dt>
          <dd>{formatBudget(t.budget, t.currency)}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{t.location}</dd>
        </div>
        <div>
          <dt>Timeline</dt>
          <dd>{catalog.timelines[t.timeline] ?? t.timeline}</dd>
        </div>
        <div>
          <dt>Site area</dt>
          <dd>{t.siteArea ?? <span style={{ color: 'var(--muted)', fontWeight: 400 }}>Not given</span>}</dd>
        </div>
        <div>
          <dt>Expected daily visitors</dt>
          <dd>{t.expectedVisitors != null ? formatNumber(t.expectedVisitors) : <span style={{ color: 'var(--muted)', fontWeight: 400 }}>Not given</span>}</dd>
        </div>
        <div>
          <dt>Contact by</dt>
          <dd>{catalog.contactMethods[t.contactMethod] ?? t.contactMethod}</dd>
        </div>
      </dl>

      <section className="section" aria-labelledby="s-status">
        <h2 id="s-status">Status</h2>
        <StatusControl key={`${t.id}-${t.status}`} id={t.id} current={t.status} statuses={catalog.statuses} />
      </section>

      <section className="section" aria-labelledby="s-notes">
        <h2 id="s-notes">From the client</h2>
        <p className={`notes${t.notes ? '' : ' is-empty'}`}>{t.notes || 'No additional information.'}</p>
      </section>

      <section className="section" aria-labelledby="s-history">
        <h2 id="s-history">History</h2>
        <ol className="timeline">
          {t.history.map((e, i) => (
            <li key={i}>
              Moved to <b>{catalog.statuses[e.to] ?? e.to}</b> by {e.by}
              <time dateTime={e.at}>{formatDateTime(e.at)}</time>
            </li>
          ))}
          <li>
            Raised in the E7 Parks app by {t.requester.name}.{' '}
            {t.emailSent ? 'Confirmation email sent.' : <span style={{ color: 'var(--danger)' }}>Confirmation email was not sent.</span>}
            <time dateTime={t.createdAt}>{formatDateTime(t.createdAt)}</time>
          </li>
        </ol>
      </section>
    </article>
  );
}
