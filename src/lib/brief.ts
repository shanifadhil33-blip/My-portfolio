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

export function parseBriefFields(input: {
  name: string;
  email: string;
  company: string;
  project: string;
  timeline: string;
  budget: string;
  hpField: string;
}): { ok: true; data: BriefFields } | { ok: false; error: string } {
  const parsed = briefFields.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
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
