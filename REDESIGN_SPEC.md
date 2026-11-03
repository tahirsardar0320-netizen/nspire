# NSPIRE.ai-style redesign spec (client-approved reference)

Client (Koke) saw NSPIRE.ai's redesign and wants ours to match: **separate pages
instead of accordions/modals**. Reference screenshots from the user, 2026-10-30.
Engine/logic must NOT change — this is a view-layer reskin over the existing
save/offline/progress machinery.

## Screen 1 — Property Details (app/dashboard/property-details/[id])
- Header: back arrow + centered "Property Details".
- Card: Property Information — CITY/STATE, ZIP/BUILDINGS, ADDRESS as label-over-value grid.
- Card: Building Information — BUILDING ID / TOTAL UNITS / FOR INSPECTION as 3 big teal stats.
- Card: Inspection Progress — "0/9 Completed" + thin bar.
- Card: Units for Inspection (+ Edit button) — table: # | UNIT NAME | STATUS chip
  (PENDING amber / COMPLETED green) | ACTION (▶ Start teal pill per unit).
- "Export In Progress" green full-width button at bottom.
- Top summary block (property fields + "Selection:" edit icon) like current, simplified.

## Screen 2 — Inspection Categories (inspection-category, no ?section param)
- Teal banner: 🏢 "BUILDING NO: B1".
- Top-right header button: SUMMARY (→ View Summary).
- 3 nav cards, each with icon chip, TITLE, subtitle, thin progress bar, "x/y • z% Complete", chevron:
  - OUTSIDE — "Areas affected by rain, snow, wind" — 0/26
  - INSIDE — "Interior common area, utility closet, mechanical rooms" — 0/39
  - UNITS — "Individual unit inspections" — counts vs sample
- Tap → same route + `&section=outside|inside|units`.

## Screen 3 — Section page (?section=outside|inside; units analogous)
- Teal header: back arrow (→ categories view), big title "Outside"/"Inside",
  subtitle "Building B1 • 9 Units".
- Row: "Progress   0/26 • 0%" + thin bar.
- Legend/action bar: [checkbox] All No OD | red ⬜ "Observe Deficiency" (legend) | [checkbox] All NA.
- Items as individual cards: numbered circle (light blue), item name, then a row of
  3 equal buttons: No OD | OD | N/A (selected = highlighted).
- Sticky bottom pill button: ✔ "Save Progress".

## Screen 4 — Deficiency form as a FULL PAGE (currently a modal)
- Teal header: back arrow, title = item name ("Egress"), subtitle = section ("Outside").
- DEFICIENCY SELECTED — select.
- DEFICIENCY DETAIL — textarea w/ expand icon.
- Teal button: 📄 "How to Inspect (IRC, IBU, Local)" + helper text under it.
- NOTE — textarea "Write your observation...".
- PIC — two circular actions: 📷 Take Photo / 🖼 Choose from Gallery.
- INSPECTION SCORING card: LOCATION (select) | SEVERITY, ALL SAMPLE | PTS LOST (RAW),
  PTS LOST | POSSIBLE SCORE, MAX PTS LOST | SCORE, # OF VIOLATIONS. (Ask Koke for the
  exact formula/table backing these.)
- Bottom: CANCEL (outline) | PROCEED (teal pill).

## Screen 5 — Summary/Report hub ("Inspection Report")
- Header: back + centered "Inspection Report".
- White card: teal "INSPIRE INSPECTION REPORT" title, property name/address lines,
  "Inspection #<id> | date" gray line.
- Amber notice with lock: "Payment required for export" (when locked).
- Button stack (full width, rounded-xl):
  - Export PDF — filled teal, lock+download icons
  - Export HTML — teal outline
  - Export Excel — green outline
  - Preview Report — teal outline, eye icon
  - Continue Inspection — filled green
- Below: solid teal block "PRELIMINARY SCORE" + giant number (then presumably
  severity cards etc.).
- Detailing matters to the client: bold red accents (Observe Deficiency), colored
  outline buttons, lock icons on gated actions.

## Phasing
1. Phase 1: Screens 2+3 via `?section=` view switching inside the existing
   inspection-category component (no logic moves; modals keep rendering in all views).
2. Phase 2: Screen 4 — OD modal restyled as full-page view (same state).
3. Phase 3: Screen 1 property-details reskin (unit Start table).
4. Scoring formula from client → wire real values into the scoring card.

## Visual language
- Header/primary: teal #0E7490→#006795; selected states teal; Observe Deficiency red accent.
- Cards: white, rounded-2xl, soft shadow, generous padding; numbered circles bg-sky-100.
- Status chips: PENDING amber-100/amber-700; COMPLETED green-100/green-700.
- Sticky bottom action pills, full width, rounded-full.
