"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { stages, TESTING_LINE, type Stage } from "@/data/services";

function StageDetail({ stage }: { stage: Stage }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {stage.groups.map((g) => (
        <div key={g.id}>
          <h4 className="font-mono text-xs tracking-[0.16em] text-accent uppercase">{g.title}</h4>
          <ul className="mt-3 space-y-2">
            {g.items.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {stage.number === "04" && (
        <p className="rounded-xl border border-accent/40 px-4 py-3 text-sm leading-relaxed text-foreground md:col-span-2">{TESTING_LINE}</p>
      )}
    </div>
  );
}

/**
 * Six stages on a track that fills as the section scrolls past. Tap a stage to open what it includes,
 * right there: under the stage on phones, in a panel under the row on desktop. All text is in the HTML.
 */
export default function Lifecycle() {
  const ref = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);
  const [openStage, setOpenStage] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8;
      const end = vh * 0.55;
      const total = r.height + (start - end);
      setProgress(Math.min(1, Math.max(0, (start - r.top) / total)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const active = Math.min(stages.length - 1, Math.floor(progress * stages.length + 0.15));
  const toggle = (n: string) => setOpenStage((cur) => (cur === n ? null : n));
  const desktopStage = stages.find((s) => s.number === openStage) ?? null;

  return (
    <div>
      <div className="relative" style={{ "--p": progress } as React.CSSProperties}>
        <div aria-hidden className="absolute top-5 right-[8%] left-[8%] hidden h-px bg-border lg:block">
          <div className="track-fill h-full bg-accent" />
        </div>
        <div aria-hidden className="absolute top-2 bottom-2 left-5 w-px bg-border lg:hidden">
          <div className="track-fill-y h-full w-full bg-accent" />
        </div>

        <ol ref={ref} className="relative grid grid-cols-1 gap-4 lg:grid-cols-6 lg:gap-5">
          {stages.map((stage, i) => {
            const reached = (i <= active && progress > 0.02) || openStage === stage.number;
            const open = openStage === stage.number;
            return (
              <li key={stage.number} className="relative pl-16 lg:pl-0 lg:text-center">
                <button
                  type="button"
                  onClick={() => toggle(stage.number)}
                  aria-expanded={open}
                  aria-controls={`stage-panel-${stage.number}`}
                  className={`group w-full rounded-2xl p-3 text-left transition-colors lg:text-center ${open ? "bg-surface" : "hover:bg-surface/60"}`}
                >
                  <span
                    className={`absolute top-3 left-0 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-sm transition-colors duration-300 lg:relative lg:top-0 lg:mx-auto ${
                      reached ? "border-accent bg-accent-fill text-accent-ink" : "border-border bg-background text-muted"
                    }`}
                  >
                    {stage.number}
                  </span>
                  <span className="flex items-center justify-between gap-2 lg:mt-5 lg:justify-center">
                    <span className="text-lg font-semibold tracking-tight text-foreground">{stage.title}</span>
                    <ChevronDown size={16} aria-hidden className={`shrink-0 text-accent transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                  </span>
                  <span className="mt-2 block text-pretty text-sm leading-relaxed text-muted">{stage.summary}</span>
                </button>

                {/* Phone and tablet: the detail opens under the stage. */}
                <div
                  id={`stage-panel-${stage.number}`}
                  className="grid transition-[grid-template-rows] duration-400 ease-out lg:hidden"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  inert={!open}
                >
                  <div className="overflow-hidden">
                    <div className="px-3 pt-2 pb-5">
                      <StageDetail stage={stage} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Desktop: one panel under the row. */}
      <div className="hidden lg:block">
        <div
          className="grid transition-[grid-template-rows] duration-500 ease-out"
          style={{ gridTemplateRows: desktopStage ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {desktopStage && (
              <div key={desktopStage.number} className="rise mt-8 rounded-3xl border border-border bg-surface p-8">
                <p className="font-mono text-sm text-accent">
                  {desktopStage.number} · {desktopStage.title}
                </p>
                <div className="mt-6">
                  <StageDetail stage={desktopStage} />
                </div>
              </div>
            )}
          </div>
        </div>
        {!desktopStage && <p className="mt-6 text-center text-sm text-muted">Select a stage to see what it includes.</p>}
      </div>
      <p className="mt-4 text-sm text-muted lg:hidden">Tap a stage to see what it includes.</p>
    </div>
  );
}
