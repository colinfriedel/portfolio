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
| Name, intro text, social links, nav items, image paths | `src/content/site.ts` |
| Homepage section order | `src/app/page.tsx` (`sections` array) |
| Inner pages | `src/app/projects`, `src/app/resume`, `src/app/hobbies` |
| Shared inner-page layout and header (mobile menu) | `src/components/PageShell.tsx`, `src/components/SiteHeader.tsx` |
| Colors and font | `src/app/globals.css` (`@theme`) |
| Images and resume PDF | `public/images/`, `public/Colin_Friedel_Resume.pdf` |

### Adding a page

1. Create `src/app/<slug>/page.tsx` using `PageShell` (copy one of the existing pages).
2. Add `{ label, href: "/<slug>" }` to `navItems` in `src/content/site.ts`. It shows up in both the homepage nav and the inner-page header.

## Images

The files in `public/images/` are labeled placeholders. Replace them with the real photos using the same filenames:

| File | What it is |
| --- | --- |
| `public/images/hero.jpg` | Full-screen background (Mt. Diablo sunset). Landscape, ~2400px wide, under ~1 MB. |
| `public/images/name.png` | Handwritten name, transparent background, cropped tight. |
| `public/images/me.jpg` | Photo of me, square crop works best (shown as a circle), ~800×800. |

After swapping `name.png` or `me.jpg`, update their `width`/`height` in `src/content/site.ts` to the new files' pixel sizes.
