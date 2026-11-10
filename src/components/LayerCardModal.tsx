"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal, RotateCcw, X } from "lucide-react";
import type { LayerCard } from "@/data/agencyLayers";

export type CardOwner = "mine" | "agency" | "brand" | "whole";
export type Rect = { x: number; y: number; w: number; h: number };

const OWNER_LABEL: Record<CardOwner, string> = {
  mine: "Delivered by me",
  agency: "Usually kept by your team, or mine to build",
  brand: "Stays with your agency",
  whole: "Every layer, one engineer",
};

const OWNER_BAND: Record<CardOwner, string> = {
  mine: "bg-[linear-gradient(135deg,#7dd3fc,#38bdf8_45%,#0ea5e9)] text-[#04121c]",
  agency: "bg-[#e6ecf2] text-[#0b1220]",
  brand: "bg-[linear-gradient(135deg,#1b2a3d,#0b1220_60%)] text-white",
  whole: "bg-[linear-gradient(135deg,#0ea5e9,#0b1220)] text-white",
};

const DEG_PER_PX = 0.5;

/**
 * A layer lifted out of the stack. It flies from the slab's position into a card,
 * turns over with a swipe (any number of times) or the Flip button, and flies back on close.
 */
export default function LayerCardModal({
  card,
  owner,
  index,
  total,
  from,
  onClose,
  onStep,
}: {
  card: LayerCard;
  owner: CardOwner;
  index: number;
  total: number;
  from: Rect | null;
  onClose: () => void;
  onStep: (dir: -1 | 1) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const angle = useRef(0);
  const drag = useRef<{ x: number; y: number; start: number; lastX: number; lastT: number; active: boolean } | null>(null);
  // Which card is showing its back. Keyed by id, so a new card always starts on its front.
  const [backFor, setBackFor] = useState<string | null>(null);
  const back = backFor === card.id;
  const leaving = useRef(false);
  const reduce = useRef(false);

  // Fly in from the slab.
  useLayoutEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = wrapRef.current;
    if (!el) return;
    if (!from || reduce.current) {
      el.style.opacity = "1";
      return;
    }
    const to = el.getBoundingClientRect();
    el.style.transformOrigin = "0 0";
    el.style.transition = "none";
    el.style.opacity = "0.4";
    el.style.transform = `translate(${from.x - to.left}px, ${from.y - to.top}px) scale(${from.w / to.width}, ${from.h / to.height})`;
    void el.offsetWidth;
    el.style.transition = "transform 560ms cubic-bezier(.2,.8,.2,1), opacity 320ms ease";
    el.style.transform = "none";
    el.style.opacity = "1";
    // Only on first open; stepping between layers keeps the card in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A new layer always starts on its front.
  useLayoutEffect(() => {
    angle.current = 0;
    const inner = innerRef.current;
    if (inner) { inner.style.transition = "none"; inner.style.transform = "rotateY(0deg)"; }
  }, [card.id]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      opener?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function close() {
    if (leaving.current) return;
    leaving.current = true;
    const el = wrapRef.current;
    if (!el || !from || reduce.current) { onClose(); return; }
    const now = el.getBoundingClientRect();
    el.style.transformOrigin = "0 0";
    el.style.transition = "transform 460ms cubic-bezier(.4,0,.2,1), opacity 380ms ease 80ms";
    el.style.transform = `translate(${from.x - now.left}px, ${from.y - now.top}px) scale(${from.w / now.width}, ${from.h / now.height})`;
    el.style.opacity = "0";
    setTimeout(onClose, 470);
  }

  const turnTo = (deg: number, animate: boolean) => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transition = animate ? "transform 650ms cubic-bezier(.2,.8,.2,1)" : "none";
    inner.style.transform = `rotateY(${deg}deg)`;
  };
  const settle = (target: number) => {
    angle.current = target;
    turnTo(target, true);
    setBackFor(Math.abs(Math.round(target / 180)) % 2 === 1 ? card.id : null);
  };
  const flip = () => settle(Math.round(angle.current / 180) * 180 + 180);

  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    if ((e.target as Element).closest("a,button")) return;
    const t = performance.now();
    drag.current = { x: e.clientX, y: e.clientY, start: angle.current, lastX: e.clientX, lastT: t, active: false };
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.active) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) { drag.current = null; return; }
      d.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    d.lastX = e.clientX;
    d.lastT = performance.now();
    angle.current = d.start + dx * DEG_PER_PX;
    turnTo(angle.current, false);
  }
  function onPointerUp(e: React.PointerEvent) {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.active) { flip(); return; } // a tap on the card turns it over
    const dt = Math.max(1, performance.now() - d.lastT);
    const projected = angle.current + ((e.clientX - d.lastX) / dt) * DEG_PER_PX * 120;
    let target = Math.round(projected / 180) * 180;
    if (target === Math.round(d.start / 180) * 180 && Math.abs(angle.current - d.start) > 25) {
      target += angle.current > d.start ? 180 : -180;
    }
    settle(target);
  }

  const band = OWNER_BAND[owner];
  const titleId = `layer-card-${card.id}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070a]/92 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        ref={wrapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-[min(26rem,100%)]"
        style={{ opacity: 0 }}
      >
        <div className="mb-3 flex items-center justify-between text-white">
          <span className="font-mono text-xs tracking-[0.16em] text-white/70 uppercase">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close card"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <div
          className="card3d select-none"
          style={{ touchAction: "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { drag.current = null; settle(Math.round(angle.current / 180) * 180); }}
        >
          <div ref={innerRef} className="card3d-inner">
            {/* Front */}
            <section inert={back} className="face overflow-hidden rounded-[22px] bg-white text-[#0b1220] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)]">
              <div className={`px-6 pt-6 pb-5 ${band}`}>
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase opacity-80">{OWNER_LABEL[owner]}</p>
                <h3 id={titleId} className="mt-3 text-2xl font-semibold leading-tight tracking-tight">{card.label}</h3>
              </div>
              <div className="px-6 pt-5 pb-6">
                <p className="text-pretty text-base leading-relaxed text-[#334155]">{card.summary}</p>
                <p className="mt-5 font-mono text-[11px] tracking-[0.16em] text-[#026fa9] uppercase">What I take on</p>
                <ul className="mt-3 space-y-2.5">
                  {card.take.map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] leading-snug text-[#0b1220]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0ea5e9]" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 flex items-center gap-2 text-xs text-[#64748b]">
                  <MoveHorizontal size={13} aria-hidden /> Swipe or tap the card to turn it over
                </p>
              </div>
            </section>

            {/* Back */}
            <section inert={!back} className="face face-back overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_20%_0%,#13293a,#070d14_65%)] text-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)]">
              <div className="px-6 pt-6 pb-6">
                <p className="font-mono text-[11px] tracking-[0.16em] text-sky-300 uppercase">How it works with you</p>
                <ul className="mt-3 space-y-2.5">
                  {card.how.map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] leading-snug text-white/85">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-mono text-[11px] tracking-[0.16em] text-sky-300 uppercase">What you get</p>
                <ul className="mt-3 space-y-2.5">
                  {card.get.map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] leading-snug text-white/85">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl border border-sky-400/40 bg-white/5 p-4">
                  <p className="font-mono text-[11px] tracking-[0.16em] text-sky-300 uppercase">Proof</p>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-white/85">{card.proof}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label="Previous layer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={flip}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-400 px-5 text-sm font-semibold text-[#04121c] hover:brightness-110"
          >
            <RotateCcw size={15} aria-hidden /> {back ? "Show the front" : "Flip for details"}
          </button>
          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label="Next layer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
