import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/Panel";
import { ProjectGallery } from "@/components/ProjectGallery";
import { projects } from "@/content/projects";

const detailed = projects.filter((p) => p.detail);

export const dynamicParams = false;

export function generateStaticParams() {
  return detailed.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: detailed.find((p) => p.slug === slug)?.title };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const index = detailed.findIndex((p) => p.slug === slug);
  const project = detailed[index];
  if (!project?.detail) notFound();
  const next = detailed[index + 1];
  const d = project.detail;

  return (
    <Panel
      label={project.title}
      doc
      className="project"
      back={{ href: "/projects", label: "All projects" }}
      actions={
        next && (
          <Link className="next" href={`/projects/${next.slug}`}>
            Next project
          </Link>
        )
      }
    >
      <p className="kind">{project.kind}</p>
      <h2>{project.title}</h2>
      <p className="lede">{d.lede}</p>
      {d.facts.length > 0 && (
        <dl className="facts">
          {d.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>
                {f.href ? (
                  <a href={f.href} target="_blank" rel="noopener">
                    {f.value}
                  </a>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {project.image ? (
        <ProjectGallery photos={[project.image, ...(project.gallery ?? [])]} />
      ) : (
        <div className="media">Photo or demo video goes here</div>
      )}
      {d.highlights.length > 0 && (
        <section>
          <h3>Highlights</h3>
          <ul className="hl">
            {d.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>
      )}
      {d.features && d.features.length > 0 && (
        <section>
          <h3>Features</h3>
          <ul className="hl">
            {d.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      )}
      {d.flow && (
        <section>
          <h3>{d.flowTitle}</h3>
          <ol className="flow">
            {d.flow.map((step, i) => (
              <li key={i}>
                {step.via && <span className="via">{step.via}</span>}
                <strong>{step.title}</strong>
                {step.text && <span className="d">{step.text}</span>}
              </li>
            ))}
          </ol>
          {d.flowFacts && d.flowFacts.length > 0 && (
            <dl className="facts facts-sm">
              {d.flowFacts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      )}
      {d.deepDive && (
        <details className="dive">
          <summary>Technical deep dive</summary>
          <div className="inner">
            <ul>
              {d.deepDive.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </details>
      )}
      {d.learned && (
        <section>
          <h3>What I learned</h3>
          {Array.isArray(d.learned) ? (
            <ul className="hl">
              {d.learned.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          ) : (
            <p className="ph">{d.learned}</p>
          )}
        </section>
      )}
    </Panel>
  );
}
