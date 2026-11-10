"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointerClick, Move3d } from "lucide-react";

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

type Layer = { id: string; label: string; detail: string; mine: Record<Mode, boolean> };

// Bottom to top.
const layers: Layer[] = [
  { id: "deploy", label: "Deployment & monitoring", detail: "Hosting, CI/CD, environments, logging and error tracking, so the client's system stays up after launch.", mine: { alongside: true, whitelabel: true } },
  { id: "data", label: "Data & integrations", detail: "Schemas, migrations, payments, CRMs and third-party APIs, connected and tested.", mine: { alongside: true, whitelabel: true } },
  { id: "backend", label: "Backend & APIs", detail: "Business logic, sign-in and roles, background jobs, and the API your frontend calls.", mine: { alongside: true, whitelabel: true } },
  { id: "frontend", label: "Frontend", detail: "Screens and dashboards built from your designer's files. Yours to keep in-house, or mine to build.", mine: { alongside: false, whitelabel: true } },
];

const top: Record<Mode, { label: string; detail: string }> = {
  alongside: { label: "Your agency team", detail: "Design, client contact and project management stay with your team. I report into your process." },
  whitelabel: { label: "Your brand", detail: "The client sees your agency only. I work underneath, under your name, in your tools." },
};

const DEFAULT_SPIN = -38;
const DEFAULT_TILT = 58;

export default function AgencyStack() {
  const [mode, setMode] = useState<Mode>("alongside");
  const [selected, setSelected] = useState<string>("backend");
  const [open, setOpen] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const view = useRef({ spin: DEFAULT_SPIN, tilt: DEFAULT_TILT });
  const drag = useRef<{ x: number; y: number; spin: number; tilt: number; active: boolean; mouse: boolean } | null>(null);
  const touched = useRef(false);
  const suppressClick = useRef(false);

  const applyView = (animate = false) => {
    const el = stackRef.current;
    if (!el) return;
    el.style.transition = animate ? "transform 700ms cubic-bezier(.2,.8,.2,1)" : "none";
    el.style.transform = `rotateX(${view.current.tilt}deg) rotateZ(${view.current.spin}deg)`;
  };

  // Open the stack when it scrolls into view; sway gently until someone touches it.
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOpen(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    applyView();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => io.disconnect();
    let frame = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      if (!touched.current) {
        view.current.spin = DEFAULT_SPIN + Math.sin((t - t0) / 1800) * 7;
        applyView();
        frame = requestAnimationFrame(loop);
      }
    };
    frame = requestAnimationFrame(loop);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, spin: view.current.spin, tilt: view.current.tilt, active: false, mouse: e.pointerType === "mouse" };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.active) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      // On touch, vertical movement belongs to page scrolling.
      if (!d.mouse && Math.abs(dy) > Math.abs(dx)) { drag.current = null; return; }
      d.active = true;
      touched.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    view.current.spin = d.spin + dx * 0.45;
    if (d.mouse) view.current.tilt = Math.min(72, Math.max(28, d.tilt - dy * 0.3));
    applyView();
  }

  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (d?.active) {
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
    }
  }

  const pick = (id: string) => {
    if (suppressClick.current) return;
    touched.current = true;
    setSelected(id);
  };

  const resetView = () => {
    touched.current = true;
    view.current = { spin: DEFAULT_SPIN, tilt: DEFAULT_TILT };
    applyView(true);
  };

  const all = [
    ...layers.map((l) => ({ id: l.id, label: l.label, detail: l.detail, kind: l.mine[mode] ? "mine" : "agency" })),
    { id: "top", label: top[mode].label, detail: top[mode].detail, kind: "brand" as const },
  ];
  const current = all.find((l) => l.id === selected) ?? all[2];
  const selIndex = all.findIndex((l) => l.id === current.id);

  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-3 lg:pt-6">
        <div role="radiogroup" aria-label="How we work together" className="flex flex-col gap-3">
          {modes.map((m, i) => {
            const on = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setMode(m.id)}
                className={`rounded-2xl border p-6 text-left transition-[border-color,background-color,box-shadow] duration-200 sm:p-7 ${
                  on ? "border-accent bg-surface shadow-[var(--card-shadow)]" : "border-border hover:border-foreground/30"
                }`}
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm text-accent">0{i + 1}</span>
                  <span className={`h-4 w-4 rounded-full border-2 transition-colors ${on ? "border-accent bg-accent" : "border-border"}`} aria-hidden />
                </span>
                <span className="mt-4 block text-xl font-semibold tracking-tight text-foreground">{m.title}</span>
                <span className="mt-2 block text-pretty text-base leading-relaxed text-muted">{m.detail}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div
          ref={sceneRef}
          className="slab-scene relative mx-auto aspect-square w-full max-w-[32rem] cursor-grab select-none active:cursor-grabbing"
          data-open={open}
          style={{ touchAction: "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
          aria-hidden
        >
          <div className="absolute inset-0 flex items-center justify-center pt-[34%]">
            <div ref={stackRef} className="slab-stack relative aspect-square w-[52%]">
              <div className="slab-shadow" />
              {all.map((l, i) => {
                const lifted = selected === l.id;
                return (
                  <div
                    key={l.id}
                    className={`slab slab-${l.kind}`}
                    data-lifted={lifted}
                    style={{ "--i": i, "--above": i > selIndex ? 1 : 0, "--sel": i === selIndex ? 1 : 0 } as React.CSSProperties}
                    onClick={() => pick(l.id)}
                  >
                    <span className="slab-side slab-front" />
                    <span className="slab-side slab-right" />
                    <span className="slab-side slab-back" />
                    <span className="slab-side slab-left" />
                    <span className="slab-top">
                      {l.kind === "brand" && (
                        <span className="absolute top-3 left-3 flex gap-1" aria-hidden>
                          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                        </span>
                      )}
                      <span className="slab-label">{l.label}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <span className="pointer-events-none absolute top-2 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full border border-border bg-surface/90 px-3 py-1.5 text-xs text-muted">
            <span className="flex items-center gap-1.5"><Move3d size={13} /> Drag to rotate</span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1.5"><MousePointerClick size={13} /> Tap a layer</span>
          </span>
        </div>

        {/* The same layers as plain buttons: readable, keyboard friendly, and in the HTML for crawlers. */}
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Layers">
            {[...all].reverse().map((l) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={selected === l.id}
                onClick={() => pick(l.id)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors ${
                  selected === l.id ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted hover:text-foreground"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-[3px] ${l.kind === "mine" ? "bg-accent-fill" : l.kind === "brand" ? "bg-[#0b1220]" : "border border-border bg-background"}`}
                  aria-hidden
                />
                {l.label}
              </button>
            ))}
          </div>
          <div className="mt-5 border-t border-border pt-5" role="tabpanel" aria-live="polite">
            <p className="font-mono text-xs tracking-[0.16em] text-accent uppercase">
              {current.kind === "mine" ? "Delivered by me" : current.kind === "brand" ? "Stays with your agency" : "Kept by your team"}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{current.label}</p>
            <p className="mt-1.5 text-pretty text-base leading-relaxed text-muted">{current.detail}</p>
            <button type="button" onClick={resetView} className="mt-3 min-h-11 text-sm text-accent underline-offset-4 hover:underline">
              Reset view
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
