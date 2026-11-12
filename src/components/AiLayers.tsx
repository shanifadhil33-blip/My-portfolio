"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import { GuardrailsDiagram, RunsDiagram, SystemsDiagram, TeammatesDiagram } from "./AiDiagrams";

const steps = [
  { id: "brain", name: "Explained", title: "Forward deployed engineering, explained", line: "How an AI team joins a business and does real work, in about a minute." },
  { id: "teammates", name: "Teammates", title: "Agents that own the job", line: "A coordinator sends the work to the right agent." },
  { id: "systems", name: "Systems", title: "Work in the real tools", line: "Email, the CRM, accounting, and the company files." },
  { id: "guardrails", name: "Guardrails", title: "Routine work just runs", line: "A discount above the limit waits for a person." },
  { id: "runs", name: "Where it runs", title: "Cloud, or your server", line: "The data can stay inside the company." },
] as const;

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function reducedNow() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Explainer() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dbe2ea] bg-white shadow-[0_18px_40px_-28px_rgba(15,30,50,0.28)]">
      <video
        className="aspect-video w-full bg-[#F8F1E7]"
        controls
        playsInline
        preload="metadata"
        poster="/ai-team/forward-deployed-poster.png"
        width={1920}
        height={1080}
        aria-label="Forward deployed engineering, explained"
      >
        <source src="/ai-team/forward-deployed.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

function Diagram({ id, playing, settle = false }: { id: (typeof steps)[number]["id"]; playing: boolean; settle?: boolean }) {
  if (id === "brain") return <Explainer />;
  if (id === "teammates") return <TeammatesDiagram playing={playing} settle={settle} />;
  if (id === "systems") return <SystemsDiagram playing={playing} settle={settle} />;
  if (id === "guardrails") return <GuardrailsDiagram playing={playing} settle={settle} />;
  return <RunsDiagram playing={playing} settle={settle} />;
}

function StepCopy({ title, line }: { title: string; line: string }) {
  return (
    <div>
      <h3 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h3>
      <p className="mt-3 max-w-xl text-pretty text-lg leading-relaxed text-muted">{line}</p>
    </div>
  );
}

export default function AiLayers() {
  const reduce = useSyncExternalStore(subscribe, reducedNow, () => true);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scrollLeft: number; index: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  // Size the track to its current slide, including expanding teammate profiles.
  useEffect(() => {
    const track = trackRef.current;
    const slide = track?.children[index];
    if (!track || !(slide instanceof HTMLElement)) return;
    const resize = new ResizeObserver(() => {
      track.style.height = `${slide.getBoundingClientRect().height + 16}px`;
    });
    resize.observe(slide);
    return () => resize.disconnect();
  }, [index, reduce]);

  useEffect(() => {
    if (index !== 0) trackRef.current?.querySelector("video")?.pause();
  }, [index]);

  function nearestSlide(track: HTMLDivElement) {
    const first = (track.children[0] as HTMLElement).offsetLeft;
    return Array.from(track.children).reduce((nearest, slide, slideIndex) => {
      const distance = Math.abs((slide as HTMLElement).offsetLeft - first - track.scrollLeft);
      const previous = Math.abs((track.children[nearest] as HTMLElement).offsetLeft - first - track.scrollLeft);
      return distance < previous ? slideIndex : nearest;
    }, 0);
  }

  function choose(next: number) {
    const track = trackRef.current;
    if (!track) return;
    const safe = Math.max(0, Math.min(steps.length - 1, next));
    const slide = track.children[safe] as HTMLElement;
    const first = track.children[0] as HTMLElement;
    track.scrollTo({ left: slide.offsetLeft - first.offsetLeft, behavior: reduce ? "instant" : "smooth" });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const dot = target.closest<HTMLButtonElement>("[data-carousel-dot]");
    // Leave video seeking and controls inside diagrams to their native handlers.
    if (target !== trackRef.current && !dot) return;
    let next = dot ? Number(dot.dataset.carouselDot) : index;
    if (event.key === "ArrowRight") next += 1;
    else if (event.key === "ArrowLeft") next -= 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = steps.length - 1;
    else return;
    event.preventDefault();
    next = Math.max(0, Math.min(steps.length - 1, next));
    choose(next);
    if (dot) document.getElementById(`aid-dot-${steps[next].id}`)?.focus({ preventScroll: true });
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start) return;
    drag.current = null;
    const track = event.currentTarget;
    const distance = track.scrollLeft - start.scrollLeft;
    let next = nearestSlide(track);
    if (next === start.index && Math.abs(distance) > 40) next += Math.sign(distance);
    track.style.scrollSnapType = "";
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (!start.moved) return;
    suppressClick.current = true;
    choose(next);
  }

  if (reduce) {
    return (
      <ol className="m-0 mt-16 list-none space-y-20 p-0 md:mt-24">
        {steps.map((step) => (
          <li key={step.id}>
            <StepCopy title={step.title} line={step.line} />
            <div className="mt-8">
              <Diagram id={step.id} playing={false} settle />
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="AI team tour"
      className="mt-16 md:mt-24"
      onKeyDown={onKeyDown}
    >
      <p id="aid-instructions" className="sr-only">Swipe or use the left and right arrow keys to change slides.</p>
      <div
        ref={trackRef}
        id="aid-stage"
        role="group"
        aria-label={`${steps[index].name}, slide ${index + 1} of ${steps.length}`}
        aria-describedby="aid-instructions"
        tabIndex={0}
        className="relative flex snap-x snap-mandatory items-start gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain py-2 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6 sm:pr-0"
        onScroll={(event) => {
          if (!drag.current) setIndex(nearestSlide(event.currentTarget));
        }}
        onPointerDown={(event) => {
          suppressClick.current = false;
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          if ((event.target as HTMLElement).closest("video, button, a, input, select, textarea")) return;
          const track = event.currentTarget;
          drag.current = { x: event.clientX, scrollLeft: track.scrollLeft, index, moved: false };
          track.setPointerCapture(event.pointerId);
          track.focus({ preventScroll: true });
          event.preventDefault();
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          if (!start) return;
          const distance = event.clientX - start.x;
          if (!start.moved && Math.abs(distance) < 6) return;
          start.moved = true;
          event.currentTarget.style.scrollSnapType = "none";
          event.currentTarget.scrollLeft = start.scrollLeft - distance;
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onClickCapture={(event) => {
          if (!suppressClick.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }}
      >
        {steps.map((step, stepIndex) => (
          <div
            key={step.id}
            id={`aid-slide-${step.id}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${stepIndex + 1} of ${steps.length}: ${step.name}`}
            inert={stepIndex !== index}
            className="min-w-0 shrink-0 basis-full snap-start"
          >
            <StepCopy title={step.title} line={step.line} />
            <div className="mt-8 sm:mt-10">
              <Diagram id={step.id} playing={stepIndex === index} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-1" role="group" aria-label="Choose a step">
        {steps.map((step, stepIndex) => (
          <button
            key={step.id}
            id={`aid-dot-${step.id}`}
            type="button"
            data-carousel-dot={stepIndex}
            aria-label={step.name}
            aria-controls={`aid-slide-${step.id}`}
            aria-current={stepIndex === index ? "step" : undefined}
            onClick={() => choose(stepIndex)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full"
          >
            <span className={`h-2.5 rounded-full transition-[width,background-color] motion-reduce:transition-none ${stepIndex === index ? "w-6 bg-foreground" : "w-2.5 bg-foreground/25"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
