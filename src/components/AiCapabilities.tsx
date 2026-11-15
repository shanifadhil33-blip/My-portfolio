import { SectionHead } from "./ui";

const steps = ["Plan", "Build", "Test", "Learn"] as const;

const cards = [
  {
    title: "Your brief becomes a clear plan",
    body: "A written scope and acceptance checks before anything is built.",
    src: "scoping",
    alt: "A tangled knot marked Idea, with an arrow toward a goal board.",
  },
  {
    title: "I direct AI coding agents",
    body: "Tasks have written requirements and limits on what the agents can change.",
    src: "orchestration",
    alt: "A coordinator linked to research, writing, testing, and review.",
  },
  {
    title: "I test the main workflows",
    body: "I use the software, investigate problems and check each fix again.",
    src: "testing",
    alt: "A track of gates, two marked Pass and one marked Fail.",
  },
  {
    title: "I keep notes from each project",
    body: "I update checklists with issues found during builds and reviews.",
    src: "context",
    alt: "Loose notes gathering into a tidy stack that feeds a small AI unit.",
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
          title="How I plan, build and check the work"
        />
        <ol className="cap-line mt-12 md:mt-16" aria-label="How the capabilities connect">
          {steps.map((step) => (
            <li key={step}>
              <span className="cap-dot" aria-hidden />
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <ol className="mt-10 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:gap-8">
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
