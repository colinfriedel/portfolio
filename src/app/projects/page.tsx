import type { Metadata } from "next";
import { PageShell, Placeholder } from "@/components/PageShell";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <PageShell title="Projects" intro="Placeholder: a one-line intro to the projects page.">
      <Placeholder title="Project cards">Placeholder: project cards with a short summary, tech used, and links.</Placeholder>
      <Placeholder title="Project details">Placeholder: each project can get its own page at /projects/[name].</Placeholder>
    </PageShell>
  );
}
