import type { Metadata } from "next";
import { Panel } from "@/components/Panel";
import { ProjectGrid } from "@/components/ProjectGrid";
import { projects, projectsIntro } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <Panel label="Projects">
      <div className="pg-head">
        <h2>Projects</h2>
        <p>{projectsIntro}</p>
      </div>
      <ProjectGrid projects={projects} />
    </Panel>
  );
}
