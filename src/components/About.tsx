import { techLayers } from "@/data/services";
import { UPWORK_URL } from "@/lib/site";
import { SectionHead } from "./ui";

// Facts that stay true: no counts or ratings that drift.
const facts = [
  { big: "End to end", small: "Database, backend, frontend, AI and deployment in one pair of hands." },
  { big: "Multi-tenant", small: "SaaS delivered for a client with isolation enforced in the database." },
  { big: "In writing", small: "Decisions, progress and handover notes are written down and easy to forward." },
  { big: "You own it", small: "Code, accounts and infrastructure belong to the client from day one." },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="zone-light relative px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          id="about-title"
          n="05"
          label="About"
          title="Adhil Shanif, independent software engineer."
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 text-pretty text-lg leading-relaxed text-muted lg:col-span-7">
            <p className="text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
              I take responsibility for technical work, from a single backend task to a complete product.
            </p>
            <p>
              I&apos;m based in Dubai and work remotely with agencies, founders and businesses. Some projects start from an idea, some from a specification, and some from an existing codebase with problems to solve. I work across the stack — data models, backend, interfaces, integrations, AI features and deployment — and I stay involved after launch when a system needs looking after.
            </p>
            <p>
              Most software problems are data problems. I start with the database and the rules, then build the screens on top, so the system stays correct as it grows.
            </p>
            <a
              href={UPWORK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-base text-accent underline underline-offset-4 hover:text-accent-hover"
            >
              Top Rated on Upwork — see verified reviews
            </a>
          </div>

          <dl className="divide-y divide-border border-y border-border lg:col-span-5">
            {facts.map((f) => (
              <div key={f.big} className="py-6">
                <dt className="text-3xl font-semibold tracking-tight text-foreground">{f.big}</dt>
                <dd className="mt-2 text-base leading-relaxed text-muted">{f.small}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-24 md:mt-28">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">Technology follows the problem.</h3>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted">
            I work across the software stack and adapt to the technologies, architecture and requirements of each project. These are the tools in work I have shipped. When a project needs unfamiliar or specialist technology, I assess feasibility, risks and the right delivery approach before committing.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {techLayers.map((group) => (
              <div key={group.layer} className="rounded-2xl border border-border bg-surface p-5">
                <h4 className="font-mono text-xs tracking-[0.16em] text-accent uppercase">{group.layer}</h4>
                <ul className="mt-4 space-y-1.5 text-base text-foreground">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
