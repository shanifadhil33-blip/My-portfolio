"use client";

import { ChangeEvent, FormEvent, type KeyboardEvent as ReactKeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import BackHome from "@/components/BackHome";
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
  return `field mt-2 w-full min-h-11 rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground${invalid ? " is-invalid" : ""}${extra ? ` ${extra}` : ""}`;
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

function ChoiceField({
  id,
  name,
  label,
  optional,
  placeholder,
  options,
  invalid,
  describedBy,
  onPicked,
}: {
  id: string;
  name: string;
  label: string;
  optional?: boolean;
  placeholder: string;
  options: readonly string[];
  invalid: boolean;
  describedBy?: string;
  onPicked: (form: HTMLFormElement) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [dropUp, setDropUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById(id)?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && event.target instanceof Node && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const selected = rootRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    const firstOption = rootRef.current?.querySelector<HTMLElement>('[role="option"]');
    (selected ?? firstOption)?.focus();
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [id, open]);

  function toggle() {
    if (!open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      setDropUp(window.innerHeight - rect.bottom < 240 && rect.top > 240);
    }
    setOpen((current) => !current);
  }

  function pick(option: string) {
    setValue(option);
    if (hiddenRef.current) hiddenRef.current.value = option;
    setOpen(false);
    document.getElementById(id)?.focus();
    const form = rootRef.current?.closest("form");
    if (form) onPicked(form);
  }

  function onListKeyDown(event: ReactKeyboardEvent<HTMLUListElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const buttons = [...event.currentTarget.querySelectorAll("button")];
    const current = buttons.findIndex((button) => button === document.activeElement);
    const next = event.key === "ArrowDown" ? current + 1 : current - 1;
    buttons[Math.min(buttons.length - 1, Math.max(0, next))]?.focus();
  }

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className={labelClass(invalid)}>
        {label} {optional ? <span className="font-normal">(optional)</span> : null}
      </label>
      <input ref={hiddenRef} type="hidden" name={name} defaultValue="" />
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-describedby={describedBy}
        onClick={toggle}
        className={`mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border bg-background py-3 pr-2.5 pl-4 text-left text-base ${
          invalid ? "border-foreground/35" : "border-border"
        }`}
      >
        <span className={`min-w-0 truncate ${value ? "text-foreground" : "text-muted"}`}>
          {value || placeholder}
        </span>
        <svg width="8" height="5" viewBox="0 0 8 5" aria-hidden className="shrink-0">
          <path fill="currentColor" d="M0 0h8L4 5z" />
        </svg>
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          onKeyDown={onListKeyDown}
          className={`absolute right-0 left-0 z-30 max-h-60 overflow-auto rounded-lg border border-border bg-background py-1 ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.map((option) => {
            const selected = value === option;
            return (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => pick(option)}
                  className="flex min-h-11 w-full items-center justify-between gap-3 px-4 text-left text-base text-foreground active:bg-foreground/5"
                >
                  <span>{option}</span>
                  {selected ? <Check size={16} aria-hidden /> : <span className="w-4" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
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
  const focusField = useRef<BriefFieldName | null>(null);

  useEffect(() => {
    if (!errorTick) return;
    const fieldId = focusField.current;
    const field = fieldId ? document.getElementById(fieldId) : null;
    if (field instanceof HTMLElement) {
      field.focus();
      return;
    }
    errorRef.current?.focus();
  }, [errorTick]);

  function showInvalid(next: { error: string; fields: BriefFieldName[] }) {
    setInvalidFields(next.fields);
    setError(next.error);
    focusField.current = next.fields[0] ?? null;
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
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
        <BackHome />
        <p className="mt-6 w-full rounded-lg border border-border px-5 py-4 text-base leading-relaxed text-foreground">
          Thanks. I&apos;ll reply by email within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <BackHome />
      <h1 className="mt-6 text-balance text-3xl font-medium tracking-tight text-foreground">
        Send a brief
      </h1>
      <p className="mt-4 text-pretty text-base leading-relaxed text-muted">
        Tell me what you need built, your timeline and your budget. I reply by email within 24 hours.
      </p>
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

        <ChoiceField
          id="timeline"
          name="timeline"
          label="Timeline"
          optional
          placeholder="Select a timeline"
          options={TIMELINE_OPTIONS}
          invalid={invalidFields.includes("timeline")}
          describedBy={invalidFields.includes("timeline") ? "brief-error" : undefined}
          onPicked={refreshAfterAttempt}
        />

        <ChoiceField
          id="budget"
          name="budget"
          label="Budget range"
          optional
          placeholder="Select a budget range"
          options={BUDGET_OPTIONS}
          invalid={invalidFields.includes("budget")}
          describedBy={invalidFields.includes("budget") ? "brief-error" : undefined}
          onPicked={refreshAfterAttempt}
        />

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
              onChange={onAttachmentChange}
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
                onClick={clearAttachment}
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

        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          aria-describedby={error ? "brief-error" : undefined}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-5 text-base font-medium text-background transition-colors duration-150 hover:bg-accent-hover active:bg-accent-pressed disabled:opacity-60 sm:w-auto"
        >
          <span className="grid">
            <span
              className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-2 ${pending ? "" : "invisible"}`}
            >
              <Loader2 className="animate-spin" size={16} aria-hidden />
              Sending...
            </span>
            <span className={`col-start-1 row-start-1 ${pending ? "invisible" : ""}`}>Send brief</span>
          </span>
        </button>
      </form>
    </div>
  );
}
