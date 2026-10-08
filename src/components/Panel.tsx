import Link from "next/link";
import type { ReactNode } from "react";

/** Inner-page wrapper: the frosted panel with a back button, as on the original site. */
export function Panel({
  label,
  doc,
  className = "",
  pageClassName = "",
  back = { href: "/", label: "Home" },
  actions,
  children,
}: {
  label: string;
  doc?: boolean;
  className?: string;
  pageClassName?: string;
  back?: { href: string; label: string };
  actions?: ReactNode;
  children: ReactNode;
}) {
  const Tag = doc ? "article" : "section";
  return (
    <main className={`page ${pageClassName}`.trim()} aria-label={label}>
      <Tag className={`panel ${doc ? "doc" : ""} ${className}`.trim()}>
        <div className="topbar">
          <Link className="back" href={back.href}>
            &larr; {back.label}
          </Link>
          {actions}
        </div>
        {children}
      </Tag>
    </main>
  );
}
