"use client";

import { FormEvent, useState } from "react";
import { BUDGET_OPTIONS, TIMELINE_OPTIONS } from "@/lib/brief";
import { EMAIL } from "@/lib/site";

const fieldClass =
  "mt-2 w-full min-h-11 rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground";

export default function BriefForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("attachment");
    if (file instanceof File && file.size > 4 * 1024 * 1024) {
      setError("The file must be 4 MB or smaller.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/brief", { method: "POST", body: data });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error || `The brief could not be sent. Email ${EMAIL} instead.`);
        return;
      }
      setSent(true);
      form.reset();
    } catch {
      setError(`The brief could not be sent. Email ${EMAIL} instead.`);
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <p className="mt-10 rounded-lg border border-border px-5 py-4 text-base leading-relaxed text-foreground">
        Thanks. I&apos;ll reply in writing within 24 hours.
      </p>
    );
  }

  return (
    <form method="post" action="/api/brief" onSubmit={onSubmit} className="relative mt-10 space-y-6" noValidate>
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="hp_field">Leave this empty</label>
        <input id="hp_field" name="hp_field" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="text-sm font-medium text-muted">
          Name
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className={fieldClass} />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-muted">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} />
      </div>

      <div>
        <label htmlFor="company" className="text-sm font-medium text-muted">
          Company <span className="font-normal">(optional)</span>
        </label>
        <input id="company" name="company" type="text" autoComplete="organization" className={fieldClass} />
      </div>

      <div>
        <label htmlFor="project" className="text-sm font-medium text-muted">
          What you need built
        </label>
        <textarea id="project" name="project" required rows={6} className={`${fieldClass} min-h-36`} />
      </div>

      <div>
        <label htmlFor="timeline" className="text-sm font-medium text-muted">
          Timeline
        </label>
        <select id="timeline" name="timeline" required defaultValue="" className={fieldClass}>
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
        <label htmlFor="budget" className="text-sm font-medium text-muted">
          Budget range
        </label>
        <select id="budget" name="budget" required defaultValue="" className={fieldClass}>
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
        <label htmlFor="attachment" className="text-sm font-medium text-muted">
          Attachment <span className="font-normal">(optional)</span>
        </label>
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept=".pdf,.docx,.png,.jpg,.jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
          className={`${fieldClass} file:mr-3 file:rounded-md file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground`}
        />
        <p className="mt-2 text-sm leading-relaxed text-muted">PDF, DOCX, PNG, or JPG. 4 MB max.</p>
      </div>

      {error && (
        <p role="alert" className="text-base leading-relaxed text-foreground">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-5 text-base font-medium text-background transition-colors duration-150 hover:bg-accent-hover disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : "Send brief"}
      </button>
    </form>
  );
}
