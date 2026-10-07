"use client";

import Link from "next/link";
import { useState } from "react";
import { projectFilters, type Project } from "@/content/projects";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]["key"]>("all");

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects">
        {projectFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            className="chip"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="pgrid">
        {projects.map((p) => {
          const hidden = filter !== "all" && p.filter !== filter;
          const body = (
            <>
              <span className="kind">{p.kind}</span>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <ul className="tags">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {p.detail ? (
                <span className="more">View details</span>
              ) : (
                <span className="soonmsg">Details coming soon</span>
              )}
            </>
          );
          return p.detail ? (
            <Link key={p.slug} className="pcard" href={`/projects/${p.slug}`} hidden={hidden}>
              {body}
            </Link>
          ) : (
            <div key={p.slug} className="pcard soon" hidden={hidden}>
              {body}
            </div>
          );
        })}
      </div>
    </>
  );
}
