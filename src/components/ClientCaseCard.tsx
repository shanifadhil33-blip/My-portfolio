import type { ClientCaseStudy } from "@/data/clientWork";

export default function ClientCaseCard({ study }: { study: ClientCaseStudy }) {
  return (
    <article
      id={`client-case-${study.id}`}
      aria-labelledby={`client-case-${study.id}-title`}
      className="project-card client-case-card flex h-full min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-[var(--card-shadow)]"
    >
      <div className="client-case-body project-card-body flex min-w-0 flex-grow flex-col p-5 sm:p-6">
        <header>
          <p className="text-sm text-muted">{study.client}</p>
          <h3
            id={`client-case-${study.id}-title`}
            className="mt-2 text-balance text-lg font-medium text-foreground"
          >
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
        </div>
      </div>
    </article>
  );
}
