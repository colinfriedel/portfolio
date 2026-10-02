import Link from "next/link";
import { navItems } from "@/content/site";

/** Big, easy-to-tap links to each section. Stacked on phones, a row of pills on larger screens. */
export function HomeNav() {
  return (
    <nav aria-label="Main">
      <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="glass flex items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-lg font-semibold text-ink transition hover:bg-paper sm:rounded-full sm:py-3"
            >
              {item.label}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
