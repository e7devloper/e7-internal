# E7 Internal

Staff web app for E7 Entertainments, to live at `internal.e7entertainments.com`. It shows park project requests
raised from the E7 Parks mobile app, the KPIs across them, and lets staff update each request's status.

This repo holds only the web app. The data comes from the E7 Parks server (`server/` in the `e7-parks` project,
hosted on Railway), which this app calls over JSON.

## API

Base URL: `https://api.e7entertainments.com/api/staff`
(until that domain is live: `https://e7-parks-server-production.up.railway.app/api/staff`)

Requests and responses are JSON. Calls from a browser on any origin are allowed (CORS is open; access is
controlled by the token, not cookies).

### Signing in

```http
POST /login
Content-Type: application/json

{ "username": "admin", "password": "…" }
```

```json
{ "token": "eyJ…", "username": "admin" }
```

The username and password are the server's `ADMIN_USER` / `ADMIN_PASSWORD`. The token lasts 12 hours. Send it on
every other call:

```http
Authorization: Bearer <token>
```

A missing or expired token gets `401` with `"code": "UNAUTHENTICATED"`; send the user back to the sign-in screen.
Login is rate limited (40 attempts per 15 minutes per IP, `429`).

### Endpoints

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/me` | `{ "username": "admin" }`. Use it to check a stored token still works. |
| `GET` | `/catalog` | Keys and display labels for park types, timelines, contact methods, currencies and statuses. |
| `GET` | `/tickets` | All requests, newest first. Add `?status=open` (or `in_review`, `quoted`, `closed`) to filter. |
| `GET` | `/tickets/:id` | One request. |
| `PATCH` | `/tickets/:id` | Body `{ "status": "quoted" }`. Returns the updated request. |
| `GET` | `/kpis` | Counts and totals across all requests. |

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
  "status": "open",
  "emailSent": true,
  "createdAt": "2026-10-09T06:28:53.000Z",
  "requester": { "id": 3, "name": "Priya Nair", "email": "priya.nair@lakeviewresorts.example", "phone": "+91 98470 21536" }
}
```

`siteArea`, `expectedVisitors` and `notes` can be `null`. `parkTypes`, `timeline`, `contactMethod` and `status`
hold keys; look up their labels in `/catalog`.

### Statuses

`open` → `in_review` → `quoted` → `closed`. Any status can be set from any other. The client sees the new status
in the mobile app the next time their requests load.

### KPIs

```json
{
  "generatedAt": "2026-10-13T15:06:41.237Z",
  "totalTickets": 4,
  "ticketsLast7Days": 1,
  "ticketsLast30Days": 2,
  "openOlderThan7Days": 0,
  "verifiedClients": 1,
  "byStatus": { "open": 1, "in_review": 1, "quoted": 1, "closed": 1 },
  "byParkType": { "water_park": 1, "dinosaur_park": 1, "…": 0 },
  "byTimeline": { "asap": 1, "…": 0 },
  "byContactMethod": { "email": 1, "phone": 1, "whatsapp": 2 },
  "byCurrency": [{ "currency": "INR", "count": 3, "totalBudget": 195500000 }],
  "perWeek": [{ "weekEnding": "2026-10-13T15:06:41.237Z", "count": 1 }]
}
```

- Every `by…` object lists all keys, including those at zero.
- `byCurrency` keeps budgets per currency; they are never added across currencies.
- `perWeek` is the last 12 weeks, oldest first. The last entry is the 7 days ending at `generatedAt`.
- `openOlderThan7Days` counts requests still `open` more than a week after they were raised.

### Errors

Errors come back as `{ "error": "Human-readable message", "code": "OPTIONAL_CODE" }` with a matching HTTP status
(`400` invalid input, `401` not signed in, `404` not found, `429` rate limited, `500` server fault).
