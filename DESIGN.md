---
name: E7 Internal
description: Staff workspace for E7 Entertainments, where requests are ticket stubs sorted by how long the client has waited.
colors:
  heading: "#1f3864"
  header-raised: "#2c4a80"
  action: "#f0a821"
  action-hover: "#e29a12"
  action-soft: "#fff6e2"
  ground: "#f4f7fb"
  surface: "#ffffff"
  surface-alt: "#e8eef7"
  line: "#e1e8f0"
  perf: "#cfd9e6"
  input-border: "#7f8ea5"
  text: "#3d4c5e"
  muted: "#5a6a80"
  on-header-muted: "#c9d4e8"
  danger: "#a8201a"
  danger-soft: "#fcebea"
  success: "#14613a"
  success-soft: "#ddf3e6"
  open-bg: "#fdf1d7"
  open-fg: "#6b4a00"
  review-bg: "#e3ecfb"
typography:
  display:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.15
    fontFeature: "tnum"
  stub-age:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  button:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
  group-label:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.04em"
  mono:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.86em"
    letterSpacing: "0"
rounded:
  sm: "8px"
  control: "10px"
  md: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.heading}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.heading}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.heading}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "42px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-alt}"
  button-quiet:
    textColor: "{colors.heading}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "34px"
  button-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "42px"
  button-danger-hover:
    backgroundColor: "{colors.danger-soft}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.heading}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "42px"
  pill-open:
    backgroundColor: "{colors.open-bg}"
    textColor: "{colors.open-fg}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "24px"
  pill-in-review:
    backgroundColor: "{colors.review-bg}"
    textColor: "{colors.heading}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "24px"
  pill-quoted:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "24px"
  pill-closed:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "24px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
  kpi-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 18px 14px"
  kpi-tile-warn:
    backgroundColor: "{colors.action-soft}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
  stub-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
  topbar:
    backgroundColor: "{colors.heading}"
    textColor: "{colors.surface}"
    height: "60px"
    padding: "0 28px"
  nav-link:
    textColor: "{colors.on-header-muted}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "38px"
  nav-link-active:
    backgroundColor: "{colors.header-raised}"
    textColor: "{colors.surface}"
  segmented-option:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.heading}"
    typography: "{typography.label}"
    padding: "0 18px"
    height: "42px"
  segmented-option-active:
    backgroundColor: "{colors.heading}"
    textColor: "{colors.surface}"
---

# Design System: E7 Internal

## Overview

**Creative North Star: "The Ticket Counter"**

E7 Internal is a quiet desk tool that carries the E7 Parks brand into a staff workspace. A navy bar sits over a pale blue-grey ground; white panels with hairline edges hold the work. Every client request is drawn as a ticket stub: the details on the left, a dashed perforation, and a stub on the right carrying how long the client has waited and the request's status. The stub is the one ornamental idea in the system, and it is functional: it puts the wait age where the eye lands when scanning down a list.

Density is moderate and desk-first: 15px body type, 42px controls, panels with 20-32px of padding. Colour is used for state, not decoration. Gold is the single action colour and only ever appears as a fill with navy on it. Red appears only when a client has been waiting too long or something failed. The four request statuses each have a soft tinted pill, and that palette of pills is the only place several hues meet.

Montserrat carries the brand in headings, buttons, numbers and ages; the system sans does the reading. Motion is a 160ms ease-out on hover and focus changes, and nothing else moves except the loading spinner. Reduced-motion users get zero-duration transitions.

**Key Characteristics:**
- Navy top bar and navy ink on a pale blue-grey ground, white hairline panels.
- Gold as fill-only primary action, with navy text on it.
- Requests as ticket stubs with the wait age on the stub.
- Status shown as soft tinted pills: open amber, in review blue, quoted green, closed grey.
- Montserrat for headings, buttons and figures; system sans for reading.
- Flat panels with a faint navy-tinted ambient shadow; no lifted cards.

## Colors

A brand-led navy and gold palette on cool, pale neutrals, with four soft status tints and one alarm red.

### Primary
- **E7 Navy** (heading): the brand ink. Top bar, all headings, field labels, link colour, input text, the active segmented option, selected stub outline, chart bars. Also the colour of text on gold.
- **Raised Navy** (header-raised): the current page's nav pill inside the navy bar, one step lighter so it reads as raised rather than highlighted.

### Secondary
- **Marquee Gold** (action): the primary action fill (one gold button per view, e.g. the preferred contact method or Sign in), the overdue KPI tile border, the avatar, the current week's chart bar, and the focus outline.
- **Deep Gold** (action-hover): the hover fill and border for gold controls.
- **Gold Wash** (action-soft): background of the overdue KPI tile while there are overdue requests.

