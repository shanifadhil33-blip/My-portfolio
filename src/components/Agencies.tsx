import AgencyStack from "./AgencyStack";
import { PillLink, SectionHead } from "./ui";

const handoffs = [
  { title: "Client portals & dashboards", detail: "Logins, roles and the screens your client's customers or staff use every day." },
  { title: "Custom web applications", detail: "A complete build from your designs, taken to a deployed, working product." },
  { title: "Integrations", detail: "Connecting the tools your client already pays for: payments, CRMs, booking and email." },
  { title: "AI features", detail: "Document extraction and assistants on the client's own data, with a person approving the output." },
  { title: "Fixing what's already there", detail: "Production problems, security issues, or an app someone else left half done." },
  { title: "Looking after it after launch", detail: "Hosting, monitoring and updates, so you don't need an engineer on call." },
];

const working = [
  "Built from your designs and brief",
  "Written updates you can forward or send as your own",
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
          lead="For design studios, marketing agencies, no-code shops and consultants whose clients ask for software they don't build in house. I build it, behind your brand or by referral, with written updates and fixed milestones."
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
