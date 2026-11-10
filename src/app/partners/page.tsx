import type { Metadata } from "next";
import BackHome from "@/components/BackHome";
import { PillLink } from "@/components/ui";
import { namedClientProjects } from "@/data/clientWork";
import { shareMeta, UPWORK_URL } from "@/lib/site";

// A direct link for agency outreach. It repeats the homepage agency section,
// so it stays out of search results to avoid a duplicate page.
export const metadata: Metadata = {
  title: "Technical Delivery for Agencies",
  description:
    "Adhil Shanif works with agencies and consultants as an external engineering partner, from one workstream to complete application builds.",
  robots: { index: false, follow: true },
  ...shareMeta(
    "Technical Delivery for Agencies",
    "External engineering partner for agencies and consultants, from one workstream to complete application builds.",
    "/partners",
  ),
};

const points = [
  "A complete application, or one engineering workstream on a client project.",
  "Work inside your codebase, tools and delivery process, alongside your team.",
  "Behind your brand when that suits the client. The client relationship stays yours.",
  "Fixed scope and price per milestone, with written updates you can forward.",
];

export default function PartnersPage() {
  return (
    <main className="flex-1 px-5 py-16 sm:px-6 md:py-28">
      <div className="mx-auto max-w-2xl">
        <BackHome />
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Technical delivery for agencies and consultants.
        </h1>
        <p className="mt-6 text-pretty text-lg leading-relaxed text-muted">
          Need engineering capacity for a client project? I can take ownership of specific technical work or complete application development, working with your existing requirements, codebase and delivery process.
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
          Top Rated on Upwork — verified reviews
        </a>

        <div className="mt-10">
          <PillLink href="/brief?type=agency">Discuss an agency partnership</PillLink>
        </div>
      </div>
    </main>
  );
}
