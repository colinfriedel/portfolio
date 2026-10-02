/**
 * Site-wide content and settings. Most day-to-day edits (links, nav, intro
 * text, image paths) happen here rather than in the components.
 */

export const site = {
  name: "Colin Friedel",
  title: "Colin Friedel | Software Engineer",
  description:
    "Computer Science & Engineering grad from Santa Clara University looking for full-time software engineering roles.",
  url: "https://colin.friedelsweb.com",

  // Flip to true once the real content is in and you want search engines to index the site.
  indexable: false,

  intro:
    "Hi, I'm Colin. I graduated from Santa Clara University in June 2026 with a B.S. in Computer Science and Engineering, and I'm looking for full-time software engineering roles where I can solve real problems and learn quickly.",

  resumePdf: "/Colin_Friedel_Resume.pdf",
};

/**
 * Images live in /public/images. Replace the placeholder files with your own
 * using the same filenames, and update width/height to the real pixel size of
 * each file so the layout reserves the right amount of space.
 */
export const images = {
  hero: {
    src: "/images/hero.jpg",
    alt: "Sunset from Mt. Diablo",
  },
  name: {
    src: "/images/name.png",
    alt: "Colin Friedel",
    width: 720,
    height: 200,
  },
  portrait: {
    src: "/images/me.jpg",
    alt: "Photo of Colin Friedel",
    width: 800,
    height: 800,
  },
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "github" | "linkedin";
};

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/colinfriedel", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/colinfriedel", icon: "linkedin" },
];

export type NavItem = {
  label: string;
  href: string;
};

/** Main navigation. Add, remove, or reorder entries here; each href needs a matching folder in src/app. */
export const navItems: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Resume", href: "/resume" },
  { label: "Hobbies and Interests", href: "/hobbies" },
];
