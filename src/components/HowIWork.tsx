import LayerStack from "./LayerStack";
import { SectionHead } from "./ui";

const steps = ["Plan", "Build", "Test", "Learn"] as const;

const lines = [
  "I plan the data model, roles and business rules before anything is built.",
  "AI coding agents work from written tasks, with limits on what they can change.",
  "I test the main workflows myself and check every fix again.",
  "It ships to your accounts with monitoring and a written handover.",
];

function HowAside() {
  return (
    <>
      <ol className="cap-line" aria-label="How the work moves">
        {steps.map((step) => (
          <li key={step}>
            <span className="cap-dot" aria-hidden />
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <ul className="mt-8 space-y-4">
        {lines.map((line) => (
          <li key={line} className="flex gap-3 text-pretty text-lg leading-relaxed text-muted">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function HowIWork() {
  return (
    <section id="how-i-work" aria-labelledby="how-title" className="zone-dark glow relative px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead id="how-title" n="02" label="How I work" title="From brief to a deployed product." />
        <div className="mt-12 md:mt-16">
          <LayerStack aside={<HowAside />} />
        </div>
      </div>
    </section>
  );
}
