/**
 * Site-wide content. Most day-to-day edits (intro text, links, nav) happen
 * here rather than in the components.
 */

export const site = {
  name: "Colin Friedel",
  url: "https://colin.friedelsweb.com",

  // Flip to true once you want search engines to index the site.
  indexable: false,

  intro:
    "Computer science and engineering grad from Santa Clara University, looking for engineering roles where I can solve problems and learn quickly.",

  resumePdf: "/Colin_Friedel_Resume.pdf",
};

/** Images live in /public/images. Replace a file with the same name to change it. */
export const images = {
  // The background photos are set in src/app/site.css (.bg): hero-desktop.jpg and hero-mobile.jpg.
  backgroundAlt: "Mount Diablo ridgelines at sunset",
  nameFirst: { src: "/images/name-colin.png", alt: "Colin", width: 367, height: 180 },
  nameLast: { src: "/images/name-friedel.png", alt: "Friedel", width: 411, height: 180 },
  portrait: { src: "/images/me.jpg", alt: "Colin Friedel smiling" },
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "github" | "linkedin";
};

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/colinfriedel", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com/colinfriedel", icon: "github" },
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
