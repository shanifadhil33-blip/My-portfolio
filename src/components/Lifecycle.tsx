"use client";

import { useEffect, useRef, useState } from "react";
import { stages } from "@/data/services";

/** Six stages on a track that fills as the section scrolls past. All text is plain HTML. */
export default function Lifecycle() {
  const ref = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the list top reaches 80% of the viewport, 1 when its bottom reaches 55%.
      const start = vh * 0.8;
      const end = vh * 0.55;
      const total = r.height + (start - end);
      const p = Math.min(1, Math.max(0, (start - r.top) / total));
      setProgress(p);
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

  return (
    <div className="relative" style={{ "--p": progress } as React.CSSProperties}>
      {/* Track: horizontal on large screens, vertical below. */}
      <div aria-hidden className="absolute top-5 right-[8%] left-[8%] hidden h-px bg-border lg:block">
        <div className="track-fill h-full bg-accent" />
      </div>
      <div aria-hidden className="absolute top-2 bottom-2 left-5 w-px bg-border lg:hidden">
        <div className="track-fill-y h-full w-full bg-accent" />
      </div>

      <ol ref={ref} className="relative grid grid-cols-1 gap-8 lg:grid-cols-6 lg:gap-5">
        {stages.map((stage, i) => {
          const reached = i <= active && progress > 0.02;
          return (
            <li key={stage.number} className="relative pl-16 lg:pl-0 lg:text-center">
              <span
                className={`absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-sm transition-colors duration-300 lg:relative lg:mx-auto ${
                  reached ? "border-accent bg-accent-fill text-accent-ink" : "border-border bg-background text-muted"
                }`}
              >
                {stage.number}
              </span>
              <h3 className="mt-0 text-lg font-semibold tracking-tight text-foreground lg:mt-6">{stage.title}</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{stage.summary}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
