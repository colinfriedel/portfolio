import { Panel } from "@/components/Panel";

export default function NotFound() {
  return (
    <Panel label="Page not found">
      <div className="pg-head">
        <h2>Page not found</h2>
        <p>That page doesn&apos;t exist.</p>
      </div>
    </Panel>
  );
}
