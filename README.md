# colin.friedelsweb.com

Personal portfolio built with Next.js (App Router), TypeScript, and Tailwind CSS. Deployed on Vercel.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (what Vercel runs)
npm run lint
```

## Where things live

| What | Where |
| --- | --- |
| Intro text, social links, nav items, image paths | `src/content/site.ts` |
| Projects (cards and detail pages) | `src/content/projects.ts` |
| Resume page | `src/app/resume/page.tsx` |
| Hobbies page (placeholder) | `src/app/hobbies/page.tsx` |
| All styling | `src/app/site.css` (ported from the original `index.html`) |
| Images and resume PDF | `public/images/`, `public/Colin_Friedel_Resume.pdf` |

Tailwind utilities are available, but Tailwind's CSS reset (preflight) is left out on purpose because the original styles rely on browser defaults. See `src/app/globals.css`.

### Adding a project

Add an entry to `projects` in `src/content/projects.ts`. Entries with `detail` get a page at `/projects/<slug>`; entries without it show as "Details coming soon".

### Adding a page

1. Create `src/app/<slug>/page.tsx` using `Panel` (copy `src/app/hobbies/page.tsx`).
2. Add `{ label, href: "/<slug>" }` to `navItems` in `src/content/site.ts`.

## Images

All in `public/images/`. To change one, replace the file and keep the same name.

| File | What | Size used now |
| --- | --- | --- |
| `hero-desktop.jpg` | Background photo for wide screens | 2200×1472 |
| `hero-mobile.jpg` | Background photo for phones (portrait crop) | 900×1600 |
| `name-colin.png` | Handwritten "Colin" | 367×180 |
| `name-friedel.png` | Handwritten "Friedel" | 411×180 |
| `me.jpg` | Photo of me (shown as a circle) | 779×779 |

If you change the size of a name image, update its `width`/`height` in `src/content/site.ts`. The phone background is lined up so the intro text sits above the ridgeline (`RIDGE` in `src/components/FitBackground.tsx`); a different mobile photo may need that number adjusted.
