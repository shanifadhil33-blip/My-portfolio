import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { engagementTerms, qualitySteps, TESTING_LINE } from "@/data/services";
import Lifecycle from "./Lifecycle";
import { SectionHead } from "./ui";

function QualityLoop() {
  return (
    <div className="relative">
      {/* Desktop: a row with a return arc from Corrections back to Automated checks. */}
      <div className="relative hidden lg:block">
        <svg aria-hidden className="absolute -top-14 h-14 w-full overflow-visible" viewBox="0 0 1000 56" preserveAspectRatio="none">
          <path d="M 700 56 C 700 8, 300 8, 300 56" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-muted">
          re-test after every fix
        </span>
        <div aria-hidden className="absolute top-6 right-[10%] left-[10%] h-px bg-border">
          <span className="pulse-x absolute -top-[3px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
        </div>
      </div>
      <div aria-hidden className="absolute top-6 bottom-6 left-6 w-px bg-border lg:hidden">
        <span className="pulse-y absolute -left-[3px] h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-accent" />
      </div>

      <ol className="relative grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-4">
        {qualitySteps.map((step, i) => {
          const mine = i === 2;
          return (
            <li key={step.title} className="relative pl-[4.5rem] lg:pl-0 lg:text-center">
              <span
                className={`absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-2xl border font-mono text-sm lg:relative lg:mx-auto ${
                  mine
                    ? "border-accent bg-accent-fill text-accent-ink shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_18%,transparent)]"
                    : "border-border bg-surface text-muted"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className={`text-base font-semibold lg:mt-5 ${mine ? "text-accent" : "text-foreground"}`}>{step.title}</h4>
              <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted">{step.detail}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function HowIWork() {
  return (
    <section id="how-i-work" aria-labelledby="how-title" className="zone-dark glow relative px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          id="how-title"
          n="04"
          label="How I work"
          title="From requirements to a system you can run."
          lead="Every engagement follows the same path, whether it is one feature or a full product. Specific deliverables are agreed during scoping."
        />

        <div className="mt-16 md:mt-20">
          <Lifecycle />
        </div>

        <Link href="/services" className="mt-10 inline-flex min-h-11 items-center gap-2 text-base text-accent underline-offset-4 hover:underline">
          What each stage includes <ArrowRight size={16} aria-hidden />
        </Link>

        <div className="mt-24 grid grid-cols-1 gap-12 md:mt-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">How work gets verified</h3>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted">{TESTING_LINE}</p>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted">
              Automated checks catch many problems. My review focuses on how the software behaves when someone uses it: I test the important workflows myself, investigate anything unexpected and re-test every fix.
            </p>
          </div>
          <div className="lg:col-span-8 lg:pt-20">
            <QualityLoop />
          </div>
        </div>

        <aside aria-labelledby="tools-title" className="mt-20 rounded-3xl border border-border bg-surface p-7 sm:p-9 md:mt-24">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
            <h3 id="tools-title" className="text-xl font-semibold leading-snug tracking-tight text-foreground md:col-span-4">
              Modern tools. Hands-on engineering.
            </h3>
            <p className="text-pretty text-base leading-relaxed text-muted md:col-span-8">
              I use AI coding agents to speed up implementation, code analysis, testing and iteration. The engineering decisions, project direction, reviews and final verification stay my responsibility. I work directly on the system, inspect important changes and test the software myself before delivery.
            </p>
          </div>
        </aside>

        <h3 className="mt-24 text-2xl font-semibold tracking-tight text-foreground md:mt-28">Working terms</h3>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {engagementTerms.map((term, i) => (
            <li key={term.title} className="rounded-2xl border border-border p-6">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h4 className="mt-4 text-base font-semibold text-foreground">{term.title}</h4>
              <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted">{term.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
