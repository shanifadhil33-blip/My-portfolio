"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { workAreas } from "@/data/services";
import { PillLink } from "./ui";

/** Pick the areas you need. They meet in one place and carry into the brief form. */
export default function ScopeBuilder() {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (id: string) =>
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const left = workAreas.slice(0, 5);
  const right = workAreas.slice(5);
  const chosen = workAreas.filter((a) => picked.includes(a.id));
  const any = chosen.length > 0;

  const tile = (area: (typeof workAreas)[number], side: "left" | "right") => {
    const on = picked.includes(area.id);
    return (
      <li key={area.id} className="relative">
        <button
          type="button"
          aria-pressed={on}
          onClick={() => toggle(area.id)}
          className={`group relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.99] sm:p-5 ${
            on ? "border-accent bg-accent/10" : "border-border bg-surface hover:border-foreground/30"
          }`}
        >
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
              on ? "border-accent bg-accent-fill text-accent-ink" : "border-border text-transparent"
            }`}
            aria-hidden
          >
            <Check size={14} strokeWidth={3} />
          </span>
          <span>
            <span className="block text-base font-semibold text-foreground">{area.label}</span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">{area.detail}</span>
          </span>
        </button>
        {/* Connector into the spine, desktop only. */}
        <span
          aria-hidden
          className={`absolute top-1/2 hidden h-px w-8 transition-colors duration-200 lg:block ${
            side === "left" ? "-right-8" : "-left-8"
          } ${on ? "bg-accent" : "bg-border"}`}
        />
      </li>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_15rem_1fr] lg:gap-x-8">
        <div className="order-1 flex items-center justify-center lg:order-2">
          <div className="relative flex h-full w-full items-center justify-center py-2 lg:py-0">
            <span aria-hidden className={`absolute top-[10%] bottom-[10%] left-0 hidden w-px transition-colors lg:block ${any ? "bg-accent" : "bg-border"}`} />
            <span aria-hidden className={`absolute top-[10%] bottom-[10%] right-0 hidden w-px transition-colors lg:block ${any ? "bg-accent" : "bg-border"}`} />
            <span aria-hidden className={`absolute top-1/2 left-0 hidden h-px w-6 lg:block ${any ? "bg-accent" : "bg-border"}`} />
            <span aria-hidden className={`absolute top-1/2 right-0 hidden h-px w-6 lg:block ${any ? "bg-accent" : "bg-border"}`} />
            <div
              className={`relative w-full rounded-3xl border p-6 text-center transition-[border-color,box-shadow] duration-300 lg:mx-6 ${
                any ? "border-accent shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_14%,transparent)]" : "border-border"
              } bg-surface`}
            >
              <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">One owner</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">Technical delivery</p>
              <p className="mt-3 font-mono text-3xl text-accent" aria-live="polite">
                {chosen.length}
                <span className="text-base text-muted">/{workAreas.length}</span>
              </p>
              <p className="mt-1 text-xs text-muted">areas selected</p>
            </div>
          </div>
        </div>
        <ul className="order-2 flex flex-col gap-3 lg:order-1">{left.map((a) => tile(a, "left"))}</ul>
        <ul className="order-3 flex flex-col gap-3">{right.map((a) => tile(a, "right"))}</ul>
      </div>

      <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-pretty text-base text-muted" aria-live="polite">
          {any ? (
            <>
              <span className="text-foreground">Your scope:</span> {chosen.map((a) => a.label).join(" · ")}
            </>
          ) : (
            "Choose one area or several. Your selection carries into the brief."
          )}
        </p>
        <PillLink href={any ? `/brief?scope=${picked.join(",")}` : "/brief"} className="shrink-0 self-start sm:self-auto">
          {any ? "Discuss this scope" : "Send a brief"}
        </PillLink>
      </div>
    </div>
  );
}
