import type { Metadata } from "next";
import { PageShell, Placeholder } from "@/components/PageShell";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <PageShell
      title="Resume"
      intro="Placeholder: a one-line intro to the resume page."
      actions={
        <a
          href={site.resumePdf}
          download
          className="rounded-full bg-ink px-5 py-2.5 font-semibold text-white transition hover:bg-ink-soft"
        >
          Download PDF
        </a>
      }
    >
      <Placeholder title="Education">Placeholder: degree, school, graduation date, coursework.</Placeholder>
      <Placeholder title="Experience">Placeholder: roles and highlights.</Placeholder>
      <Placeholder title="Skills">Placeholder: languages, tools, and frameworks.</Placeholder>
    </PageShell>
  );
}
