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
- `src/content/hobbies/content.json`: all hand-written text, performance photos (`music.performances`), latest recording (`music.recording`), camera/photo lists, visited states, parks (lat/lon), countries.
- `src/content/hobbies/music-stats.json`: top artists/tracks per range. `"sample": true` shows "Sample data" labels. GENERATED daily from Spotify by `.github/workflows/spotify-stats.yml`; never hand-edit once real.
- `src/content/hobbies/outdoors-stats.json`: hiking + running miles from the Strava export (`"sample": true` shows "(sample)").
- `src/content/hobbies/geo-us.json` and `public/data/hobbies-geo-world.json`: GENERATED, never hand-edit. After changing `outdoors.states`, `outdoors.parks` or `outdoors.countries` in content.json run `npm run build:geo` (`scripts/build-geo.mjs`). A country with overseas territories you haven't visited gets `"overseas": false` (keeps the mainland and nearby islands), or `"mainlandOnly": true` to fill only the largest part (France uses this: no French Guiana or other overseas parts, no Corsica).

## Images
- Put photos in `public/images/hobbies/{stage,cameras,photos}/` (performance photos go in `stage/`) and set the path in content.json (`photo` or `src`, e.g. `/images/hobbies/stage/rooftop.jpg`). `null` shows a dashed placeholder.
- Before committing: resize to ~1600px on the long edge, JPEG quality ~80 (under ~400 KB), and strip EXIF/GPS metadata.
- Valley Oak Respite Center: residents are adults with dementia. Only use stage photos where no resident is identifiable; ask Colin if unsure.

## Audio
- The latest recording lives in `public/audio/` and is set in `music.recording.audio`. Use AAC (.m4a) or MP3 around 192-256 kbps, never WAV (too large). Strip metadata and move the index to the front so it streams: `ffmpeg -i in.m4a -map 0:a -c copy -map_metadata -1 -movflags +faststart out.m4a`.

## Data refresh contracts (when asked to build them)
- Spotify: `.github/workflows/spotify-stats.yml` runs `scripts/spotify-stats.mjs` daily (and on demand via "Run workflow") with secrets `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` (get the token once with `node scripts/spotify-auth.mjs` on Colin's computer; scope `user-top-read`). Uses `/v1/me/top/{artists,tracks}` with `short_term` -> id `recent` ("Recently") and `long_term` -> id `year` ("This year"). Writes `ranges[{id,label,artists[{name,image,url}],tracks[{title,artist,image,url}]}]` (image = artist photo / album cover hotlinked from Spotify's CDN, url = Spotify page; names link to Spotify, as Spotify's guidelines ask), `sample:false`, `source:"spotify"`, `updated` ISO date; only writes when the lists change, and skips with a warning if the secrets are missing. No live API calls from the site.
- Strava: `node scripts/strava-from-export.mjs path/to/activities.csv` (from the personal data export) rewrites `outdoors-stats.json`: Hike and Run activities by default (`--types` to change, e.g. `Hike,Run,Walk`; `since` = year of the first counted activity), months bucketed in America/Los_Angeles (`--tz`), `--dry-run` to preview. Never commit the CSV or the rest of the export.

## Checking a change
`npm run lint`, `npm run build`, then load `/hobbies` and check: Playing/Listening tabs and range chips, the photo viewer (open from a card and from an expanded view, arrows, Esc), parks toggle + tooltips, World switch + globe + country chips + zoom (wheel, +/-), the three expanded views (and `/hobbies#music|outdoors|photo`), Photography DSLR/Digicam columns (each scrolls on its own), no console errors.

# Working on this repo

- Work on the `nextjs-rebuild` branch and open or update a PR; never push to `main` (it is the live site, deployed by Vercel) and never touch DNS or domain config. Merge only when Colin says "merge", after the Vercel check passes on the PR's head; then fast-forward `nextjs-rebuild` to `main`.
- `main` gets a daily bot commit to `music-stats.json`; pull before merging.
- `private/` is git-ignored and stays on Colin's computer. Read from it, never commit it or copy its contents wholesale into the repo.

# Projects pages (`/projects`)

- All project text lives in `src/content/projects.ts` (order in the array = order on the page). `next.config.ts` redirects old slugs.
- Same rule as hobbies: never write Colin's copy. Use his wording verbatim, flag likely typos, and offer suggestions separately for him to approve.
- "What I learned" bullets are short noun phrases with no "Learned"/"Gained" opener (e.g. "Testing circuits with a multimeter"), since the heading already says it.
- Project photos go in `public/images/projects/`, with the same resize/EXIF rules as hobbies photos.
