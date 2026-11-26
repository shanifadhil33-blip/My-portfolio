import { Check, Repeat2 } from "lucide-react";
import type { ClientCaseStudy } from "@/data/clientWork";

export default function ClientCaseCard({ study }: { study: ClientCaseStudy }) {
  return (
    <article
      id={`client-case-${study.id}`}
      aria-labelledby={`client-case-${study.id}-title`}
      className="project-card client-case-card flex h-full min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-[var(--card-shadow)]"
    >
      <div className="client-case-body flex min-w-0 flex-grow flex-col p-5 sm:p-6">
        <div>
          <p className="client-case-eyebrow flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-accent">
            <span
              aria-hidden="true"
              className="h-[6px] w-[6px] shrink-0 rounded-full bg-accent"
            />
            Client case study
          </p>
          <p className="mt-1 text-sm text-muted">{study.client}</p>
          <h3
            id={`client-case-${study.id}-title`}
            className="mt-3 text-lg font-medium text-foreground"
          >
            {study.title}
          </h3>
          <p className="mt-2 text-pretty text-base leading-relaxed text-muted">
            {study.summary}
          </p>
          <h4 className="mt-5 mb-2 text-sm font-medium text-muted">Highlights</h4>
          <ul className="space-y-2.5">
            {study.highlights.map((text) => (
              <li
                key={text}
                className="flex gap-2.5 text-pretty text-sm leading-relaxed text-foreground"
              >
                <Check
                  size={16}
                  strokeWidth={2.25}
                  aria-hidden="true"
                  className="mt-[3px] shrink-0 text-accent"
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <h4 className="mt-5 mb-2 text-sm font-medium text-muted">Stack</h4>
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
        </div>
        <div className="mt-auto pt-5">
          <p className="client-case-relationship flex gap-2.5 border-t border-border pt-4 text-pretty text-sm leading-relaxed text-foreground">
            <Repeat2
              size={16}
              aria-hidden="true"
              className="mt-[3px] shrink-0 text-accent"
            />
            <span>{study.relationship}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
