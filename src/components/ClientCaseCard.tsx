"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ClientCaseSection, ClientCaseStudy } from "@/data/clientWork";

function toggleName(open: boolean, title: string): string {
  return open ? `Show less, ${title}` : `See the full project, ${title}`;
}

function CaseSections({ sections }: { sections: ClientCaseSection[] }) {
  return (
    <>
      {sections.map((section, index) => (
        <div key={section.label} className={index === 0 ? undefined : "mt-4"}>
          <h4 className="mb-2 text-sm font-medium text-muted">{section.label}</h4>
          {section.paragraphs?.map((paragraph, paragraphIndex) => (
            <p
              key={paragraph}
              className={`text-pretty text-sm leading-relaxed text-foreground${paragraphIndex === 0 ? "" : " mt-2"}`}
            >
              {paragraph}
            </p>
          ))}
          {section.bullets && (
            <ul className="list-disc space-y-2 pl-4">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="text-pretty text-sm leading-relaxed text-foreground">
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

export default function ClientCaseCard({ study }: { study: ClientCaseStudy }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const titleId = `client-case-${study.id}-title`;
  const panelId = `client-case-${study.id}-detail`;
  const name = toggleName(open, study.title);

  const collapse = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <article
      id={`client-case-${study.id}`}
      aria-labelledby={titleId}
      data-open={open ? "true" : "false"}
      className="project-card client-case-card flex h-auto min-w-0 w-full max-w-full flex-col self-start overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-[var(--card-shadow)]"
    >
      <div className="relative min-w-0">
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
          <h4 className="mt-4 mb-2 text-sm font-medium text-muted">Highlights</h4>
          <ul className="space-y-3">
            {study.highlights.map((text) => (
              <li key={text} className="text-pretty text-sm leading-relaxed text-foreground">
                {text}
              </li>
            ))}
          </ul>
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
          <div className="mt-auto pt-5">
            <p className="client-case-relationship border-t border-border pt-4 text-pretty text-sm leading-relaxed text-foreground">
              {study.relationship}
            </p>
            <p className="client-case-action mt-4 flex min-h-11 items-center gap-2 text-sm font-medium text-accent" aria-hidden="true">
              <ChevronDown className="client-case-chevron shrink-0" size={16} aria-hidden />
              <span className="min-w-0">{open ? "Show less" : "See the full project"}</span>
            </p>
          </div>
        </div>
        <button
          ref={toggleRef}
          type="button"
          className="client-case-toggle absolute inset-0 z-10"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={name}
          onClick={() => setOpen((value) => !value)}
        />
      </div>
      <div id={panelId} className="client-case-reveal" data-open={open ? "true" : "false"}>
        <div className="client-case-reveal-inner" inert={!open} aria-hidden={open ? undefined : true}>
          <div className="client-case-detail">
            <div className="border-t border-border pt-4">
              <CaseSections sections={study.sections} />
              <button
                type="button"
                className="client-case-show-less mt-4 inline-flex min-h-11 w-full items-center justify-start gap-2 text-left text-sm font-medium text-accent"
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={name}
                onClick={collapse}
              >
                <ChevronDown className="shrink-0 rotate-180" size={16} aria-hidden />
                Show less
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
