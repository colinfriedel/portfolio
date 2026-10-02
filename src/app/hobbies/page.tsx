import type { Metadata } from "next";
import { PageShell, Placeholder } from "@/components/PageShell";

export const metadata: Metadata = { title: "Hobbies and Interests" };

export default function HobbiesPage() {
  return (
    <PageShell title="Hobbies and Interests" intro="Placeholder: a one-line intro about life outside of code.">
      <Placeholder title="Hobbies">Placeholder: what you do for fun.</Placeholder>
      <Placeholder title="Interests">Placeholder: things you&apos;re into or learning about.</Placeholder>
    </PageShell>
  );
}
