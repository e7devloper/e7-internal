# E7 Internal

Staff web app for E7 Entertainments at `internal.e7entertainments.com`. Its first job is managing the park project
requests clients raise in the E7 Parks mobile app: a waiting-time inbox (oldest unanswered request on top), the full
request with one-click email / call / WhatsApp, status changes with a history of who changed what, KPIs, and staff
account management.

This repo holds only the web app. All data comes from the E7 Parks server (`server/` in the `e7-parks` repo, on
Railway at `api.e7entertainments.com`).

- Next.js 16 (App Router), deployed on Vercel. No database of its own.
- The API token lives in an httpOnly cookie (`e7_session`, 12 hours); every API call is made server-side, so the
  browser never sees the token or calls the API directly.
- Designed with the impeccable skill (`.claude/skills/impeccable`). Product context is in `PRODUCT.md`, the visual
  system in `DESIGN.md`, and the request workspace's direction in `.impeccable/surfaces/`.

## Run it

Needs Node 20.9+ and the E7 Parks server running (see the `e7-parks` README).

```sh
cp .env.example .env.local   # E7_API_URL=http://localhost:4000/api/staff
npm install
npm run dev                  # http://localhost:3000
```

### First sign-in

1. Sign in with the server's built-in admin: `ADMIN_USER` in the email field and `ADMIN_PASSWORD`.
2. Open **Team** and add yourself as an admin, then everyone else.
3. Sign out and back in with your own account, so status changes carry your name.

## Configuration

| Variable | Purpose |
| --- | --- |
| `E7_API_URL` | The staff API base, e.g. `https://api.e7entertainments.com/api/staff`. Server-side only. |
| `DISPLAY_TIME_ZONE` | IANA zone for displayed dates. Defaults to `Asia/Kolkata`. |

## Deploying

Vercel project `e7-internal`, framework Next.js, with `E7_API_URL` set for Production and Preview. Add the domain
`internal.e7entertainments.com` to the project and point its DNS record (GoDaddy) at Vercel as the dashboard shows.

## Staff API

Base URL: `https://api.e7entertainments.com/api/staff`. JSON in and out. Errors are
`{ "error": "Human-readable message", "code": "OPTIONAL_CODE" }` with a matching status (`400` invalid input, `401`
not signed in, `403` not allowed, `404` not found, `409` conflict, `429` rate limited, `500` server fault).

### Signing in

```http
POST /login
{ "email": "anita@e7entertainments.com", "password": "…" }
```

```json
{ "token": "eyJ…", "staff": { "id": 1, "name": "Anita Rao", "email": "anita@e7entertainments.com", "role": "admin", "builtin": false } }
```

Send the token on every other call as `Authorization: Bearer <token>`. It lasts 12 hours and stops working at once
if the account is disabled or its password is reset or changed. The built-in admin signs in with `ADMIN_USER` as
the email (`username` is still accepted for older clients) and gets `"builtin": true`, `"id": null`. Login is rate
limited (40 attempts per 15 minutes per IP).

### Endpoints

| Method | Path | Who | What it does |
| --- | --- | --- | --- |
| `GET` | `/me` | anyone | `{ staff }` for the signed-in person. |
| `POST` | `/me/password` | staff | `{ currentPassword, newPassword }` (10–72 chars). Returns a new `{ token }`; other sessions end. |
| `GET` | `/catalog` | anyone | Labels for park types, timelines, contact methods, currencies, statuses and roles. |
| `GET` | `/tickets` | anyone | All requests, newest first. `?status=open` (or `in_review`, `quoted`, `closed`) filters. |
| `GET` | `/tickets/:id` | anyone | One request, with `history`. |
| `PATCH` | `/tickets/:id` | anyone | `{ "status": "quoted" }`. Recorded in history under the signed-in person. |
| `GET` | `/kpis` | anyone | Counts and totals across all requests. |
| `GET` | `/team` | admin | All staff accounts. |
| `POST` | `/team` | admin | `{ name, email, role, password }` creates an account (`role` is `admin` or `staff`). |
| `PATCH` | `/team/:id` | admin | Any of `{ name, role, active, password }`. Resetting the password or disabling signs them out everywhere. Admins can't disable or demote themselves. |

### A request (ticket)

```json
{
  "id": 4,
  "ref": "E7-20261009-2A6E18",
  "parkTypes": ["dinosaur_park"],
  "budget": 9000000,
  "currency": "AED",
  "location": "Ras Al Khaimah, UAE",
  "siteArea": "4 hectares",
  "expectedVisitors": 1800,
  "timeline": "12_plus_months",
  "contactMethod": "whatsapp",
  "notes": "Early-stage idea with a partner in the UAE…",
  "status": "in_review",
  "emailSent": true,
  "createdAt": "2026-10-09T06:28:53.000Z",
  "statusChangedAt": "2026-10-15T12:31:17.496Z",
  "statusChangedBy": "Anita Rao",
  "requester": { "id": 3, "name": "Priya Nair", "email": "priya.nair@lakeviewresorts.example", "phone": "+91 98470 21536" },
  "history": [{ "by": "Anita Rao", "staffId": 1, "from": "open", "to": "in_review", "at": "2026-10-15T12:31:17.496Z" }]
}
```

`history` (newest first) is only on `GET`/`PATCH /tickets/:id`. `siteArea`, `expectedVisitors`, `notes`,
`statusChangedAt` and `statusChangedBy` can be `null`. Statuses go `open` → `in_review` → `quoted` → `closed`, and
any status can be set from any other; the client sees it in the mobile app the next time their requests load.

### KPIs

`totalTickets`, `ticketsLast7Days`, `ticketsLast30Days`, `openOlderThan7Days`, `verifiedClients`, zero-filled
`byStatus` / `byParkType` / `byTimeline` / `byContactMethod`, `byCurrency` (budgets per currency, never summed
across currencies) and `perWeek` (last 12 weeks, oldest first, the last entry being the 7 days ending at
`generatedAt`).
