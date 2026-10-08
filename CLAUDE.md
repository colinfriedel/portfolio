@AGENTS.md

# Hobbies and Interests page (`/hobbies`)

Built as React client components in `src/components/hobbies/` (cards, map, globe, expanded views) with styles in `src/app/hobbies/hobbies.css` (every rule scoped under `.hob`, `.hob-page` or `.hob-panel`). Design/behavior spec: `docs/hobbies-spec.md`. Do not redesign it; edit within these rules.

## Hard rules
- Match the rest of the site: reuse the tokens and components in `site.css` (`--ink --ink-soft --paper --accent --line`, `.panel`, `.back`, `.dl`, chips). System font stack only; no web fonts or CDNs. Keep the site `noindex` setting as it is (controlled by `indexable` in `src/content/site.ts`).
- Never write Colin's personal copy. All text lives in `src/content/hobbies/content.json`; replace placeholders only with wording he gives verbatim.
- On desktop (>= 981px wide) everything must fit with no page scroll at 1280x720, 1366x680, 1440x800 and 1920x1080. Re-check after layout changes. Mobile (390px) must have no horizontal overflow.
- Respect `prefers-reduced-motion` (no auto-spin, no animation).
- Keep all text rendering through React (escaped); never use `dangerouslySetInnerHTML` for data.

## Where things live
- `src/content/hobbies/content.json`: all hand-written text, guitar/camera/stage/photo lists, visited states, parks (lat/lon), countries.
- `src/content/hobbies/music-stats.json`: top artists/tracks per range. `"sample": true` shows "Sample data" labels. To be rewritten by a Last.fm job.
- `src/content/hobbies/outdoors-stats.json`: hiking miles (`"sample": true` shows "(sample)"). To be rewritten from the Strava export.
- `src/content/hobbies/geo-us.json` and `public/data/hobbies-geo-world.json`: GENERATED, never hand-edit. After changing `outdoors.states`, `outdoors.parks` or `outdoors.countries` in content.json run `npm run build:geo` (`scripts/build-geo.mjs`).

## Images
- Put photos in `public/images/hobbies/{guitars,cameras,stage,photos}/` and set the path in content.json (`photo` or `src`, e.g. `/images/hobbies/guitars/prs-custom-24.jpg`). `null` shows a dashed placeholder.
- Before committing: resize to ~1600px on the long edge, JPEG quality ~80 (under ~400 KB), and strip EXIF/GPS metadata.
- Valley Oak Respite Center: residents are adults with dementia. Only use stage photos where no resident is identifiable; ask Colin if unsure.

## Data refresh contracts (when asked to build them)
- Last.fm: GitHub Actions cron, secret `LASTFM_API_KEY`. Use `user.getTopArtists`/`user.getTopTracks` with periods `1month`, `6month`, `12month`, `overall` and write `music-stats.json` in the existing shape (`ranges[{id,label,artists[{name}],tracks[{title,artist}]}]`, ids `1m 6m 12m all`), set `sample:false`, `updated` ISO date. Commit only if changed. No live API calls from the site.
- Strava: `node scripts/strava-from-export.mjs path/to/activities.csv` (from the personal data export) rewrites `outdoors-stats.json`: Hike activities only by default (`--types Hike,Walk` to widen), months bucketed in America/Los_Angeles (`--tz`), `--dry-run` to preview. Never commit the CSV or the rest of the export.

## Checking a change
`npm run lint`, `npm run build`, then load `/hobbies` and check: Listening/Playing tabs and range chips, parks toggle + tooltips, World switch + globe + country chips, the three expanded views (and `/hobbies#music|outdoors|photo`), photo category filter, no console errors.
