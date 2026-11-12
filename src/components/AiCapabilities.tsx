import { SectionHead } from "./ui";

const steps = ["Scope", "Context", "Orchestrate", "Review", "Test", "Improve"] as const;

const cards = [
  {
    title: "Requirements Engineering & Technical Scoping",
    body: "Translate ideas and business requirements into structured development tasks, workflows, and implementation criteria.",
    src: "scoping",
    alt: "A tangled knot marked Idea, with an arrow toward a goal board and a three week line.",
  },
  {
    title: "Context Engineering & Knowledge Management",
    body: "Organize project instructions, decisions, technical context, and handoffs to maintain continuity across AI assisted development sessions.",
    src: "context",
    alt: "Loose notes gathering into a tidy stack that feeds a small AI unit.",
  },
  {
    title: "AI Agent Orchestration",
    body: "Direct specialized AI assistants and coding tools through delegated tasks, defined responsibilities, operating constraints, and human approval.",
    src: "orchestration",
    alt: "A coordinator linked to research, writing, testing, and review.",
  },
  {
    title: "Critical Reasoning & Implementation Review",
    body: "Challenge generated solutions, identify unsupported assumptions, recognize logical inconsistencies, and evaluate implementation decisions.",
    src: "review",
    alt: "A row of blocks, with a magnifying glass on a cracked one marked Issue and a check marked Fixed.",
  },
  {
    title: "Functional Testing & Quality Assurance",
    body: "Test live applications, identify broken workflows and interface problems, document reproducible failures, and coordinate corrections.",
    src: "testing",
    alt: "A track of gates, two marked Pass and one marked Fail.",
  },
  {
    title: "Engineering Workflow Design",
    body: "Structure AI assisted development processes with tool selection, task coordination, review checkpoints, usage controls, and documented lessons.",
    src: "workflow",
    alt: "Five cards in a row marked Plan, Build, Review, Test, and Ship.",
  },
];

export default function AiCapabilities() {
  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="zone-light relative border-t border-border px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          id="capabilities-title"
          n="05"
          label="Capabilities"
          title="AI Assisted Engineering Capabilities"
        />
        <ol className="cap-line mt-12 md:mt-16" aria-label="How the capabilities connect">
          {steps.map((step) => (
            <li key={step}>
              <span className="cap-dot" aria-hidden />
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <ol className="mt-10 grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-3 lg:gap-8">
          {cards.map((card) => (
            <li key={card.title} className="cap-card">
              <article className="cap-card-body flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
                {/* Approved WebPs are already optimized; preserve their explicit srcSet. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/capabilities/${card.src}.webp`}
                  srcSet={`/capabilities/${card.src}-640.webp 640w, /capabilities/${card.src}.webp 1280w`}
                  sizes="(max-width: 1023px) 320px, 380px"
                  width={1280}
                  height={720}
                  alt={card.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full bg-[#F8F1E7] object-contain"
                />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-balance text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-[1.7rem]">{card.title}</h3>
                  <p className="mt-4 text-pretty text-lg leading-relaxed text-foreground/80">{card.body}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
