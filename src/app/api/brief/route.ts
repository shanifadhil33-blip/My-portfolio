import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EMAIL } from "@/lib/site";
import {
  allowBrief,
  attachmentError,
  briefBody,
  briefSubject,
  clientIp,
  parseBriefFields,
  safeFilename,
} from "@/lib/brief";

export const runtime = "nodejs";

const FROM_ADDRESS = "onboarding@resend.dev";

function failure(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return failure("The form could not be read. Try again.", 400);
  }

  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  const parsed = parseBriefFields({
    name: text("name"),
    email: text("email"),
    company: text("company"),
    project: text("project"),
    timeline: text("timeline"),
    budget: text("budget"),
    hpField: text("hp_field"),
  });

  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error, fields: parsed.fields }, { status: 400 });
  }
  if (parsed.data.hpField.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const attachment = formData.get("attachment");
  const file = attachment instanceof File ? attachment : null;
  const fileProblem = attachmentError(file);
  if (fileProblem) return failure(fileProblem, 400);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return failure(
      `The brief could not be sent because email is not configured. Email ${EMAIL} instead.`,
      503,
    );
  }

  if (!allowBrief(clientIp(request.headers))) {
    return failure(
      `Too many briefs from this network. Try again in an hour, or email ${EMAIL}.`,
      429,
    );
  }

  const resend = new Resend(apiKey);
  const attachments = [];
  if (file && file.size > 0) {
    attachments.push({
      filename: safeFilename(file.name),
      content: Buffer.from(await file.arrayBuffer()),
    });
  }

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: EMAIL,
    replyTo: parsed.data.email,
    subject: briefSubject(parsed.data.name, parsed.data.company),
    text: briefBody(parsed.data),
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  if (error) {
    console.error("Brief email failed:", error.message);
    return failure(`The brief could not be sent. Email ${EMAIL} instead.`, 502);
  }

  return NextResponse.json({ ok: true });
}