### Neutral
- **Pale Ground** (ground): page background and the notes well inside a request.
- **Panel White** (surface): panels, stubs, inputs, secondary buttons.
- **Cool Mist** (surface-alt): hover fill for secondary and quiet buttons, closed-status pill, bar-chart tracks.
- **Hairline** (line): panel borders, dividers, table rules, timeline spine.
- **Perforation Blue** (perf): the dashed tear line between a stub's details and its age.
- **Field Stroke** (input-border): input and select borders (strong enough for 3:1 non-text contrast), hover border on stubs and KPI tiles, inactive timeline dots.
- **Slate Ink** (text): body text.
- **Slate Muted** (muted): secondary text, metadata, hints, group labels, table headers.
- **Bar Mist** (on-header-muted): resting nav and account links inside the navy bar.

### Status
- **Overdue Red** (danger) on **Red Wash** (danger-soft): wait ages and the "Waiting 7+ days" group label when overdue, the overdue pill in the detail header, error alerts, danger buttons, invalid inputs.
- **Quoted Green** (success) on **Green Wash** (success-soft): quoted pill and success alerts.
- **Open Amber** (open-fg) on **Amber Wash** (open-bg): open pill.
- **Review Blue** (review-bg) with E7 Navy text: in-review pill and info alerts.

### Named Rules
**The Gold Is a Fill Rule.** Gold never sets text or icons on a light surface; it reaches only about 1.9:1 on white. It appears as a fill with navy on it, as a border, or as the focus ring.

**The One Gold Button Rule.** A view has at most one gold button: the one action the person most likely came to take. Everything else is a white button with a navy outline, or quiet.

**The Red Means Waiting Rule.** Red is reserved for overdue waits and failures. It never decorates, and no status pill is red.

## Typography

**Display Font:** Montserrat (600 and 700, loaded via next/font, falling back to system-ui)
**Body Font:** system-ui (with -apple-system, Segoe UI, Roboto)
**Label/Mono Font:** ui-monospace (SF Mono, Menlo, Consolas) for request references only

**Character:** Montserrat's wide geometric caps carry the E7 brand in short bursts: titles, button labels, counts and ages. The system sans keeps long reading native and fast.

### Hierarchy
- **Display** (700, 34px, 1.15): the sign-in brand panel title only; 26px under 960px.
- **Headline** (700, 26px, 1.2): the request title in the detail pane; page titles sit one step down at 24px.
- **Title** (700, 15-17px, 1.3): section headings inside a request (15px), form card headings (17px), stub titles (14.5px), chart headings (16px).
- **Figure** (700, 28px, tabular): KPI counts; 24px under 560px.
- **Stub Age** (700, 16px, tabular): the wait age on a ticket stub.
- **Button** (700, 14px): all button labels; 13px on small buttons.
- **Body** (400, 15px, 1.5): everything read. Notes are capped at 75ch.
- **Label** (600, 13px): field labels; hints and metadata share the size at 400 in Slate Muted.
- **Group Label** (600, 12px, 0.04em, uppercase): list group headings ("Waiting 7+ days", "This week", "Today") with their counts, and table column headers. These name real groups of content below them.

### Named Rules
**The Numbers Line Up Rule.** Every count, age, budget, date and table cell uses tabular figures so columns of numbers scan vertically.

**The Montserrat Is for Short Things Rule.** Montserrat sets headings, buttons, figures and ages. Sentences are always in the system sans.

## Layout

A sticky 60px navy bar spans the top. Pages sit in a centred container (max 1600px) with 24px top and 28px side padding (16px under 960px). Page titles align with their actions in a flex row.

The requests workspace is a two-column grid: a list panel (380-520px) and a fluid detail pane, 20px apart. The list panel is sticky below the bar and scrolls internally; group headings stick to its top. A four-tile KPI strip spans both columns above them (two columns under 960px). Inside a request, facts sit in a three-column grid (two under 1180px, one under 560px).

Under 960px the workspace shows one pane at a time: the list, or the selected request with a back link. Under 560px the segmented status control becomes a 2x2 grid, contact buttons go full width, and the filter bar stacks. Team rows become stacked blocks under 760px. Settings-style pages use a content column plus a 360px side column, stacked under 1180px.

Spacing runs on a 4px base, mostly in steps of 8, 12, 16, 20, 24 and 28px. Controls are 42px tall (34px small) so they work as touch targets on a phone.

## Elevation & Depth

Flat, with one faint ambient layer. Panels sit on the ground with a hairline border and a soft navy-tinted shadow that separates white from pale blue-grey without lifting anything. Stubs, KPI tiles and inputs carry no shadow; their hover response is a stronger border. Selection is shown with an inset navy outline, not elevation.

### Shadow Vocabulary
- **Panel Ambient** (`box-shadow: 0 1px 2px rgb(31 56 100 / 0.04), 0 4px 16px rgb(31 56 100 / 0.05)`): every panel (list, detail, form cards, charts, tables).

