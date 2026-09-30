"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  attachmentError,
  BRIEF_FIELD_ORDER,
  BUDGET_OPTIONS,
  type BriefFieldName,
  parseBriefFields,
  TIMELINE_OPTIONS,
} from "@/lib/brief";
import { EMAIL } from "@/lib/site";

function controlClass(invalid: boolean, extra = ""): string {
  return `mt-2 w-full min-h-11 rounded-lg border ${invalid ? "border-accent" : "border-border"} bg-background px-4 py-3 text-base text-foreground${extra ? ` ${extra}` : ""}`;
}

function labelClass(invalid: boolean): string {
  return `text-sm font-medium ${invalid ? "text-foreground" : "text-muted"}`;
}

function readBrief(data: FormData) {
  const text = (key: string) => {
    const value = data.get(key);
    return typeof value === "string" ? value : "";
  };
  return {
    name: text("name"),
    email: text("email"),
    company: text("company"),
    project: text("project"),
    timeline: text("timeline"),
    budget: text("budget"),
    hpField: text("hp_field"),
  };
}

function invalidBrief(data: FormData): { error: string; fields: BriefFieldName[] } | null {
  const parsed = parseBriefFields(readBrief(data));
  const file = data.get("attachment");
  const fileProblem = file instanceof File ? attachmentError(file) : null;
  if (parsed.ok && !fileProblem) return null;
  return {
    error: [parsed.ok ? "" : parsed.error, fileProblem ?? ""].filter(Boolean).join(" "),
    fields: parsed.ok ? [] : parsed.fields,
  };
}

