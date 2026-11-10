"use client";

import { useRef, useState } from "react";

const DEG_PER_PX = 0.5;

/**
 * Card flipping by hand: drag or swipe sideways to turn the card any number of times,
 * flick to carry the spin, tap to flip. Vertical swipes are left to page scrolling.
 * Spread `handlers` on the element that receives the gesture and put `innerRef` on the rotating element.
 */
export function useSwipeFlip({ tapToFlip = true }: { tapToFlip?: boolean } = {}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const drag = useRef<{ x: number; y: number; start: number; lastX: number; lastT: number; active: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [back, setBack] = useState(false);

  const turnTo = (deg: number, animate: boolean) => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transition = animate ? "transform 650ms cubic-bezier(.2,.8,.2,1)" : "none";
    el.style.transform = `rotateY(${deg}deg)`;
  };

  const settle = (target: number) => {
    angle.current = target;
    turnTo(target, true);
    setBack(Math.abs(Math.round(target / 180)) % 2 === 1);
  };

  const flip = () => settle(Math.round(angle.current / 180) * 180 + 180);

  const handlers = {
    onPointerDown(e: React.PointerEvent<HTMLElement>) {
      if (e.button !== 0) return;
      const now = performance.now();
      drag.current = { x: e.clientX, y: e.clientY, start: angle.current, lastX: e.clientX, lastT: now, active: false };
    },
    onPointerMove(e: React.PointerEvent<HTMLElement>) {
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
    },
    onPointerUp(e: React.PointerEvent<HTMLElement>) {
      const d = drag.current;
      drag.current = null;
      if (!d) return;
      if (!d.active) {
        // A tap: links and buttons keep their own behaviour, anywhere else turns the card.
        if (tapToFlip && !(e.target as Element).closest("a,button")) flip();
        return;
      }
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
      const dt = Math.max(1, performance.now() - d.lastT);
      const projected = angle.current + ((e.clientX - d.lastX) / dt) * DEG_PER_PX * 120;
      let target = Math.round(projected / 180) * 180;
      if (target === Math.round(d.start / 180) * 180 && Math.abs(angle.current - d.start) > 25) {
        target += angle.current > d.start ? 180 : -180;
      }
      settle(target);
    },
    onPointerCancel() {
      drag.current = null;
      settle(Math.round(angle.current / 180) * 180);
    },
    onClickCapture(e: React.MouseEvent) {
      if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); }
    },
  };

  return { innerRef, back, flip, handlers };
}
