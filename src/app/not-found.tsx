import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell title="Page not found" intro="That page doesn't exist.">
      <Link href="/" className="font-semibold text-ink underline underline-offset-4">
        Back to the homepage
      </Link>
    </PageShell>
  );
}
