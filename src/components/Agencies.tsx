import AgencyStack from "./AgencyStack";
import { PillLink, SectionHead } from "./ui";

const handoffs = [
  { title: "Complete builds", detail: "A scoped application taken from your spec to a deployed, working product." },
  { title: "Backend, APIs & databases", detail: "Data models, business logic, migrations and the APIs your frontend depends on." },
  { title: "The difficult feature", detail: "The piece your team does not have the time or the depth for this sprint." },
  { title: "AI features & agents", detail: "Document extraction, retrieval, agents with human approval, added to an existing product." },
  { title: "Security & production issues", detail: "Access control reviews, tenant isolation fixes and debugging live problems." },
  { title: "Overflow & maintenance", detail: "Extra capacity on a running project, or looking after it once it has launched." },
];

const working = [
  "Your process, your tools, your codebase",
  "Written updates you can forward to the client",
  "Fixed scope and price per milestone",
  "Your client relationship stays yours",
];

export default function Agencies() {
  return (
    <section id="agencies" aria-labelledby="agencies-title" className="zone-light relative px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          id="agencies-title"
          n="01"
          label="Agency partnerships"
          title="Technical delivery for agencies and consultants."
          lead="Need engineering capacity for a client project? I can take ownership of specific technical work or complete application development, working with your existing requirements, codebase and delivery process."
        />

        <div className="mt-16 md:mt-20">
          <AgencyStack />
        </div>

        <h3 className="mt-24 text-2xl font-semibold tracking-tight text-foreground md:mt-28">What agencies hand over</h3>
        <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {handoffs.map((item, i) => (
            <li key={item.title} className="rounded-2xl border border-border bg-surface p-6 sm:p-7">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h4 className="mt-4 text-lg font-semibold tracking-tight text-foreground">{item.title}</h4>
              <p className="mt-2 text-pretty text-base leading-relaxed text-muted">{item.detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-col gap-8 border-t border-border pt-10 lg:flex-row lg:items-center lg:justify-between">
          <ul className="grid grid-cols-1 gap-x-10 gap-y-3 text-base text-foreground sm:grid-cols-2">
            {working.map((w) => (
              <li key={w} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {w}
              </li>
            ))}
          </ul>
          <PillLink href="/brief?type=agency" className="shrink-0 self-start lg:self-auto">Discuss an agency partnership</PillLink>
        </div>
      </div>
    </section>
  );
}
