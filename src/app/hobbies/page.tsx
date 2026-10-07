import type { Metadata } from "next";
import { Panel } from "@/components/Panel";

export const metadata: Metadata = { title: "Hobbies and Interests" };

export default function HobbiesPage() {
  return (
    <Panel label="Hobbies and Interests">
      <div className="pg-head">
        <h2>Hobbies and Interests</h2>
        <p className="ph">Placeholder: life outside of code.</p>
      </div>
    </Panel>
  );
}
