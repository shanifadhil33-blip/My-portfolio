"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Mail, MoveHorizontal } from "lucide-react";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, UPWORK_URL, WHATSAPP_URL } from "@/lib/site";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "./ui";

const DEG_PER_PX = 0.55;

const iconLink =
  "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-150 hover:border-white/40 hover:bg-white/10 active:bg-white/15";

/**
 * A round portrait that turns like a coin. Swipe or drag sideways to spin it, tap to flip.
 * The back carries the contact links. Vertical swipes still scroll the page.
 */
export default function HeroCard() {
  const coinRef = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const drag = useRef<{ x: number; y: number; start: number; t: number; lastX: number; lastT: number; active: boolean; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [showingBack, setShowingBack] = useState(false);
  const [hinted, setHinted] = useState(false);

  const apply = (deg: number, animate: boolean) => {
    const el = coinRef.current;
    if (!el) return;
    el.style.transition = animate ? "transform 650ms cubic-bezier(.2,.8,.2,1)" : "none";
    el.style.transform = `rotateY(${deg}deg)`;
  };

  const settle = (target: number) => {
    angle.current = target;
    apply(target, true);
    setShowingBack(Math.abs(Math.round(target / 180)) % 2 === 1);
  };

  const flip = () => settle(Math.round(angle.current / 180) * 180 + 180);

  // A small nudge on first view so people see the card turns.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t1 = setTimeout(() => { if (!drag.current && angle.current === 0) apply(-28, true); }, 1400);
    const t2 = setTimeout(() => { if (!drag.current && angle.current === 0) apply(0, true); setHinted(true); }, 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    const now = performance.now();
    drag.current = { x: e.clientX, y: e.clientY, start: angle.current, t: now, lastX: e.clientX, lastT: now, active: false, moved: false };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.active) {
      // Decide the gesture: sideways spins the coin, vertical is left to the page scroll.
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) { drag.current = null; return; }
      d.active = true;
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    d.lastX = e.clientX;
    d.lastT = performance.now();
    angle.current = d.start + dx * DEG_PER_PX;
    apply(angle.current, false);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.active) return;
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 0);
    const dt = Math.max(1, performance.now() - d.lastT);
    const velocity = ((e.clientX - d.lastX) / dt) * DEG_PER_PX * 120; // a flick carries the spin further
    const projected = angle.current + velocity;
    let target = Math.round(projected / 180) * 180;
    // Any deliberate swipe turns the card at least once.
    if (target === Math.round(d.start / 180) * 180 && Math.abs(angle.current - d.start) > 25) {
      target += angle.current > d.start ? 180 : -180;
    }
    settle(target);
  }

  function onClickCapture(e: React.MouseEvent) {
    if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); }
  }

  return (
    <div className="mx-auto flex w-full max-w-[20rem] flex-col items-center">
      <div
        className="coin-scene relative aspect-square w-[min(15rem,62vw)] select-none sm:w-[17rem] lg:w-[20rem]"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current = null; settle(Math.round(angle.current / 180) * 180); }}
        onClickCapture={onClickCapture}
      >
        <div aria-hidden className="absolute inset-[-14%] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.18),transparent)]" />
        <div ref={coinRef} className="coin relative h-full w-full">
          {/* Front */}
          <button
            type="button"
            onClick={flip}
            inert={showingBack}
            aria-label="Flip the card for contact links"
            className="coin-face absolute inset-0 overflow-hidden rounded-full bg-surface shadow-[0_0_0_2px_rgba(56,189,248,0.45),0_30px_70px_-30px_rgba(0,0,0,0.95)]"
            style={{ transform: "translateZ(1px)" }}
          >
            <Image
              src="/adhil-portrait.jpg"
              alt="Portrait of Adhil Shanif"
              fill
              priority
              draggable={false}
              sizes="(max-width: 640px) 62vw, 320px"
              className="pointer-events-none rounded-full object-cover object-[50%_22%]"
            />
            <span aria-hidden className="absolute inset-0 rounded-full shadow-[inset_0_0_0_6px_rgba(5,7,10,0.35),inset_0_-60px_80px_-40px_rgba(5,7,10,0.7)]" />
          </button>

          {/* Back */}
          <div
            inert={!showingBack}
            className="coin-face absolute inset-0 flex flex-col items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#13293a,#070d14_70%)] px-6 text-center text-white shadow-[0_0_0_2px_rgba(56,189,248,0.45)]"
            style={{ transform: "rotateY(180deg) translateZ(1px)" }}
          >
            <p className="font-mono text-[11px] tracking-[0.2em] text-sky-300 uppercase">Get in touch</p>
            <p className="mt-1.5 text-lg font-semibold tracking-tight">Adhil Shanif</p>
            <p className="mt-0.5 text-xs text-white/60">Replies within 24 hours</p>
            <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2.5">
              <a href={`mailto:${EMAIL}`} className={iconLink} aria-label="Email" title="Email"><Mail size={17} aria-hidden /></a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="LinkedIn" title="LinkedIn"><LinkedinIcon size={17} /></a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="WhatsApp" title="WhatsApp"><WhatsappIcon size={17} /></a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="GitHub" title="GitHub"><GithubIcon size={17} /></a>
            </div>
            <a href={UPWORK_URL} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center text-xs text-sky-300 underline-offset-4 hover:underline">
              Top Rated on Upwork
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg font-semibold tracking-tight text-foreground">Adhil Shanif</p>
        <p className="mt-0.5 text-sm text-muted">Software delivery partner · Dubai</p>
        <p className={`mt-3 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-opacity duration-500 ${hinted ? "opacity-100" : "opacity-70"}`}>
          <MoveHorizontal size={13} aria-hidden /> Swipe or tap to flip
        </p>
      </div>
    </div>
  );
}
