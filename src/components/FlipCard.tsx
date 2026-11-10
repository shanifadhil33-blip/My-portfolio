"use client";

import Link from "next/link";
import { ArrowUpRight, MoveHorizontal, RotateCcw } from "lucide-react";
import type { Audience } from "@/data/services";
import { useSwipeFlip } from "./useSwipeFlip";

/**
 * Turns over with a swipe (any number of times), a tap, or the button. Both faces are always
 * in the HTML, so the text on the back is readable by crawlers and screen readers.
 */
export default function FlipCard({ audience, index }: { audience: Audience; index: number }) {
  const { innerRef, back, flip, handlers } = useSwipeFlip();
  const headingId = `aud-${audience.id}`;

  return (
    <article className="h-full" aria-labelledby={headingId}>
      <div className="flipcard h-full cursor-grab select-none active:cursor-grabbing" style={{ touchAction: "pan-y" }} {...handlers}>
        <div ref={innerRef} className="flipcard-inner h-full min-h-[22rem]">
          <div inert={back} className="face flex flex-col justify-between rounded-3xl border border-border bg-surface p-7">
            <div>
              <p className="flex items-center justify-between font-mono text-sm">
                <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
                <span className="tracking-[0.14em] text-muted uppercase">{audience.who}</span>
              </p>
              <h3 id={headingId} className="mt-10 text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground">
                {audience.heading}
              </h3>
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted">{audience.line}</p>
            </div>
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={flip}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm text-foreground transition-colors hover:border-foreground/40"
              >
                <RotateCcw size={14} aria-hidden /> What this usually involves
              </button>
              <span className="hidden items-center gap-1.5 text-xs text-muted sm:flex" aria-hidden>
                <MoveHorizontal size={13} /> Swipe
              </span>
            </div>
          </div>

          <div inert={!back} className="face face-back flex flex-col justify-between rounded-3xl border border-accent/50 bg-[#0b1220] p-7 text-white">
            <div>
              <p className="font-mono text-sm tracking-[0.14em] text-sky-300 uppercase">{audience.who}</p>
              <ul className="mt-6 space-y-3">
                {audience.needs.map((need) => (
                  <li key={need} className="flex gap-3 text-base leading-snug text-white/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden />
                    {need}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 flex items-center justify-between gap-3">
              <Link
                href={audience.cta.href}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-400 px-5 text-sm font-semibold text-[#04121c] hover:brightness-110"
              >
                {audience.cta.label} <ArrowUpRight size={15} aria-hidden />
              </Link>
              <button
                type="button"
                onClick={flip}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm text-white/60 hover:text-white"
                aria-label={`Turn the ${audience.who} card back`}
              >
                <RotateCcw size={14} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
