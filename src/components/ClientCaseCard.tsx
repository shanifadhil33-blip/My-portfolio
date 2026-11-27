"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ClientCaseStudy } from "@/data/clientWork";
import ClientCasePanel from "./ClientCasePanel";

export default function ClientCaseCard({ study }: { study: ClientCaseStudy }) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const titleId = `client-case-${study.id}-title`;

  const openPanel = () => {
    setOrigin(toggleRef.current?.getBoundingClientRect() ?? null);
    setOpen(true);
  };

  const closePanel = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <article
      id={`client-case-${study.id}`}
      aria-labelledby={titleId}
      className="project-card client-case-card relative flex h-auto min-w-0 w-full max-w-full flex-col self-start overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-[var(--card-shadow)]"
    >
      <div className="client-case-body project-card-body flex min-w-0 flex-col p-5 sm:p-6">
        <header>
          <p className="text-sm text-muted">{study.client}</p>
          <h3 id={titleId} className="mt-2 text-balance text-lg font-medium text-foreground">
            {study.title}
          </h3>
        </header>
        <p className="client-case-summary mt-2 text-pretty text-base leading-relaxed text-muted">
          {study.summary}
        </p>
        <h4 className="mt-4 mb-2 text-sm font-medium text-muted">Stack</h4>
        <ul className="flex flex-wrap gap-1.5">
          {study.stack.map((text) => (
            <li
              key={text}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
            >
              {text}
            </li>
          ))}
        </ul>
        <p className="client-case-action mt-4 flex min-h-11 items-center gap-2 text-sm font-medium text-accent" aria-hidden="true">
          <ArrowUpRight className="shrink-0" size={16} aria-hidden />
          <span>Open</span>
        </p>
      </div>
      <button
        ref={toggleRef}
        type="button"
        className="client-case-toggle absolute inset-0 z-10"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Open ${study.title}`}
        onClick={openPanel}
      />
      {open ? <ClientCasePanel study={study} origin={origin} onClose={closePanel} /> : null}
    </article>
  );
}
