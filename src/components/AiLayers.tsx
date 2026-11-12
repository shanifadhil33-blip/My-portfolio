"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BrainDiagram, GuardrailsDiagram, RunsDiagram, SystemsDiagram, TeammatesDiagram } from "./AiDiagrams";

const steps = [
  { id: "brain", name: "Brain", title: "One shared company brain", line: "Policies, prices, and the notes each agent keeps.", ms: 4200 },
  { id: "teammates", name: "Teammates", title: "Agents that own the job", line: "A coordinator sends the work to the right agent.", ms: 5600 },
  { id: "systems", name: "Systems", title: "Work in the real tools", line: "Email, the CRM, accounting, and the company files.", ms: 4600 },
  { id: "guardrails", name: "Guardrails", title: "Routine work just runs", line: "A discount above the limit waits for a person.", ms: 7000 },
  { id: "runs", name: "Where it runs", title: "Cloud, or your server", line: "The data can stay inside the company.", ms: 3600 },
] as const;

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function reducedNow() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Diagram({ id, playing, settle = false, onHold }: { id: (typeof steps)[number]["id"]; playing: boolean; settle?: boolean; onHold?: (held: boolean) => void }) {
  if (id === "brain") return <BrainDiagram playing={playing} settle={settle} />;
  if (id === "teammates") return <TeammatesDiagram playing={playing} settle={settle} />;
  if (id === "systems") return <SystemsDiagram playing={playing} settle={settle} />;
  if (id === "guardrails") return <GuardrailsDiagram playing={playing} settle={settle} onHold={onHold} />;
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
  const [playId, setPlayId] = useState(0);
  const [touring, setTouring] = useState(false);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const startedAt = useRef(0);
  const pausedAt = useRef(0);
  const armed = useRef(false);
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const stage = document.getElementById("aid-stage");
    if (!stage || reduce) return;
    const seen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || armed.current) return;
      armed.current = true;
      startedAt.current = 0;
      setTouring(true);
      setPlayId((value) => value + 1);
    }, { threshold: 0.35 });
    seen.observe(stage);
    return () => seen.disconnect();
  }, [reduce]);

  useEffect(() => {
    if (reduce || !touring || paused || held || index >= steps.length - 1) return;
    if (!startedAt.current) startedAt.current = Date.now();
    const wait = Math.max(0, steps[index].ms - (Date.now() - startedAt.current));
    const timer = window.setTimeout(() => {
      startedAt.current = 0;
      setIndex((value) => value + 1);
      setPlayId((value) => value + 1);
      if (index >= steps.length - 2) setTouring(false);
    }, wait);
    return () => clearTimeout(timer);
  }, [reduce, touring, paused, held, index, playId]);

  function stageAnims(pause: boolean) {
  const root = document.getElementById("aid-stage");
  if (!root) return;
  root.getAnimations({ subtree: true }).forEach((anim) => (pause ? anim.pause() : anim.play()));
}

function choose(next: number) {
    const last = steps.length - 1;
    const safe = next < 0 ? last : next > last ? 0 : next;
    startedAt.current = 0;
    setTouring(false);
    setPaused(false);
    setHeld(false);
    setIndex(safe);
    setPlayId((value) => value + 1);
  }

  function toggleTour() {
    if (!touring || index >= steps.length - 1) {
      startedAt.current = 0;
      setPaused(false);
      setHeld(false);
      setIndex(0);
      setTouring(true);
      setPlayId((value) => value + 1);
      return;
    }
    if (paused) {
      startedAt.current += Date.now() - pausedAt.current;
      setPaused(false);
      stageAnims(false);
      return;
    }
    pausedAt.current = Date.now();
    setPaused(true);
    stageAnims(true);
  }

  const active = steps[index];
  const playing = !reduce && playId > 0;

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
    <div className="mt-16 md:mt-24">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-1" role="tablist" aria-label="AI team tour">
          {steps.map((step, stepIndex) => {
            const selected = stepIndex === index;
            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                id={`aid-tab-${step.id}`}
                aria-selected={selected}
                aria-label={step.name}
                aria-controls="aid-stage"
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(stepIndex)}
                onKeyDown={(event) => {
                  const last = steps.length - 1;
                  let next = stepIndex;
                  if (event.key === "ArrowRight" || event.key === "ArrowDown") next = stepIndex === last ? 0 : stepIndex + 1;
                  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = stepIndex === 0 ? last : stepIndex - 1;
                  else return;
                  event.preventDefault();
                  choose(next);
                  document.getElementById(`aid-tab-${steps[next].id}`)?.focus();
                }}
                className="inline-flex h-11 w-11 items-center justify-center"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${selected ? "bg-foreground" : "bg-foreground/25"}`} />
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-6">
          <button type="button" onClick={toggleTour} className="min-h-11 text-base font-medium text-muted">
            {touring && !paused ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={() => choose(index + 1)} className="min-h-11 text-base font-medium text-foreground">
            Next
          </button>
        </div>
      </div>

      <div
        id="aid-stage"
        role="tabpanel"
        aria-labelledby={`aid-tab-${active.id}`}
        className="mt-10"
        onPointerDown={(event) => {
          if (event.pointerType !== "touch") return;
          drag.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = drag.current;
          drag.current = null;
          if (!start || event.pointerType !== "touch") return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
          choose(index + (dx < 0 ? 1 : -1));
        }}
      >
        <StepCopy title={active.title} line={active.line} />
        <div className="mt-10">
          <Diagram key={`${active.id}-${playId}`} id={active.id} playing={playing} onHold={(next) => {
            if (next) {
              pausedAt.current = Date.now();
              setHeld(true);
            } else {
              startedAt.current += Date.now() - pausedAt.current;
              setHeld(false);
            }
          }} />
        </div>
      </div>
    </div>
  );
}
