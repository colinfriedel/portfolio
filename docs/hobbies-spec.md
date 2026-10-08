# Hobbies and Interests page: spec (implemented at /hobbies)

Owner: Colin Friedel. Site: colin.friedelsweb.com (repo github.com/colinfriedel/portfolio, deployed on Vercel). Audience: recruiters and hiring managers first, friends second. Goal: show personality beyond code while feeling like the same site as Home, Projects and Resume.

Implemented in `src/components/hobbies/` and `src/app/hobbies/`. Do not redesign; see CLAUDE.md for the editing rules.

## Look
Same tokens and chrome as the homepage (via `site.css`): Mt. Diablo fixed background photo, cream glass `.panel` (max-width 1240px), `← Home` pill button, system-ui fonts, pill chips (selected = dark ink fill), accent `#b4531f`. Dashed boxes are photo placeholders.

## Layout (desktop >= 981px: the whole page fits the viewport, no scroll)
Top bar: Back button, title, one-line intro. Then a 12-column grid:
1. Music card (5 cols, left)
2. Outdoors & Travel card (7 cols, right)
3. Photography card (full width, short strip below)
The panel is fixed to viewport height (min 640px). Below 981px the cards stack and the page scrolls.
Each card has an expand button (top right) that opens a detail modal. URL hash `#music`, `#outdoors`, `#photo` opens the modal; Esc, scrim click and Close button dismiss it; focus returns to the opener.

## Music card
- Tabs: Listening / Playing.
- Listening: range chips 1 month, 6 months, 12 months (from Spotify; it has no all-time range, so the chips follow the ranges in music-stats.json). Top 5 artists (letter avatars) and top 5 tracks. "Sample data" tag while `sample` is true.
- Playing: the four guitars (Yamaha FG-TA, PRS Custom 24, Yamaha FG-JR1, Suzuki SUA-D, "my first guitar") and three performance slots (Valley Oak Respite Center, college band, a cappella).
- Modal: top 10 lists with range chips, full-size guitars and performance grid.

## Outdoors & Travel card
- Left column: miles hiked this year (with 12-month bar mini chart) and all time (count-up animation), US / World switch, "National parks" toggle, counts and legend.
- US view: SVG map of states, visited states filled accent. "National parks" toggle fades in 21 tree-shaped pins and animates a zoom to the western US so the Utah cluster is readable. Hover/focus/tap a pin shows the park name tooltip.
- World view: orthographic globe on canvas, visited countries filled, drag to rotate, slow auto-spin that pauses after interaction, chips per country rotate the globe to it. Liechtenstein is tiny so it gets a dot marker (`marker: true`). World data is lazy-loaded the first time the globe opens.
- Modal: larger map/globe plus stat tiles and full lists.

## Photography card
Favorites row (6 squares), cameras (Canon PowerShot SD1000, Nikon D60), category chips (Trail, Landscape, Travel, Music) and an "All photos →" button. Modal: gallery with category filter chips.

## Data contracts
See `src/content/hobbies/*.json` (`_readme` at the top of each). The JSON is imported at build time; only the world geo (`public/data/hobbies-geo-world.json`) is fetched, the first time the globe opens.

## Accessibility
Real buttons for all controls, `aria-pressed` / `aria-selected` state, visible focus ring, pins are keyboard focusable, modal traps focus and restores it, map/globe have aria-labels, reduced-motion respected, tap targets usable on touch.

## Placeholder status
All copy, sample listening and hiking numbers, and every photo slot are placeholders. Colin will rewrite the copy himself and supply photos.

## Acceptance checklist
- [ ] Nav "Hobbies and Interests" opens /hobbies; Back returns Home.
- [ ] Matches homepage tokens/fonts/background; no new fonts or CDNs.
- [ ] No scroll at 1280x720, 1366x680, 1440x800, 1920x1080; mobile 390px has no horizontal overflow.
- [ ] Listening/Playing tabs and range chips work; parks toggle zooms and shows tooltips; World switch loads the globe, drag and country chips work.
- [ ] Three expanded views open/close (hash, Esc, scrim, Close); photo category filter works.
- [ ] A photo path in content.json renders an image (cover crop); null shows the placeholder.
- [ ] `npm run build:geo` regenerates the geo files; unknown state/country names give a clear error.
- [ ] `npm run lint` and `npm run build` pass; no console errors.