### Named Rules
**The Border Answers Rule.** Hover and selection change a border, never a shadow: Hairline at rest, Field Stroke on hover, navy with an inset 1px ring when selected or current.

## Shapes

Gently rounded throughout. Panels and KPI tiles use 12px corners; buttons, stubs, the segmented control and the notes well use 10px; inputs, nav links and alerts use 8px. Status pills and bar tracks are fully round, the avatar is a circle, and chart columns round only their top corners (4px).

The ticket stub is the signature silhouette: a 96px stub column divided from the details by a 2px dashed perforation in Perforation Blue, with two half-round notches (12x7px) cut into the top and bottom edges where the perforation meets the border.

## Components

### Buttons
Confident and compact: Montserrat 700 labels, a navy outline, and gold reserved for the one action that matters.
- **Shape:** 10px corners, 42px tall, 18px side padding (small: 34px, 12px, 13px label). Icons sit 8px before the label at 16px.
- **Primary:** Marquee Gold fill and border, navy label. Hover deepens to Deep Gold.
- **Secondary (default):** white with a 1px navy border and navy label; hover fills Cool Mist.
- **Quiet:** transparent with no border; hover fills Cool Mist. Used for back links and row actions.
- **Danger:** white with a red border and label; hover fills Red Wash.
- **Press / Disabled:** a 1px downward nudge on press; 55% opacity and a not-allowed cursor when disabled.
- **Focus:** a 3px gold outline, 2px offset.

### Status Pills
- **Style:** 24px tall, fully round, 12px semibold, no border. Tint and text pair per status: Amber Wash / Open Amber, Review Blue / navy, Green Wash / Quoted Green, Cool Mist / Slate Muted.
- **Use:** on every stub and in the request header. An overdue pill (Red Wash, Overdue Red) appears beside the status in the detail header.

### Panels
- **Corner Style:** 12px.
- **Background:** Panel White on Pale Ground.
- **Shadow Strategy:** Panel Ambient (see Elevation).
- **Border:** 1px Hairline.
- **Internal Padding:** 28-32px for the request detail, 22-24px for form cards, 20-22px for charts.

### KPI Tiles
Each tile is a link that filters the list. White, 1px Hairline, 12px corners, a 13px muted caption over a 28px Montserrat figure. The overdue tile is Gold Wash with a gold border while its count is above zero, and returns to plain white at zero. The active filter shows a 2px navy ring.

### Inputs / Fields
- **Style:** white, 1px Field Stroke border, 8px corners, 42px tall, navy text. Labels sit 6px above in 13px semibold navy; hints below in 13px muted.
- **Focus:** border turns navy and a 3px gold halo (55% alpha) appears.
- **Error:** red border; the error is spelled out in a red alert above the form.

### Navigation
Links sit in the navy bar in Bar Mist, 38px tall with 8px corners. Hover turns them white over an 8% white wash; the current page gets a Raised Navy pill with white text. The account area on the right holds a gold circular avatar with navy initials. Under 960px the brand name and person's name hide; under 560px links tighten to 8px padding.

### Segmented Status Control
A single 1px navy outline holding the four statuses as 42px options divided by navy rules. The current status is filled navy with white text; others hover Cool Mist. It becomes a 2x2 grid on phones.

### Ticket Stub Row (signature)
The request list row. White, 1px Hairline, 10px corners, 8px apart in the list. Left: a 14.5px Montserrat title and one muted line of requester, location and budget, truncated with an ellipsis. Right: the 96px stub, behind a dashed perforation and notches, carrying the wait age in 16px Montserrat (red once overdue) over the status pill. Hover strengthens the border to Field Stroke; the open request gets a navy border, an inset navy ring and a near-white tint, with the notches redrawn in navy.

### History Timeline
A 2px Hairline spine with 10px ring dots; the most recent entry's dot is solid navy. Each entry gives the change, then who made it and when in 12.5px muted.

## Do's and Don'ts

### Do:
- **Do** use Marquee Gold only as a fill, border or focus ring, with navy text on gold fills.
- **Do** limit each view to one gold button: the preferred contact method in a request, Sign in on the sign-in page.
- **Do** draw every request in a list as a ticket stub with its wait age on the stub.
- **Do** use tabular figures for every number, age, budget and date.
- **Do** keep panels flat with the Panel Ambient shadow and answer hover with a stronger border.
- **Do** keep controls at 42px (34px small) so they work at phone width.

### Don't:
- **Don't** set gold text or gold icons on white or Pale Ground.
- **Don't** use red for anything other than overdue waits, errors and destructive actions.
- **Don't** introduce new status hues; the four status tints are the full set.
- **Don't** set sentences in Montserrat; it is for headings, buttons, figures and ages.
- **Don't** lift cards with larger shadows on hover; depth stays constant.
