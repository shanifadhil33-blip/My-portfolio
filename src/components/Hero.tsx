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
      <div className="hero-layout relative mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 items-center gap-14 px-5 pt-28 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:pt-[clamp(5rem,13svh,6rem)] lg:pb-[clamp(1.5rem,5svh,4rem)]">
        <div className="hero-copy min-w-0 lg:col-span-7 @container">
          <p className="rise flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] leading-4 font-bold tracking-[0.2em] text-accent uppercase sm:text-xs sm:tracking-[0.3em] lg:text-sm lg:leading-5" style={{ "--d": 0 } as React.CSSProperties}>
            <span className="text-accent">Adhil Shanif</span>
            <span aria-hidden className="h-px w-6 bg-accent/40" />
            <span>Full-stack software engineer · Dubai</span>
          </p>

          <h1
            id="hero-title"
            className="lift mt-6 font-display text-balance text-[length:clamp(2.5rem,min(9cqi,9.5svh),5rem)] font-normal italic leading-[1.1] tracking-[-0.01em] text-foreground"
          >
            {HEADLINE}
          </h1>

          <p className="rise mt-6 max-w-xl text-pretty text-base leading-6 text-muted sm:text-lg sm:leading-7" style={{ "--d": 2 } as React.CSSProperties}>
            {SUBHEADLINE}
          </p>

          <div className="hero-actions rise mt-12 lg:mt-[clamp(1.5rem,5svh,3rem)] flex flex-col gap-3 sm:flex-row sm:items-center" style={{ "--d": 3 } as React.CSSProperties}>
            <PillLink href="/brief">Start a project</PillLink>
            <GhostLink href="#work">
              See delivered work <ArrowDown size={16} aria-hidden />
            </GhostLink>
          </div>

          <ul className="hero-proof rise mt-12 lg:mt-[clamp(1.25rem,5svh,3rem)] flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6 text-sm text-muted" style={{ "--d": 4 } as React.CSSProperties}>
            {proof.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center underline-offset-4 hover:text-foreground hover:underline">
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-portrait lift min-w-0 lg:col-span-5">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}
