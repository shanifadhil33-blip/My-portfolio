"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Move3d, RotateCcw } from "lucide-react";
import { agencyLayer, engineeringLayers, wholeBuild, type LayerCard, type Mode } from "@/data/agencyLayers";
import LayerCardModal, { type CardOwner, type Pose, type Rect } from "./LayerCardModal";

const modes: { id: Mode; title: string; detail: string }[] = [
  {
    id: "whitelabel",
    title: "Behind your brand",
    detail:
      "You sell the project and stay the face of it. I build the software underneath, under your name, and the client relationship stays yours.",
  },
  {
    id: "referral",
    title: "Refer it to me",
    detail:
      "A client asks for something outside what you do. Introduce them, I scope and deliver it, and you stay in the loop. Referral terms are agreed up front.",
  },
];

const DEFAULT_SPIN = -38;
const DEFAULT_TILT = 58;

// The caps and corner walls use the same eight chords per quarter circle.
// Shared endpoints close the box without the old full-width corner fins.
const CORNER_STEPS = 8;
const corners = [
  { x: "calc(100% - var(--r))", y: "var(--r)", start: -90 },
  { x: "calc(100% - var(--r))", y: "calc(100% - var(--r))", start: 0 },
  { x: "var(--r)", y: "calc(100% - var(--r))", start: 90 },
  { x: "var(--r)", y: "var(--r)", start: 180 },
];
const cornerPoint = (center: string, offset: number) => `calc(${center} + var(--r) * ${offset.toFixed(8)})`;
const capPoints: string[] = [];
const cornerWalls = corners.flatMap(({ x, y, start }) => {
  for (let step = 0; step <= CORNER_STEPS; step++) {
    const angle = (start + step * 90 / CORNER_STEPS) * Math.PI / 180;
    capPoints.push(`${cornerPoint(x, Math.cos(angle))} ${cornerPoint(y, Math.sin(angle))}`);
  }
  return Array.from({ length: CORNER_STEPS }, (_, step) => {
    const angle = start + step * 90 / CORNER_STEPS;
    const radians = angle * Math.PI / 180;
    const mid = angle + 45 / CORNER_STEPS;
    return {
      left: cornerPoint(x, Math.cos(radians)),
      top: cornerPoint(y, Math.sin(radians)),
      // Subpixel bleed seals rasterized seams between non-coplanar walls.
      width: `calc(var(--r) * ${(2 * Math.sin(Math.PI / (4 * CORNER_STEPS))).toFixed(8)} + .8px)`,
      transform: `rotateZ(${mid + 90}deg) rotateX(90deg) translateX(-.4px)`,
      // Blend the adjoining side colours according to the wall's normal.
      "--wall": `color-mix(in srgb, var(--side-light) ${(Math.sin(mid * Math.PI / 180) ** 2 * 100).toFixed(4)}%, var(--side-dark))`,
    } as React.CSSProperties;
  });
});
const capOutline = `polygon(${capPoints.join(", ")})`;

type Slab = { card: LayerCard; owner: CardOwner };

