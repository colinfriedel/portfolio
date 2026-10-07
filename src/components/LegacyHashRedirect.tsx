"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Sends old hash links from the single-page site (/#resume, /#projects/reef) to their new URLs. */
export function LegacyHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    const route = window.location.hash.replace(/^#/, "");
    if (/^(projects(\/[\w-]+)?|resume)$/.test(route)) router.replace(`/${route}`);
  }, [router]);
  return null;
}
