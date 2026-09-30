import { z } from "zod";

export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

export const TIMELINE_OPTIONS = [
  "under 1 month",
  "1-3 months",
  "3+ months",
  "not sure",
] as const;

export const BUDGET_OPTIONS = [
  "under US$1,000",
  "US$1,000-3,000",
  "US$3,000-10,000",
  "US$10,000+",
  "not sure",
] as const;

const ALLOWED_EXTENSIONS = new Set([".pdf", ".docx", ".png", ".jpg", ".jpeg"]);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "",
  "application/octet-stream",
]);

const briefFields = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(120, "Name is too long."),
  email: z.email("Enter a valid email address."),
  company: z.string().trim().max(160, "Company name is too long."),
  project: z
    .string()
    .trim()
    .min(1, "Describe what you need built.")
    .max(8000, "That description is too long."),
  timeline: z.enum(TIMELINE_OPTIONS, { error: "Choose a timeline." }),
  budget: z.enum(BUDGET_OPTIONS, { error: "Choose a budget range." }),
  hpField: z.string(),
});

export type BriefFields = z.infer<typeof briefFields>;

export const BRIEF_FIELD_ORDER = ["name", "email", "project", "timeline", "budget", "company"] as const;

export type BriefFieldName = (typeof BRIEF_FIELD_ORDER)[number];

const BRIEF_FIELD_LABEL: Record<BriefFieldName, string> = {
  name: "Name",
  email: "Email",
  project: "What you need built",
  timeline: "Timeline",
  budget: "Budget range",
  company: "Company",
};

const REQUIRED_BRIEF_FIELDS = new Set<BriefFieldName>(["name", "email", "project", "timeline", "budget"]);

export type BriefInput = {
  name: string;
  email: string;
  company: string;
  project: string;
  timeline: string;
  budget: string;
  hpField: string;
};

function isBriefField(value: string): value is BriefFieldName {
  return (BRIEF_FIELD_ORDER as readonly string[]).includes(value);
}

function englishList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function briefFailureMessage(input: BriefInput, fields: Partial<Record<BriefFieldName, string>>): string {
  const missing: string[] = [];
  const invalid: string[] = [];

  for (const field of BRIEF_FIELD_ORDER) {
    const message = fields[field];
    if (!message) continue;
    if (REQUIRED_BRIEF_FIELDS.has(field) && input[field].trim() === "") {
      missing.push(BRIEF_FIELD_LABEL[field]);
      continue;
    }
    invalid.push(message.endsWith(".") ? message : `${message}.`);
  }

  const parts = ["The brief was not sent."];
  if (missing.length === 1) parts.push(`Fill in ${missing[0]}.`);
  else if (missing.length > 1) parts.push(`Fill in ${englishList(missing)}.`);
  parts.push(...invalid);
  return parts.join(" ");
}

export function parseBriefFields(input: BriefInput):
  | { ok: true; data: BriefFields }
  | { ok: false; error: string; fields: BriefFieldName[] } {
  const parsed = briefFields.safeParse(input);
  if (!parsed.success) {
    const messages: Partial<Record<BriefFieldName, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key !== "string" || !isBriefField(key) || messages[key]) continue;
      messages[key] = issue.message;
    }
    const fields = BRIEF_FIELD_ORDER.filter((field) => messages[field]);
    return {
      ok: false,
      error: fields.length > 0 ? briefFailureMessage(input, messages) : "The brief was not sent. Check the form and try again.",
      fields,
    };
  }
  return { ok: true, data: parsed.data };
}

export function attachmentError(file: File | null): string | null {
  if (!file || file.size === 0 || file.name.trim() === "") return null;
  if (file.size > MAX_ATTACHMENT_BYTES) return "The file must be 4 MB or smaller.";

  const extension = fileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return "Attach a PDF, DOCX, PNG, or JPG.";
  }

  const mime = file.type.trim().toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(mime)) {
    return "Attach a PDF, DOCX, PNG, or JPG.";
  }

  return null;
}

export function fileExtension(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot < 0) return "";
  return base.slice(dot).toLowerCase();
}

export function safeFilename(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? "attachment";
  const cleaned = base.replace(/[^\w.\- ()]/g, "_").slice(0, 120);
  return cleaned || "attachment";
}

export function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function briefSubject(name: string, company: string): string {
  const safeName = oneLine(name);
  const safeCompany = oneLine(company);
  if (safeCompany) return `New brief: ${safeName} - ${safeCompany}`;
  return `New brief: ${safeName}`;
}

export function briefBody(fields: BriefFields): string {
  const company = fields.company.trim() || "Not given";
  return [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Company: ${company}`,
    `Timeline: ${fields.timeline}`,
    `Budget: ${fields.budget}`,
    "",
    "What you need built:",
    fields.project,
  ].join("\n");
}

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip")?.trim() || "unknown";
}

export function allowBrief(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}
