"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "alongside" | "whitelabel";

const modes: { id: Mode; title: string; detail: string }[] = [
  {
    id: "alongside",
    title: "Alongside your team",
    detail:
      "Your designers and developers keep their parts. I take the engineering pieces you hand over and work inside your codebase, tools and review process.",
  },
  {
    id: "whitelabel",
    title: "Behind your brand",
    detail:
      "Your agency stays the face of the project. I deliver the engineering underneath, and the client relationship stays yours.",
  },
];

// Bottom to top. `mine` marks the layers I deliver in each mode.
const layers = [
  { label: "Deployment & monitoring", mine: { alongside: true, whitelabel: true } },
  { label: "Data & integrations", mine: { alongside: true, whitelabel: true } },
  { label: "Backend & APIs", mine: { alongside: true, whitelabel: true } },
  { label: "Frontend", mine: { alongside: false, whitelabel: true } },
];

export default function AgencyStack() {
  const [mode, setMode] = useState<Mode>("alongside");
  const [open, setOpen] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  // Separate the layers once the stack scrolls into view.
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOpen(entry.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const top = mode === "alongside" ? "Your team · design, client, PM" : "Your brand · your client";

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div role="radiogroup" aria-label="How we work together" className="flex flex-col gap-3">
        {modes.map((m, i) => {
          const selected = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setMode(m.id)}
              className={`rounded-2xl border p-6 text-left transition-[border-color,background-color,box-shadow] duration-200 sm:p-7 ${
                selected
                  ? "border-accent bg-surface shadow-[var(--card-shadow)]"
                  : "border-border bg-transparent hover:border-foreground/30"
              }`}
            >
              <span className="flex items-center justify-between gap-4">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <span
                  className={`h-4 w-4 rounded-full border-2 transition-colors ${selected ? "border-accent bg-accent" : "border-border"}`}
                  aria-hidden
                />
              </span>
              <span className="mt-4 block text-xl font-semibold tracking-tight text-foreground">{m.title}</span>
              <span className="mt-2 block text-pretty text-base leading-relaxed text-muted">{m.detail}</span>
            </button>
          );
        })}
        <p className="mt-2 flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-[4px] bg-accent-fill" aria-hidden /> Delivered by me</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-[4px] border border-border bg-surface" aria-hidden /> Your agency</span>
        </p>
      </div>

      <div
        ref={sceneRef}
        className="stack-scene relative mx-auto flex aspect-square w-full max-w-[30rem] items-center justify-center"
        data-open={open}
        onPointerEnter={() => setOpen(true)}
        role="img"
        aria-label={`Layer diagram. Top layer: ${top}. Layers delivered by me: ${layers
          .filter((l) => l.mine[mode])
          .map((l) => l.label)
          .join(", ")}.`}
      >
        <div className="stack mt-[14%] h-[56%] w-[56%]">
          {layers.map((layer, i) => {
            const mine = layer.mine[mode];
            return (
              <div
                key={layer.label}
                className={`plate flex items-end p-4 ${mine ? "border-sky-300/60 bg-accent-fill" : "bg-surface"}`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className={`text-sm font-semibold sm:text-base ${mine ? "text-accent-ink" : "text-foreground"}`}>{layer.label}</span>
              </div>
            );
          })}
          <div
            className="plate flex flex-col justify-between bg-[#0b1220] p-4"
            style={{ "--i": layers.length + 0.4 } as React.CSSProperties}
          >
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </span>
            <span className="text-sm font-semibold text-white sm:text-base">{top}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
