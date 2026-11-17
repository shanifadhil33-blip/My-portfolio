import { techLayers } from "@/data/services";
import { UPWORK_URL } from "@/lib/site";
import { SectionHead } from "./ui";

// Facts that stay true: no counts or ratings that drift.
const facts = [
  { big: "End to end", small: "I take responsibility for scope, build, testing, deployment and handover." },
  { big: "Multi-tenant", small: "SaaS delivered for a client with isolation enforced in the database." },
  { big: "In writing", small: "Decisions, progress, known issues and handover notes are written down." },
  { big: "You own it", small: "Code, accounts and infrastructure belong to the client from day one." },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="zone-light relative px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          id="about-title"
          n="06"
          label="About"
          title="Adhil Shanif. How I build products."
        />

        <div className="about-layout mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="about-copy space-y-5 text-pretty text-lg leading-relaxed text-muted lg:col-span-7">
            <p className="text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
              I build complete products by directing AI coding agents. I define the scope, test the software and manage the GitHub repositories. I handle deployment and infrastructure on Vercel, Cloudflare and Supabase myself.
            </p>
            <p>
              I&apos;m based in Dubai and work remotely with teams, founders and businesses. Some projects start from an idea, some from a specification, and some from an existing app with problems to solve. I stay involved after launch when a system needs looking after.
            </p>
            <p>
              I start by defining the data model and business rules, then direct the build around them. I check how the screens, permissions and integrations use that data.
            </p>
            <a
              href={UPWORK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-base text-accent underline underline-offset-4 hover:text-accent-hover"
            >
              Top Rated on Upwork: see verified reviews
            </a>
          </div>

          <dl className="about-facts divide-y divide-border border-y border-border lg:col-span-5">
            {facts.map((f) => (
              <div key={f.big} className="py-6">
                <dt className="text-3xl font-semibold tracking-tight text-foreground">{f.big}</dt>
                <dd className="mt-2 text-base leading-relaxed text-muted">{f.small}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-24 md:mt-28">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">Tools in products I&apos;ve shipped</h3>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted">
            When a project needs unfamiliar or specialist technology, I check feasibility and risks before committing.
          </p>
          <div className="tools-grid mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
