---
version: 1
slug: "src-app-staff-requests-page-tsx"
primary_target: "src/app/(staff)/requests/page.tsx"
related_targets: []
---

# Requests workspace

Scope: the staff request inbox at `/requests` (list + detail), with Overview, Team and Account sharing its shell. Mode: Operate.

Audience and job: E7 sales/project staff at a desk, several times a day; find who is waiting, read the request, contact the client the way they asked, move the status. Admins also manage accounts.

## Direction contract

THESIS: The inbox sorts itself by how long each client has waited, so the oldest unanswered request is always on top. Refuses the category default of a flat newest-first table with a status column.

OWN-WORLD: E7 brand from the mobile app: navy `#1f3864` top bar and ink, gold `#f0a821` as fill-only primary action, pale blue-grey `#f4f7fb` ground, white panels with `#e1e8f0` hairlines, status pills (open amber, in review blue, quoted green, closed grey), danger red `#a8201a` only for overdue waits. Montserrat for headings, buttons, ages; system sans for everything else. Rows are ticket stubs: details left, a dashed perforation, a stub carrying wait age and status.

STORY: Staff see at a glance how many clients are overdue, open the oldest, contact them with one click on their preferred channel, move the status, and see who changed it.

FIRST VIEWPORT: 60px navy top bar (logo, Requests / Overview / Team, signed-in name). KPI strip of four tiles, the overdue tile gold-tinted. Below, two columns: a ~520px list panel (search + status filter, groups "Waiting 7+ days" / "This week" / "Today", ticket-stub rows with age in the stub, overdue ages red) and a detail pane (reference, park type title, requester, contact buttons with the preferred one gold, 3-column facts grid, status segmented control, notes, history). Signature move: the ticket-stub row with the wait-age clock on its stub.

FORM: Waiting-time inbox, position 7 on my ordered list, seed key 7d39946c.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Decisions

- Only the views about people waiting (Needs a reply, Open over 7 days, In review) list the longest wait first under "Waiting 7+ days / This week / Today". The other views (New this week, Quoted, Closed, All requests) are look-up lists that include requests nobody is waiting on, so they list newest first under "Today / This week / Earlier". The default view is always the waiting one.
