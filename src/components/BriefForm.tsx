"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  attachmentError,
  BUDGET_OPTIONS,
  type BriefFieldName,
  isBriefFieldName,
  parseBriefFields,
  TIMELINE_OPTIONS,
} from "@/lib/brief";
import { EMAIL } from "@/lib/site";

const fieldClass =
  "field mt-2 w-full min-h-11 rounded-lg border border-border bg-background py-3 text-base text-foreground";

const textFieldClass = `${fieldClass} px-4`;

const selectFieldClass = `${fieldClass} select-field cursor-pointer pl-4`;

const primaryButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-5 text-base font-medium text-background transition-colors duration-150 hover:bg-accent-hover active:bg-accent-pressed disabled:opacity-60 sm:w-auto";

function textFromForm(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}

function reviewForm(data: FormData): { error: string; fields: BriefFieldName[] } | null {
  const parsed = parseBriefFields({
    name: textFromForm(data, "name"),
    email: textFromForm(data, "email"),
    company: textFromForm(data, "company"),
    project: textFromForm(data, "project"),
    timeline: textFromForm(data, "timeline"),
    budget: textFromForm(data, "budget"),
    hpField: textFromForm(data, "hp_field"),
  });
  const file = data.get("attachment");
  const fileProblem = file instanceof File ? attachmentError(file) : null;
  if (parsed.ok && !fileProblem) return null;

  const error = [parsed.ok ? "" : parsed.error, fileProblem ?? ""].filter(Boolean).join(" ");
  return { error, fields: parsed.ok ? [] : parsed.fields };
}

function serverFields(value: unknown): BriefFieldName[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is BriefFieldName => typeof item === "string" && isBriefFieldName(item));
}

