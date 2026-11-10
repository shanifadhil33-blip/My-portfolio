import { ArrowDown } from "lucide-react";
import { HEADLINE, SUBHEADLINE, UPWORK_URL } from "@/lib/site";
import HeroCard from "./HeroCard";
import { GhostLink, PillLink } from "./ui";

const proof = [
  { label: "Top Rated on Upwork", href: UPWORK_URL },
  { label: "Multi-tenant SaaS delivered" },
  { label: "Database to deployment" },
];

export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="zone-dark glow relative">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 items-center gap-14 px-5 pt-28 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="rise flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.16em] text-muted uppercase" style={{ "--d": 0 } as React.CSSProperties}>
            <span className="text-accent">Adhil Shanif</span>
            <span aria-hidden className="h-px w-6 bg-border" />
            <span>Independent software engineer · Dubai</span>
          </p>

          <h1
            id="hero-title"
            className="lift mt-7 text-balance text-[clamp(3rem,8.4vw,6.4rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-foreground"
          >
            {HEADLINE}
          </h1>

          <p className="rise mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl" style={{ "--d": 2 } as React.CSSProperties}>
            {SUBHEADLINE}
          </p>

          <div className="rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ "--d": 3 } as React.CSSProperties}>
            <PillLink href="#agencies">Partner with me</PillLink>
            <GhostLink href="#work">
              See delivered work <ArrowDown size={16} aria-hidden />
            </GhostLink>
          </div>

          <ul className="rise mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6 text-sm text-muted" style={{ "--d": 4 } as React.CSSProperties}>
            {proof.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-foreground hover:underline">
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="lift lg:col-span-5">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}
