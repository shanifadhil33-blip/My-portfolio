import AiLayers from "./AiLayers";

const outcomes = [
  "Agents handle tasks with defined rules.",
  "People approve actions that need a decision.",
  "Assistants answer from company documents.",
];

export default function AiTeam() {
  return (
    <section id="ai-team" aria-labelledby="ai-team-title" className="zone-dark glow relative px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-sm text-background">
              AI
            </span>
            <span className="text-sm text-muted">AI systems for business workflows</span>
          </p>
          <h2
            id="ai-team-title"
            className="mt-8 text-balance text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground"
          >
            AI connected to business tools
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">
            Agents and assistants can use company documents and connected tools, with permissions and human approval steps.
          </p>
        </header>

        <AiLayers />

        <p className="mt-16 max-w-xl text-lg leading-relaxed text-muted md:mt-24">
          I map the workflow, connect the tools and define what needs human approval.
        </p>

        <ul className="mt-16 max-w-xl space-y-5 md:mt-20">
          {outcomes.map((item) => (
            <li key={item} className="text-xl leading-relaxed text-foreground sm:text-2xl">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-16 max-w-xl text-xl font-medium leading-relaxed text-foreground sm:text-2xl md:mt-20">
          I start with the process and its constraints, then agree on which tasks the system should handle.
        </p>
      </div>
    </section>
  );
}
