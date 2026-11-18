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
          <p className="rise flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-[1.65] font-bold tracking-[0.13em] text-accent uppercase" style={{ "--d": 0 } as React.CSSProperties}>
            <span className="text-accent">Adhil Shanif</span>
            <span aria-hidden className="h-px w-6 bg-accent/40" />
            <span>Full-stack software engineer · Dubai</span>
          </p>

          <h1
            id="hero-title"
            className="lift mt-[18px] lg:mt-[clamp(0.75rem,2.2svh,1.125rem)] text-balance text-[length:clamp(2.4375rem,min(10.6cqi,11svh),4.375rem)] font-medium leading-[1.06] tracking-[-0.045em] text-foreground"
          >
            {HEADLINE}
          </h1>

          <p className="rise mt-[26px] lg:mt-[clamp(0.875rem,3svh,1.625rem)] max-w-xl text-pretty text-[length:clamp(1.0625rem,2vw,1.3125rem)] leading-[1.65] text-muted lg:text-[length:clamp(1rem,2.6svh,1.3125rem)]" style={{ "--d": 2 } as React.CSSProperties}>
            {SUBHEADLINE}
          </p>

          <div className="hero-actions rise mt-[42px] lg:mt-[clamp(1.25rem,4.5svh,2.625rem)] flex flex-col gap-3 sm:flex-row sm:items-center" style={{ "--d": 3 } as React.CSSProperties}>
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
