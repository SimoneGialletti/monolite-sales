# Monolite Platform — UI Kit

A pixel-faithful recreation of the Monolite product shell, derived from
`SimoneGialletti/monolite-ai` (`ui/src`).

## Structure

- `index.html` — interactive demo with the product shell. Click the
  company tiles, sidebar items, and the **New Issue** button.
- `Shell.jsx` — the three-column layout (CompanyRail · Sidebar · Main).
- `CompanyRail.jsx` — the 72px-wide vertical rail with squircle company
  tiles + heartbeat dot.
- `Sidebar.jsx` — the 240px sidebar with sections (Work · Projects ·
  Agents · Company) and the bottom Documentation row.
- `BreadcrumbBar.jsx` — the 48px-tall top bar with uppercase page H1.
- `Dashboard.jsx` — sample main view with active agents + activity feed.
- `IssueDialog.jsx` — modal showing the Monolite dialog pattern.

## Notes

- This is a **visual recreation**, not a runtime. State is local. Routing
  and data fetching are stubbed.
- All components consume tokens from `../../colors_and_type.css` so they
  inherit theme switches.
- Dark by default — toggle in the breadcrumb bar.