const drawerBounds = (shift: HTMLElement) => {
  const parts = [...shift.querySelectorAll(".slab-top, .slab-front, .slab-right, .slab-label")].map((node) => node.getBoundingClientRect());
  return parts.reduce((box, part) => ({
    left: Math.min(box.left, part.left),
    top: Math.min(box.top, part.top),
    right: Math.max(box.right, part.right),
    bottom: Math.max(box.bottom, part.bottom),
  }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
};

const drawerLimit = (scene: HTMLElement) => {
  const box = scene.getBoundingClientRect();
  const pad = 8;
  return {
    left: Math.max(pad, box.left + pad),
    top: Math.max(pad, box.top + pad),
    right: Math.min(window.innerWidth - pad, box.right - pad),
    bottom: Math.min(window.innerHeight - pad, box.bottom - pad),
  };
};

const drawerFits = (box: ReturnType<typeof drawerBounds>, limit: ReturnType<typeof drawerLimit>) =>
  box.left >= limit.left && box.right <= limit.right && box.top >= limit.top && box.bottom <= limit.bottom;

// Probe synchronously with transitions disabled so no intermediate pose can paint.
const clampDrawer = (shift: HTMLElement, requested: number, limit: ReturnType<typeof drawerLimit>) => {
  let lo = 0;
  let hi = Math.max(0, requested);
  let best = 0;
  for (let step = 0; step < 12; step++) {
    const mid = (lo + hi) / 2;
    shift.style.transform = `translateX(${mid}px)`;
    if (drawerFits(drawerBounds(shift), limit)) { best = mid; lo = mid; }
    else hi = mid;
  }
  shift.style.transform = `translateX(${best}px)`;
  return best;
};

export default function AgencyStack() {
  const [mode, setMode] = useState<Mode>("whitelabel");
  const [selected, setSelected] = useState<string>("backend");
  const [openId, setOpenId] = useState<string | null>(null);
  const [from, setFrom] = useState<Rect | null>(null);
  const [pose, setPose] = useState<Pose | null>(null);
  const [open, setOpen] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const view = useRef({ spin: DEFAULT_SPIN, tilt: DEFAULT_TILT });
  const g = useRef<{ x: number; y: number; spin: number; tilt: number; mode: "pending" | "rotate" | "slide"; layer: string | null } | null>(null);
  const touched = useRef(false);
  const drawn = useRef<string | null>(null);
  const movingDrawers = useRef(new Set<string>());
  const returnUntil = useRef(new Map<string, number>());

  const slabs: Slab[] = [
    ...engineeringLayers.map((l) => ({ card: l, owner: "mine" as CardOwner })),
    { card: agencyLayer[mode], owner: "brand" as CardOwner },
  ];
  // Card order when stepping: whole build, then the stack from top to bottom.
  const deck: Slab[] = [{ card: wholeBuild, owner: "whole" }, ...[...slabs].reverse()];
  const selIndex = slabs.findIndex((s) => s.card.id === selected);

  const applyView = (animate = false) => {
    const el = stackRef.current;
    if (!el) return;
    el.style.setProperty("--view-duration", animate ? "700ms" : "0ms");
    el.style.transform = `rotateX(${view.current.tilt}deg) rotateZ(${view.current.spin}deg)`;
  };

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOpen(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    applyView();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => io.disconnect();
    let frame = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      if (touched.current) return;
      view.current.spin = DEFAULT_SPIN + Math.sin((t - t0) / 1800) * 7;
      applyView();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  const slabEl = (id: string) => stackRef.current?.querySelector<HTMLElement>(`[data-layer="${id}"]`) ?? null;

  const rectOf = (id: string): Rect | null => {
    const target = id === "whole" ? stackRef.current : slabEl(id)?.querySelector<HTMLElement>(".slab-top");
    if (!target) return null;
    const r = target.getBoundingClientRect();
    return { x: r.left, y: r.top, w: Math.max(40, r.width), h: Math.max(40, r.height) };
  };

  const poseNow = (): Pose => ({ tilt: view.current.tilt, spin: view.current.spin, size: stackRef.current?.offsetWidth ?? 160 });

  const openCard = (id: string) => {
    touched.current = true;
    if (id !== "whole") setSelected(id);
    setFrom(rectOf(id));
    setPose(poseNow());
    setOpenId(id);
  };

  const openIdRef = useRef<string | null>(null);
  useEffect(() => { openIdRef.current = openId; }, [openId]);
  const step = useCallback((dir: -1 | 1) => {
    const cur = openIdRef.current;
    if (!cur) return;
    const ids = [wholeBuild.id, "top", ...[...engineeringLayers].reverse().map((l) => l.id)];
    const next = ids[(ids.indexOf(cur) + dir + ids.length) % ids.length];
    if (next !== "whole") setSelected(next);
    setFrom(rectOf(next)); // closing puts the card back where this layer sits
    setPose(poseNow());
    setOpenId(next);
    // rectOf only reads the DOM.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Screen direction of the slab's own right edge, after the current isometric turn.
  const rightOnScreen = () => {
    const spin = (view.current.spin * Math.PI) / 180;
    const tilt = (view.current.tilt * Math.PI) / 180;
    const x = Math.cos(spin);
    const y = Math.sin(spin) * Math.cos(tilt);
    const len = Math.hypot(x, y) || 1;
    return { x: x / len, y: y / len, perLocal: len };
  };

  const slideDrawer = (id: string, requested: number, dragging: boolean) => {
    const el = slabEl(id);
    const scene = sceneRef.current;
    const shift = el?.querySelector<HTMLElement>(".slab-shift");
    if (!el || !scene || !shift) return 0;
    const current = getComputedStyle(shift).transform;
    returnUntil.current.delete(id);
    shift.style.transitionDuration = "";
    el.dataset.dragging = "true";
    const best = clampDrawer(shift, requested, drawerLimit(scene));
    // Probes never paint. Restore the rendered pose before easing to the target.
    shift.style.transform = current === "none" ? "translateX(0px)" : current;
    shift.getBoundingClientRect();
    el.dataset.dragging = String(dragging);
    shift.style.transform = `translateX(${best}px)`;
    movingDrawers.current.add(id);
    return best;
  };

  const snapDrawer = () => {
    drawn.current = null;
    stackRef.current?.querySelectorAll<HTMLElement>(".slab").forEach((slab) => {
      slab.dataset.dragging = "false";
      const shift = slab.querySelector<HTMLElement>(".slab-shift");
      if (shift) {
        returnUntil.current.set(slab.dataset.layer!, performance.now() + 480);
        shift.style.transitionDuration = "";
        shift.style.transform = "translateX(0px)";
      }
    });
  };

  useEffect(() => {
    if (!open) return;
    let frame = 0;
    const constrain = () => {
      const scene = sceneRef.current;
      if (scene && movingDrawers.current.size) {
        const limit = drawerLimit(scene);
        for (const id of movingDrawers.current) {
          const slab = stackRef.current?.querySelector<HTMLElement>(`[data-layer="${id}"]`);
          const shift = slab?.querySelector<HTMLElement>(".slab-shift");
          if (!slab || !shift) { movingDrawers.current.delete(id); continue; }
          const x = new DOMMatrixReadOnly(getComputedStyle(shift).transform).m41;
          if (x <= 0) {
            shift.style.transitionDuration = "";
            returnUntil.current.delete(id);
            if (drawn.current !== id && g.current?.layer !== id) movingDrawers.current.delete(id);
            continue;
          }
          // Recheck during the press, return animation, scrolling and resizing too.
          if (!drawerFits(drawerBounds(shift), limit)) {
            const dragging = slab.dataset.dragging;
            slab.dataset.dragging = "true";
            clampDrawer(shift, x, limit);
            shift.getBoundingClientRect();
            slab.dataset.dragging = dragging;
            if (drawn.current !== id && !(g.current?.mode === "slide" && g.current.layer === id)) {
              // A clamp correction must not restart the 480ms return clock.
              shift.style.transitionDuration = `${Math.max(0, (returnUntil.current.get(id) ?? performance.now()) - performance.now())}ms`;
              shift.style.transform = "translateX(0px)";
            }
          }
        }
      }
      frame = requestAnimationFrame(constrain);
    };
    frame = requestAnimationFrame(constrain);
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    const layer = (e.target as Element).closest<HTMLElement>("[data-layer]")?.dataset.layer ?? null;
    g.current = { x: e.clientX, y: e.clientY, spin: view.current.spin, tilt: view.current.tilt, mode: "pending", layer };
    if (layer) slabEl(layer)?.setAttribute("data-pressed", "true");
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = g.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (d.mode === "pending") {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      const axis = rightOnScreen();
      const along = dx * axis.x + dy * axis.y;
      const perp = Math.abs(-dx * axis.y + dy * axis.x);
      if (d.layer && along > 6 && along > perp) d.mode = "slide";
      else if (!d.layer && Math.abs(dy) > Math.abs(dx)) { cancelGesture(); return; }
      else d.mode = "rotate";
      touched.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      snapDrawer();
    }
    if (d.mode === "rotate") {
      // Free rotation on both axes, so the stack can turn all the way round and show its underside.
      view.current.spin = d.spin + dx * 0.45;
      view.current.tilt = d.tilt - dy * 0.4;
      applyView();
    } else if (d.mode === "slide" && d.layer) {
      const axis = rightOnScreen();
      const along = (e.clientX - d.x) * axis.x + (e.clientY - d.y) * axis.y;
      slideDrawer(d.layer, Math.max(0, along / axis.perLocal), true);
    }
  }

  function onPointerUp() {
    const d = g.current;
    g.current = null;
    if (!d) return;
    if (d.layer) slabEl(d.layer)?.removeAttribute("data-pressed");
    if (d.mode === "pending" && d.layer) {
      touched.current = true;
      if (drawn.current === d.layer) snapDrawer();
      else {
        snapDrawer();
        drawn.current = d.layer;
        slideDrawer(d.layer, 280, false);
      }
      return;
    }
    if (d.mode === "slide" && d.layer) snapDrawer();
  }

  function cancelGesture() {
    const d = g.current;
    g.current = null;
    if (d?.layer) slabEl(d.layer)?.removeAttribute("data-pressed");
    snapDrawer();
  }

  const resetView = () => {
    touched.current = true;
    cancelGesture();
    view.current = { spin: DEFAULT_SPIN, tilt: DEFAULT_TILT };
    applyView(true);
  };

  const openSlab = deck.find((s) => s.card.id === openId) ?? null;

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
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="hidden items-center gap-1.5 sm:flex"><Move3d size={14} aria-hidden /> Drag to turn it any way</span>
          <span className="flex items-center gap-1.5"><ArrowRight size={14} aria-hidden /> Tap a layer or drag it right</span>
          <button type="button" onClick={resetView} className="flex min-h-9 items-center gap-1 text-accent hover:underline">
            <RotateCcw size={12} aria-hidden /> Reset
          </button>
        </div>

        {/* Include the reserved space above the stack in the drawer clamp bounds. */}
        <div
          ref={sceneRef}
          className="slab-scene relative mx-auto w-full max-w-[32rem] cursor-grab pt-8 select-none active:cursor-grabbing sm:pt-24"
          data-open={open}
          style={{ touchAction: "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={cancelGesture}
          aria-hidden
        >
          <div className="slab-stage relative aspect-[4/5] sm:aspect-square">
            {/* Positioned with margins, not a transform, so the stack keeps the scene's perspective. */}
            <div className="absolute top-[calc(66%+5rem)] left-1/2 -mt-[22%] -ml-[22%] aspect-square w-[44%]">
              <div ref={stackRef} className="slab-stack relative h-full w-full" style={{ "--cap": capOutline } as React.CSSProperties}>
                <div className="slab-shadow" />
                {slabs.map((s, i) => (
                  <div
                    key={s.card.id}
                    data-layer={s.card.id}
                    className={`slab slab-${s.owner}`}
                    data-out={openId === s.card.id}
                    style={{
                      "--i": i,
                      "--above": i > selIndex ? 1 : 0,
                      "--sel": i === selIndex ? 1 : 0,
                      "--next-above": i + 1 > selIndex ? 1 : 0,
                      "--next-sel": i + 1 === selIndex ? 1 : 0,
                      ...(i === slabs.length - 1 ? { "--room": "232px" } : {}),
                    } as React.CSSProperties}
                  >
                    <div className="slab-shift">
                      <span className="slab-side slab-bottom" />
                      <span className="slab-side slab-front" />
                      <span className="slab-side slab-right" />
                      <span className="slab-side slab-back" />
                      <span className="slab-side slab-left" />
                      {cornerWalls.map((style, corner) => (
                        <span key={corner} className="slab-side slab-corner" style={style} />
                      ))}
                      <span className="slab-top">
                        {s.owner === "brand" && (
                          <span className="absolute top-3 left-3 flex gap-1" aria-hidden>
                            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                          </span>
                        )}
                        <span className="slab-label">{s.card.label}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* The same layers as buttons: keyboard friendly, and an obvious way in for anyone who doesn't drag. */}
        <div className="mt-2 flex flex-wrap justify-center gap-2" aria-label="Open a layer">
          {deck.map((s) => (
            <button
              key={s.card.id}
              type="button"
              onClick={() => openCard(s.card.id)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors ${
                selected === s.card.id ? "border-accent bg-accent/10 text-foreground" : "border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              <span
                aria-hidden
                className={`h-2.5 w-2.5 rounded-[3px] ${
                  s.owner === "mine" ? "bg-accent-fill" : s.owner === "brand" ? "bg-[#0b1220]" : s.owner === "whole" ? "bg-[linear-gradient(135deg,#0ea5e9,#0b1220)]" : "border border-border bg-background"
                }`}
              />
              {s.card.label}
            </button>
          ))}
        </div>

        {/* Every card's content as plain text, so it is readable without the 3D view. */}
        <details className="hood-panel mt-5 rounded-2xl border border-border bg-surface">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between px-5 text-sm font-medium text-foreground">
            Read every layer as text
            <span className="hood-chevron text-muted" aria-hidden>▾</span>
          </summary>
          <div className="space-y-6 px-5 pb-6">
            {deck.map((s) => (
              <div key={s.card.id}>
                <h4 className="text-base font-semibold text-foreground">{s.card.label}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.card.summary}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted"><span className="text-foreground">What I take on:</span> {s.card.take.join(". ")}.</p>
                <p className="mt-1 text-sm leading-relaxed text-muted"><span className="text-foreground">How it works:</span> {s.card.how.join(". ")}.</p>
                <p className="mt-1 text-sm leading-relaxed text-muted"><span className="text-foreground">What you get:</span> {s.card.get.join(". ")}.</p>
                <p className="mt-1 text-sm leading-relaxed text-muted"><span className="text-foreground">Proof:</span> {s.card.proof}</p>
              </div>
            ))}
          </div>
        </details>
      </div>

      {openSlab && (
        <LayerCardModal
          card={openSlab.card}
          owner={openSlab.owner}
          index={deck.findIndex((s) => s.card.id === openSlab.card.id)}
          total={deck.length}
          from={from}
          pose={pose}
          onStep={step}
          onClose={() => { setOpenId(null); setFrom(null); }}
        />
      )}
    </div>
  );
}
