import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { PillLink, GhostLink } from "@/components/ui";
import { audiences, stages, TESTING_LINE } from "@/data/services";
import { servicesGraph } from "@/lib/schema";
import { shareMeta } from "@/lib/site";

const TITLE = "Software Development Services";
const DESCRIPTION =
  "Software development from requirements to maintenance: architecture, frontend, backend, APIs, databases, integrations, AI agents, security, testing and deployment.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  ...shareMeta(TITLE, DESCRIPTION, "/services"),
};

const evidence = [
  { title: "Multi-tenant recommendation platform", detail: "Client work: Postgres schema with row level security, admin publishing workflow, deployment.", href: "/#client-work" },
  { title: "Groundwork", detail: "Operations app for maintenance companies with role-based screens, spoken job reports and 22 languages.", href: "/#projects" },
  { title: "Reclaim and EOB Reader", detail: "Document AI: extraction from insurance PDFs, human review, letter drafting and CSV export.", href: "/#projects" },
  { title: "DocTalk", detail: "Retrieval with pgvector and page-level citations over uploaded PDFs.", href: "/#projects" },
];

const limits = [
  "Large programmes that need several engineers working at once over a long period",
  "Regulated systems that need formal compliance or specialist security sign-off",
  "Independent QA or penetration testing that has to be done by a separate party",
  "Round-the-clock operational support with guaranteed response times",
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesGraph(DESCRIPTION)} />
      <main id="main" className="flex-1">
        <section className="zone-light px-5 pt-8 pb-14 sm:px-6 md:pb-20">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="rise">
              <ol className="flex min-h-11 items-center gap-2 text-sm text-muted">
                <li><Link href="/" className="hover:text-foreground">Home</Link></li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-foreground">Services</li>
              </ol>
            </nav>
            <div className="mt-8 grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12 lg:items-end">
              <div className="rise lg:col-span-7" style={{ "--d": 1 } as React.CSSProperties}>
                <h1 className="text-balance text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground">
                  Software development services
                </h1>
                <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
                  Everything a project can include, stage by stage. Most projects use only part of it, and the deliverables are agreed before work starts.
                </p>
              </div>
              <nav aria-label="Stages" className="rise lg:col-span-5" style={{ "--d": 2 } as React.CSSProperties}>
                <ul className="flex flex-wrap gap-2 lg:justify-end">
                  {stages.map((st) => (
                    <li key={st.number}>
                      <a href={`#stage-${st.number}`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-sm text-foreground hover:border-foreground/30">
                        <span className="font-mono text-xs text-accent">{st.number}</span> {st.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>

        <section aria-labelledby="who-title" className="zone-dark px-5 py-20 sm:px-6 md:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 id="who-title" className="text-3xl font-semibold tracking-tight text-foreground">Who these services are for</h2>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {audiences.map((a) => (
                <div key={a.id} className="rounded-2xl border border-border bg-surface p-7">
                  <p className="font-mono text-xs tracking-[0.16em] text-accent uppercase">{a.who}</p>
                  <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-foreground">{a.heading}</h3>
                  <ul className="mt-4 space-y-2 text-base leading-relaxed text-muted">
                    {a.needs.map((n) => (
                      <li key={n} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />{n}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="stages-title" className="zone-light px-5 py-20 sm:px-6 md:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 id="stages-title" className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              What each stage of a project can include
            </h2>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              These are capabilities, not a fixed package. The deliverables for a specific project are agreed during scoping, and most projects use only some of them.
            </p>

            <ol className="mt-14 divide-y divide-border border-y border-border">
              {stages.map((stage) => (
                <li key={stage.number} id={`stage-${stage.number}`} className="scroll-mt-6 grid grid-cols-1 gap-6 py-10 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-4">
                    <span className="font-mono text-sm text-accent">{stage.number}</span>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{stage.title}</h3>
                    <p className="mt-3 text-pretty text-base leading-relaxed text-muted">{stage.summary}</p>
                  </div>
                  <div className="flex flex-col gap-3 lg:col-span-8">
                    {stage.groups.map((g) => (
                      <details key={g.id} className="hood-panel group rounded-2xl border border-border bg-surface">
                        <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-foreground">
                          <span>{g.title}</span>
                          <ChevronDown size={18} className="hood-chevron shrink-0 text-muted" aria-hidden />
                        </summary>
                        <ul className="grid grid-cols-1 gap-x-8 gap-y-2 px-5 pb-5 text-base text-muted sm:grid-cols-2">
                          {g.items.map((item) => (
                            <li key={item} className="flex gap-3"><span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />{item}</li>
                          ))}
                        </ul>
                      </details>
                    ))}
                    {stage.number === "04" && (
                      <p className="rounded-2xl border border-accent/40 px-5 py-4 text-base leading-relaxed text-foreground">
                        {TESTING_LINE} Automated checks catch many problems; my own testing covers how the software behaves when a person uses it, and every fix is re-tested. For specialised or high-risk systems, an additional security, compliance or accessibility assessment may be needed.
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="evidence-title" className="zone-dark px-5 py-20 sm:px-6 md:py-28">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 id="evidence-title" className="text-3xl font-semibold tracking-tight text-foreground">Delivered work behind these services</h2>
              <ul className="mt-8 flex flex-col gap-3">
                {evidence.map((e) => (
                  <li key={e.title}>
                    <Link href={e.href} className="block rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-foreground/30">
                      <span className="block text-base font-semibold text-foreground">{e.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{e.detail}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">When one engineer is not the right fit</h2>
              <p className="mt-5 text-pretty text-base leading-relaxed text-muted">
                The complexity, risk and ongoing operational needs of a project decide the right delivery model. I will say so early if a project needs more than I can responsibly provide, for example:
              </p>
              <ul className="mt-6 space-y-3 text-base leading-relaxed text-foreground">
                {limits.map((l) => (
                  <li key={l} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />{l}</li>
                ))}
              </ul>
              <p className="mt-6 text-pretty text-base leading-relaxed text-muted">
                In those cases I can still own a defined part of the work alongside the wider team.
              </p>
            </div>
          </div>
        </section>

        <section className="zone-light px-5 py-20 sm:px-6 md:py-28">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Tell me what you need built.</h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">Describe the project and the timeline. I reply by email within 24 hours.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <PillLink href="/brief">Send a brief</PillLink>
              <GhostLink href="/">Back to the homepage</GhostLink>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
