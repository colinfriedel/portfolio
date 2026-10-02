"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/content/site";
import { NameMark } from "./NameMark";
import { SocialLinks } from "./SocialLinks";

/** Header for inner pages: name links home, nav inline on desktop, menu button on phones. */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-20 px-4 pt-3 sm:px-6 md:px-10 md:pt-5">
      <div className="glass mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl px-4 py-2 md:rounded-full md:px-6">
        <Link href="/" aria-label="Home" className="shrink-0 rounded-md" onClick={() => setOpen(false)}>
          <NameMark className="h-9 md:h-11" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="rounded-full px-4 py-2 font-semibold text-ink transition hover:bg-white/70 aria-[current=page]:bg-ink aria-[current=page]:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full text-ink hover:bg-white/70 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Main" className="glass mx-auto mt-2 max-w-5xl rounded-2xl p-2 md:hidden">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-lg font-semibold text-ink hover:bg-white/70 aria-[current=page]:bg-ink aria-[current=page]:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-line px-2 pt-3 pb-1">
            <SocialLinks size="sm" />
          </div>
        </nav>
      )}
    </header>
  );
}