export default function BriefForm() {
  const [error, setError] = useState("");
  const [invalidFields, setInvalidFields] = useState<BriefFieldName[]>([]);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");
  const [errorTick, setErrorTick] = useState(0);
  const attachmentRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!errorTick) return;
    errorRef.current?.focus();
  }, [errorTick]);

  function showInvalid(next: { error: string; fields: BriefFieldName[] }) {
    setInvalidFields(next.fields);
    setError(next.error);
    setErrorTick((tick) => tick + 1);
  }

  function refreshAfterAttempt(form: HTMLFormElement) {
    if (!attempted) return;
    const failure = invalidBrief(new FormData(form));
    if (!failure) {
      setInvalidFields([]);
      setError("");
      return;
    }
    setInvalidFields(failure.fields);
    setError(failure.error);
  }

  function onAttachmentChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setAttachmentName(file?.name ?? "");
    if (attempted && event.currentTarget.form) {
      refreshAfterAttempt(event.currentTarget.form);
      return;
    }
    if (file && file.size > 4 * 1024 * 1024) {
      setError("The file must be 4 MB or smaller.");
      return;
    }
    setError((current) => (current === "The file must be 4 MB or smaller." ? "" : current));
  }

  function clearAttachment() {
    if (attachmentRef.current) attachmentRef.current.value = "";
    setAttachmentName("");
    const form = attachmentRef.current?.form;
    if (attempted && form) {
      refreshAfterAttempt(form);
      return;
    }
    setError((current) => (current === "The file must be 4 MB or smaller." ? "" : current));
  }

  function onFieldChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const form = event.currentTarget.form;
    if (form) refreshAfterAttempt(form);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const form = event.currentTarget;
    const failure = invalidBrief(new FormData(form));
    if (failure) {
      showInvalid(failure);
      return;
    }

    setInvalidFields([]);
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/brief", { method: "POST", body: new FormData(form) });
      const payload = (await response.json()) as { ok?: boolean; error?: string; fields?: BriefFieldName[] };
      if (!response.ok || !payload.ok) {
        const fields = (payload.fields ?? []).filter((field): field is BriefFieldName =>
          (BRIEF_FIELD_ORDER as readonly string[]).includes(field),
        );
        showInvalid({
          error: payload.error || `The brief could not be sent. Email ${EMAIL} instead.`,
          fields,
        });
        return;
      }
      setSent(true);
      form.reset();
      setAttachmentName("");
      setAttempted(false);
    } catch {
      showInvalid({ error: `The brief could not be sent. Email ${EMAIL} instead.`, fields: [] });
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <p className="mt-10 rounded-lg border border-border px-5 py-4 text-base leading-relaxed text-foreground">
        Thanks. I&apos;ll reply by email within 24 hours.
      </p>
    );
  }

  return (
    <form method="post" action="/api/brief" onSubmit={onSubmit} className="relative mt-10 space-y-6" noValidate>
      <div className="pointer-events-none absolute -left-[10000px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="hp_field">Leave this empty</label>
        <input id="hp_field" name="hp_field" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className={labelClass(invalidFields.includes("name"))}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          aria-invalid={invalidFields.includes("name") || undefined}
          aria-describedby={invalidFields.includes("name") ? "brief-error" : undefined}
          onChange={onFieldChange}
          className={controlClass(invalidFields.includes("name"))}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass(invalidFields.includes("email"))}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={invalidFields.includes("email") || undefined}
          aria-describedby={invalidFields.includes("email") ? "brief-error" : undefined}
          onChange={onFieldChange}
          className={controlClass(invalidFields.includes("email"))}
        />
      </div>

      <div>
        <label htmlFor="company" className={labelClass(invalidFields.includes("company"))}>
          Company <span className="font-normal">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          aria-invalid={invalidFields.includes("company") || undefined}
          aria-describedby={invalidFields.includes("company") ? "brief-error" : undefined}
          onChange={onFieldChange}
          className={controlClass(invalidFields.includes("company"))}
        />
      </div>

      <div>
        <label htmlFor="project" className={labelClass(invalidFields.includes("project"))}>
          What you need built
        </label>
        <textarea
          id="project"
          name="project"
          required
          rows={6}
          aria-invalid={invalidFields.includes("project") || undefined}
          aria-describedby={invalidFields.includes("project") ? "brief-error" : undefined}
          onChange={onFieldChange}
          className={controlClass(invalidFields.includes("project"), "min-h-36")}
        />
      </div>

      <div>
        <label htmlFor="timeline" className={labelClass(invalidFields.includes("timeline"))}>
          Timeline
        </label>
        <select
          id="timeline"
          name="timeline"
          required
          defaultValue=""
          aria-invalid={invalidFields.includes("timeline") || undefined}
          aria-describedby={invalidFields.includes("timeline") ? "brief-error" : undefined}
          onChange={onFieldChange}
          className={controlClass(invalidFields.includes("timeline"))}
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
        <label htmlFor="budget" className={labelClass(invalidFields.includes("budget"))}>
          Budget range
        </label>
        <select
          id="budget"
          name="budget"
          required
          defaultValue=""
          aria-invalid={invalidFields.includes("budget") || undefined}
          aria-describedby={invalidFields.includes("budget") ? "brief-error" : undefined}
          onChange={onFieldChange}
          className={controlClass(invalidFields.includes("budget"))}
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
        <div className="mt-2 flex w-full min-w-0 items-stretch gap-2">
          <label
            htmlFor="attachment"
            className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 text-base text-foreground transition-colors duration-150 hover:border-foreground/25"
          >
            <span className="shrink-0 font-medium">Choose file</span>
            <span className="min-w-0 truncate text-muted" title={attachmentName || undefined}>
              {attachmentName || "No file selected"}
            </span>
          </label>
          {attachmentName ? (
            <button
              type="button"
              onClick={clearAttachment}
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors duration-150 hover:border-foreground/25"
            >
              Remove
            </button>
          ) : null}
        </div>
        <input
          ref={attachmentRef}
          id="attachment"
          name="attachment"
          type="file"
          accept=".pdf,.docx,.png,.jpg,.jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
          aria-labelledby="attachment-label"
          onChange={onAttachmentChange}
          className="sr-only"
        />
        <p className="mt-2 text-sm leading-relaxed text-muted">PDF, DOCX, PNG, or JPG. 4 MB max.</p>
      </div>

      {error && (
        <p
          ref={errorRef}
          id="brief-error"
          role="alert"
          tabIndex={-1}
          className="rounded-lg border border-accent px-4 py-3 text-base font-medium leading-relaxed text-foreground"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        aria-describedby={error ? "brief-error" : undefined}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-5 text-base font-medium text-background transition-colors duration-150 hover:bg-accent-hover disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : "Send brief"}
      </button>
    </form>
  );
}
