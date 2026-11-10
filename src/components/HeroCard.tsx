"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Mail, RotateCcw } from "lucide-react";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, ROLE, UPWORK_URL, WHATSAPP_URL } from "@/lib/site";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "./ui";

const iconLink =
  "flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-150 hover:border-foreground/40 hover:bg-foreground/5 active:bg-foreground/10";

/** Portrait card that leans toward the pointer and turns over to show contact links. */
export default function HeroCard() {
  const [flipped, setFlipped] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const flipBackRef = useRef<HTMLButtonElement>(null);
  const frontRef = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    (flipped ? flipBackRef : frontRef).current?.focus({ preventScroll: true });
  }, [flipped]);

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const el = sceneRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - 0.5;
    const y = (event.clientY - r.top) / r.height - 0.5;
    el.dataset.moving = "true";
    el.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
  }

  function onLeave() {
    const el = sceneRef.current;
    if (!el) return;
    el.dataset.moving = "false";
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  }

  return (
    <div ref={sceneRef} className="tilt mx-auto w-full max-w-[22rem]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="tilt-inner">
        <div className="flip aspect-[4/5]" data-flipped={flipped}>
          {/* Front */}
          <button
            ref={frontRef}
            type="button"
            onClick={() => setFlipped(true)}
            inert={flipped}
            aria-label="Turn the card over for contact links"
            className="face absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 bg-surface text-left shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]"
          >
            <Image
              src="/adhil-portrait.jpg"
              alt="Portrait of Adhil Shanif"
              fill
              priority
              sizes="(max-width: 640px) 80vw, 352px"
              className="object-cover object-top"
            />
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#05070a] via-[#05070a]/70 to-transparent" aria-hidden />
            <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
              <span>
                <span className="block text-xl font-semibold tracking-tight text-white">Adhil Shanif</span>
                <span className="mt-0.5 block text-sm text-white/70">Software engineer · Dubai</span>
              </span>
              <span className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 text-xs text-white/85">
                <RotateCcw size={13} aria-hidden /> Contact
              </span>
            </span>
          </button>

          {/* Back */}
          <div
            inert={!flipped}
            className="face face-back flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-surface p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]"
          >
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">Get in touch</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">Adhil Shanif</p>
              <p className="mt-1 text-sm text-muted">{ROLE}, Dubai</p>
              <p className="mt-5 text-pretty text-base leading-relaxed text-muted">
                Agencies, founders and businesses. I reply by email within 24 hours.
              </p>
            </div>
            <div>
              <div className="grid grid-cols-4 gap-3">
                <a href={`mailto:${EMAIL}`} className={iconLink} aria-label="Email" title="Email"><Mail size={18} aria-hidden /></a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="LinkedIn" title="LinkedIn"><LinkedinIcon /></a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="WhatsApp" title="WhatsApp"><WhatsappIcon /></a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="GitHub" title="GitHub"><GithubIcon /></a>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                <a href={UPWORK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-accent underline-offset-4 hover:underline">
                  Top Rated on Upwork
                </a>
                <button
                  ref={flipBackRef}
                  type="button"
                  onClick={() => setFlipped(false)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm text-muted hover:text-foreground"
                >
                  <RotateCcw size={14} aria-hidden /> Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
