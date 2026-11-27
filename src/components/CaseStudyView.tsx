import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { GhostLink } from "@/components/ui";
import type { CaseStudy, FlowNode } from "@/data/caseStudies";
import { PERSON_ID, WEBSITE_ID } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "responsibility", label: "My responsibility" },
  { id: "architecture", label: "Architecture" },
  { id: "challenges", label: "Challenges" },
  { id: "how-it-works", label: "How it works" },
  { id: "delivery", label: "Delivery" },
  { id: "outcome", label: "Outcome" },
  { id: "capabilities", label: "Capabilities" },
  { id: "next", label: "Next step" },
];

function Flow({ title, nodes }: { title?: string; nodes: FlowNode[] }) {
  return (
    <div className="min-w-0">
      {title ? <h3 className="mb-3 text-sm font-medium text-muted">{title}</h3> : null}
      <ol className="flex flex-col">
        {nodes.map((node, index) => (
          <li key={node.title} className="flex min-w-0 flex-col">
            {index > 0 ? (
              <div className="flex items-center gap-3 py-2 pl-4 text-xs leading-relaxed text-muted">
                <span className="h-5 w-px shrink-0 bg-border" aria-hidden />
                {node.via ? <span className="min-w-0">{node.via}</span> : <span className="sr-only">next</span>}
              </div>
            ) : null}
            <div className="min-w-0 rounded-2xl border border-border bg-surface px-4 py-3">
              <p className="text-pretty text-sm font-medium text-foreground">{node.title}</p>
              <p className="mt-1 text-pretty text-sm leading-relaxed text-muted">{node.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Diagram({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure className="min-w-0">
      <figcaption className="text-sm font-medium text-foreground">
        Diagram
        <span className="mt-1 block text-pretty font-normal text-muted">{caption}</span>
      </figcaption>
      <div className="mt-4">{children}</div>
    </figure>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="mt-5 max-w-3xl space-y-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-pretty text-base leading-relaxed text-muted">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default function CaseStudyView({ study }: { study: CaseStudy }) {
  const url = `${SITE_URL}/work/${study.slug}`;
  const cardAnchor = study.slug === "at-home-vision-screening"
    ? "client-case-vision-screening"
    : "client-case-recommendation-engine";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: study.title,
        description: study.sentence,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": PERSON_ID },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Client projects", item: `${SITE_URL}/#client-work` },
          { "@type": "ListItem", position: 3, name: study.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <main id="main" className="case-study flex-1">
        <article>
          <header className="zone-dark px-5 pt-8 pb-16 sm:px-6 md:pt-10 md:pb-24">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="rise min-w-0">
                <Link
                  href={`/#${cardAnchor}`}
                  scroll={false}
                  className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-foreground"
                >
                  <ArrowLeft size={16} aria-hidden />
                  Client projects
                </Link>
                <p className="mt-8 text-pretty text-sm text-muted">{study.client}</p>
                <h1 className="mt-3 text-balance text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.08] tracking-tight text-foreground">
                  {study.title}
                </h1>
                <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">{study.sentence}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {study.labels.map((label) => (
                    <li
                      key={label}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
                <nav aria-label="On this page" className="mt-8">
                  <ul className="flex flex-wrap gap-2">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-3.5 text-sm text-foreground transition-colors duration-150 hover:border-foreground/30"
                        >
                          {section.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="rise min-w-0" style={{ "--d": 1 } as React.CSSProperties}>
                <Diagram caption="How the pieces fit. This is a diagram, not a screenshot.">
                  <Flow nodes={study.heroFlow} />
                </Diagram>
              </div>
            </div>
          </header>

          <section id="overview" className="zone-light scroll-mt-8 px-5 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Overview</h2>
              <Prose paragraphs={study.overview} />
            </div>
          </section>

          <section id="responsibility" className="zone-dark scroll-mt-8 px-5 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">My responsibility</h2>
              <Prose paragraphs={study.responsibility} />
            </div>
          </section>

          <section id="architecture" className="zone-light scroll-mt-8 px-5 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">System architecture</h2>
              <Prose paragraphs={study.architectureIntro} />
              <div className="mt-10">
                <Diagram caption="The paths through the system. This is a diagram, not a screenshot.">
                  <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
                    {study.architectureFlows.map((flow) => (
                      <Flow key={flow.title} title={flow.title} nodes={flow.nodes} />
                    ))}
                  </div>
                </Diagram>
              </div>
            </div>
          </section>

          <section id="challenges" className="zone-dark scroll-mt-8 px-5 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Engineering challenges</h2>
              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {study.challenges.map((challenge) => (
                  <article key={challenge.title} className="min-w-0 rounded-2xl border border-border bg-surface p-5 sm:p-6">
                    <h3 className="text-pretty text-lg font-medium text-foreground">{challenge.title}</h3>
                    <dl className="mt-4 space-y-4">
                      {(
                        [
                          ["Problem", challenge.problem],
                          ["Decision", challenge.decision],
                          ["Implementation", challenge.implementation],
                          ["Result", challenge.result],
                        ] as const
                      ).map(([label, text]) => (
                        <div key={label}>
                          <dt className="text-sm font-medium text-muted">{label}</dt>
                          <dd className="mt-1 text-pretty text-sm leading-relaxed text-foreground">{text}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="how-it-works" className="zone-light scroll-mt-8 px-5 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">How it works</h2>
              <ol className="mt-8 max-w-3xl">
                {study.steps.map((step, index) => (
                  <li key={step.title} className="flex min-w-0 gap-4 border-t border-border py-4">
                    <span className="w-8 shrink-0 font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0">
                      <h3 className="text-base font-medium text-foreground">{step.title}</h3>
                      <p className="mt-1 text-pretty text-sm leading-relaxed text-muted">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="delivery" className="zone-dark scroll-mt-8 px-5 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Delivery evidence</h2>
              <Prose paragraphs={study.deliveryIntro} />
              <ol className="mt-8 max-w-3xl">
                {study.milestones.map((milestone) => (
                  <li
                    key={milestone.name}
                    className="flex min-w-0 flex-col gap-1 border-t border-border py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="min-w-0 text-pretty text-sm text-foreground">{milestone.name}</span>
                    <span
                      className={`shrink-0 text-sm ${milestone.status === "In testing" ? "font-medium text-accent" : "text-muted"}`}
                    >
                      {milestone.status}
                    </span>
                  </li>
                ))}
              </ol>
              <Prose paragraphs={study.deliveryNotes} />
            </div>
          </section>

          <section id="outcome" className="zone-light scroll-mt-8 px-5 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Outcome and relationship</h2>
              <Prose paragraphs={study.outcome} />
            </div>
          </section>

          <section id="capabilities" className="zone-dark scroll-mt-8 px-5 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Capabilities</h2>
              <ul className="mt-6 flex max-w-3xl flex-wrap gap-2">
                {study.capabilities.map((item) => (
                  <li key={item} className="rounded-full border border-border bg-surface px-3 py-2 text-sm text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="next" className="zone-light scroll-mt-8 px-5 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-6xl">
              <h2 className="max-w-xl text-pretty text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {study.cta}
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted">
                Send me the brief. I will reply in writing.
              </p>
              <div className="mt-6">
                <GhostLink href="/brief">Send a brief</GhostLink>
              </div>
              <p className="mt-10">
                <Link href={`/#${cardAnchor}`} scroll={false} className="inline-flex min-h-11 items-center text-sm text-muted underline underline-offset-4 hover:text-foreground">
                  Back to client projects
                </Link>
              </p>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
