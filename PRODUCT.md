# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) deployed on Vercel at `internal.e7entertainments.com` (owner decision). No database of its own:
all data comes from the E7 Parks API (`api.e7entertainments.com`, the `server/` in the `e7-parks` repo, on
Railway). The API token is held in an httpOnly cookie and every API call is made server-side.

## Users

E7 Entertainments staff: sales and project people who follow up with prospective clients, and the admins who run
the team. They work at a desk on a laptop or desktop, checking the inbox several times a day, and sometimes on a
phone between meetings. Each person has their own account (owner decision), so what they do is attributed to them.

## Product Purpose

The internal workspace for E7 staff. Its first job is managing the park project requests clients raise in the E7
Parks mobile app: see what came in, read a request in full, contact the client by the method they asked for, and
move the request through Open → In review → Quoted → Closed. Success is that no request sits unanswered and every
client hears back. Other internal tools may be added later; none are decided.

## Positioning

Built for E7's own process: one park type per request, budgets kept in the client's currency (INR, USD, AED, EUR,
never summed across currencies), and the client sees the status a staff member sets.

## Operating Context

- A request comes from the mobile app with: requester (name, email, phone), park type, budget and currency,
  location, optional site area and expected daily visitors, timeline, preferred contact method (email, phone call,
  WhatsApp), free-text notes, a reference such as `E7-20261013-068128`, and a created time.
- Staff contact the client outside this app (mail client, phone, WhatsApp), launched from links here.
- Each status change is recorded with who made it and when.
- Admins add staff accounts, reset passwords and disable accounts. A built-in admin login from the server's
  environment (`ADMIN_USER` / `ADMIN_PASSWORD`) exists to set up the first accounts.
- The older built-in dashboard at `api.e7entertainments.com/internal` still works with the built-in admin login.

## Capabilities and Constraints

- v1: request inbox with status filter and search, request detail, status changes with history, contact links,
  KPIs, staff account management, change own password.
- Not in v1 (undecided): internal notes, assigning an owner, editing request fields, attachments, email sending
  from this app.
- Statuses: `open`, `in_review`, `quoted`, `closed`; any status can be set from any other.
- Labels for park types, timelines, contact methods and statuses come from the API's `/catalog`.

## Brand Commitments

- Name: E7 Entertainments; this site is "E7 Internal".
- Logo: the gradient "E7" mark (`public/logo.png`, from the E7 Parks app and e7entertainments.com).
- Colours and type follow e7entertainments.com (owner instruction for the E7 Parks app): navy ink `#1f3864`, gold
  `#f0a821`, pale ground `#f4f7fb`, Montserrat for display.

## Evidence on Hand

- Real requests come from the API. No customer names, figures or testimonials may be invented in the UI; demo data
  only via the server's `seed:demo` script in development.

## Product Principles

1. Nothing waits silently: what needs a reply, and how long it has waited, is the first thing a person sees.
2. A request is read in one place, with everything needed to call the client back.
3. Every change says who made it.
4. Internal and quiet: a tool for daily use, not a showcase.

## Accessibility & Inclusion

WCAG AA contrast, full keyboard operation, visible focus, works at phone width.