export default function BriefForm() {
  const [error, setError] = useState("");
  const [invalidFields, setInvalidFields] = useState<BriefFieldName[]>([]);
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");
  const [errorTick, setErrorTick] = useState(0);
  const attachmentRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (errorTick === 0) return;
    errorRef.current?.focus();
  }, [errorTick]);

  function showError(next: { error: string; fields: BriefFieldName[] }) {
    setInvalidFields(next.fields);
    setError(next.error);
    setErrorTick((current) => current + 1);
  }

  function syncError(form: HTMLFormElement) {
    if (!attempted) return;
    const problem = reviewForm(new FormData(form));
    if (!problem) {
      setInvalidFields([]);
      setError("");
      return;
    }
    setInvalidFields(problem.fields);
    setError(problem.error);
  }

  function onAttachmentChange(form: HTMLFormElement | null) {
    const file = attachmentRef.current?.files?.[0];
    setAttachmentName(file?.name ?? "");
    if (form) syncError(form);
  }

  function clearAttachment(form: HTMLFormElement | null) {
    if (attachmentRef.current) attachmentRef.current.value = "";
    setAttachmentName("");
    if (form) syncError(form);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const form = event.currentTarget;
    const problem = reviewForm(new FormData(form));
    if (problem) {
      showError(problem);
      return;
    }

    setInvalidFields([]);
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/brief", { method: "POST", body: new FormData(form) });
      const payload = (await response.json()) as { ok?: boolean; error?: string; fields?: unknown };
      if (!response.ok || !payload.ok) {
        showError({
          error: payload.error || `The brief could not be sent. Email ${EMAIL} instead.`,
          fields: serverFields(payload.fields),
        });
        return;
      }
      setSent(true);
      form.reset();
      setAttachmentName("");
      setAttempted(false);
    } catch {
      showError({
        error: `The brief could not be sent. Email ${EMAIL} instead.`,
        fields: [],
      });
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-1 items-center">
        <p className="w-full rounded-lg border border-border px-5 py-4 text-base leading-relaxed text-foreground">
          Thanks. I&apos;ll reply by email within 24 hours.
        </p>
      </div>
    );
  }

  const invalid = (field: BriefFieldName) => invalidFields.includes(field);

  return (
    <div className="mx-auto w-full max-w-xl">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center text-sm text-muted transition-colors duration-150 hover:text-foreground active:text-foreground"
      >
        Adhil Shanif
      </Link>
      <h1 className="mt-6 text-balance text-3xl font-medium tracking-tight text-foreground">
        Send a written brief
      </h1>
      <p className="mt-4 text-pretty text-base leading-relaxed text-muted">
        Tell me what you need built, your timeline and your budget. I reply by email within 24 hours.
      </p>

      <form
        method="post"
        action="/api/brief"
        onSubmit={onSubmit}
        onChange={(event) => syncError(event.currentTarget)}
        className="relative mt-10 space-y-6"
        noValidate
      >
        <div className="pointer-events-none absolute -left-[10000px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="hp_field">Leave this empty</label>
          <input id="hp_field" name="hp_field" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label htmlFor="name" className={`text-sm font-medium ${invalid("name") ? "text-foreground" : "text-muted"}`}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={invalid("name") || undefined}
            aria-describedby={invalid("name") ? "brief-error" : undefined}
            className={`${textFieldClass}${invalid("name") ? " is-invalid" : ""}`}
          />
        </div>

        <div>
          <label htmlFor="email" className={`text-sm font-medium ${invalid("email") ? "text-foreground" : "text-muted"}`}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={invalid("email") || undefined}
            aria-describedby={invalid("email") ? "brief-error" : undefined}
            className={`${textFieldClass}${invalid("email") ? " is-invalid" : ""}`}
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className={`text-sm font-medium ${invalid("company") ? "text-foreground" : "text-muted"}`}
          >
            Company <span className="font-normal">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            aria-invalid={invalid("company") || undefined}
            aria-describedby={invalid("company") ? "brief-error" : undefined}
            className={`${textFieldClass}${invalid("company") ? " is-invalid" : ""}`}
          />
        </div>

        <div>
          <label
            htmlFor="project"
            className={`text-sm font-medium ${invalid("project") ? "text-foreground" : "text-muted"}`}
          >
            What you need built
          </label>
          <textarea
            id="project"
            name="project"
            required
            rows={6}
            aria-invalid={invalid("project") || undefined}
            aria-describedby={invalid("project") ? "brief-error" : undefined}
            className={`${textFieldClass} min-h-36${invalid("project") ? " is-invalid" : ""}`}
          />
        </div>

        <div>
          <label
            htmlFor="timeline"
            className={`text-sm font-medium ${invalid("timeline") ? "text-foreground" : "text-muted"}`}
          >
            Timeline <span className="font-normal">(optional)</span>
          </label>
          <select
            id="timeline"
            name="timeline"
            defaultValue=""
            aria-invalid={invalid("timeline") || undefined}
            aria-describedby={invalid("timeline") ? "brief-error" : undefined}
            className={`${selectFieldClass}${invalid("timeline") ? " is-invalid" : ""}`}
          >
            <option value="" disabled>
              Select a timeline
            </option>
            {TIMELINE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="budget"
            className={`text-sm font-medium ${invalid("budget") ? "text-foreground" : "text-muted"}`}
          >
            Budget range <span className="font-normal">(optional)</span>
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            aria-invalid={invalid("budget") || undefined}
            aria-describedby={invalid("budget") ? "brief-error" : undefined}
            className={`${selectFieldClass}${invalid("budget") ? " is-invalid" : ""}`}
          >
            <option value="" disabled>
              Select a budget range
            </option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span id="attachment-label" className="text-sm font-medium text-muted">
            Attachment <span className="font-normal">(optional)</span>
          </span>
          <div className="relative mt-2 flex w-full min-w-0 items-stretch gap-2">
            <input
              ref={attachmentRef}
              id="attachment"
              name="attachment"
              type="file"
              accept=".pdf,.docx,.png,.jpg,.jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
              aria-labelledby="attachment-label"
              onChange={(event) => onAttachmentChange(event.currentTarget.form)}
              className="peer sr-only"
            />
            <label
              htmlFor="attachment"
              className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 text-base text-foreground transition-colors duration-150 hover:border-foreground/30 peer-focus-visible:border-foreground/35 active:border-foreground/40 active:bg-foreground/5"
            >
              <span className="shrink-0 font-medium">Choose file</span>
              <span className="min-w-0 truncate text-muted" title={attachmentName || undefined}>
                {attachmentName || "No file selected"}
              </span>
            </label>
            {attachmentName ? (
              <button
                type="button"
                onClick={(event) => clearAttachment(event.currentTarget.form)}
                className="inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors duration-150 hover:border-foreground/30 active:border-foreground/40 active:bg-foreground/5"
              >
                Remove
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">PDF, DOCX, PNG, or JPG. 4 MB max.</p>
        </div>

        {error ? (
          <p
            ref={errorRef}
            id="brief-error"
            role="alert"
            tabIndex={-1}
            className="rounded-lg border border-border px-5 py-4 text-base leading-relaxed text-foreground outline-none"
          >
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={pending} aria-describedby={error ? "brief-error" : undefined} className={primaryButtonClass}>
          {pending ? "Sending..." : "Send brief"}
        </button>
      </form>
    </div>
  );
}
