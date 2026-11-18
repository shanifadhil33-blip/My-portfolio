import type { Metadata } from "next";
import BackHome from "@/components/BackHome";
import { PillLink } from "@/components/ui";
import { namedClientProjects } from "@/data/clientWork";
import { shareMeta, UPWORK_URL } from "@/lib/site";

// Older landing page, no longer linked or in the sitemap (Nov 18 2026). Kept but not indexed.
export const metadata: Metadata = {
  title: "Working Together on Software",
  description:
    "I work with teams, founders and businesses on web apps, backends, integrations and AI features, with agreed scope, milestones and written updates.",
  robots: { index: false, follow: true },
  ...shareMeta(
    "Working Together on Software",
    "Web apps, backends, integrations and AI features, with agreed scope, milestones and written updates.",
    "/partners",
  ),
};

const points = [
  "Portals, dashboards, web apps, integrations and AI features.",
  "I work in your repository and tools, with changes available for review.",
  "You can introduce a project. I clarify the requirements with the people who will use and review the software.",
  "We agree on scope and milestones, with written updates on progress, decisions and issues.",
];

export default function PartnersPage() {
  return (
    <main className="flex-1 px-5 py-16 sm:px-6 md:py-28">
      <div className="mx-auto max-w-2xl">
        <BackHome />
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Working together on software.
        </h1>
        <p className="mt-6 text-pretty text-lg leading-relaxed text-muted">
          I work with teams, founders and businesses on complete products and specific parts of existing systems. We start with the requirements, agree on scope and review the work at each milestone.
        </p>

        <ul className="mt-10 space-y-3">
          {points.map((p, i) => (
            <li key={p} className="flex gap-4 rounded-2xl border border-border bg-surface px-5 py-4 text-base leading-relaxed text-foreground">
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              {p}
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-xl font-semibold text-foreground">Recent client work</h2>
        <ul className="mt-4 space-y-3">
          {namedClientProjects.map((project) => (
            <li key={project.id} className="rounded-2xl border border-border px-5 py-4">
              <p className="text-base font-medium text-foreground">{project.title}</p>
              <p className="mt-1.5 text-base leading-relaxed text-muted">{project.owned ?? project.brief}</p>
            </li>
          ))}
        </ul>

        <a
          href={UPWORK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center text-accent underline underline-offset-4 hover:text-accent-hover"
        >
          Top Rated on Upwork: verified reviews
        </a>

        <div className="mt-10">
          <PillLink href="/brief?type=agency">Start a project</PillLink>
        </div>
      </div>
    </main>
  );
}
