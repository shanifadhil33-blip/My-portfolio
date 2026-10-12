import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/inbox/db";
import { safeEqual } from "@/lib/inbox/auth";

export const runtime = "nodejs";
const MAX_SHOT = 1_500_000;
const Body = z.object({
  app: z.string().trim().min(1).max(40),
  page: z.string().trim().max(300).default(""),
  role: z.string().trim().max(40).optional(),
  device: z.string().trim().max(300).optional(),
  message: z.string().trim().min(3).max(4000),
  sender: z.string().trim().min(8).max(128),
  website: z.string().max(0).optional(), // honeypot: people never fill it
  screenshot: z.object({ type: z.enum(["image/jpeg", "image/png", "image/webp"]), data: z.string().max(Math.ceil(MAX_SHOT * 4 / 3) + 4) }).optional(),
});
const LINKS = /https?:\/\//gi;

/** Apps post feedback here with the shared secret. Never emails anyone. */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = process.env.FEEDBACK_SECRET;
  if (!expected || !safeEqual(auth, `Bearer ${expected}`)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (Number(req.headers.get("content-length") ?? 0) > 2_500_000) return NextResponse.json({ error: "too_large" }, { status: 413 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const b = parsed.data;
  if ((b.message.match(LINKS)?.length ?? 0) > 3) return NextResponse.json({ error: "spam" }, { status: 400 });
  const shot = b.screenshot ? Buffer.from(b.screenshot.data, "base64") : null;
  if (shot && (shot.length > MAX_SHOT || !looksLikeImage(shot, b.screenshot!.type))) return NextResponse.json({ error: "bad_image" }, { status: 400 });
  const db = sql();
  const [limits] = await db`SELECT
    count(*) FILTER (WHERE sender_hash=${b.sender} AND created_at>now()-interval '1 hour')::int AS sender_hour,
    count(*) FILTER (WHERE sender_hash=${b.sender} AND message=${b.message} AND created_at>now()-interval '1 day')::int AS same,
    count(*) FILTER (WHERE created_at>now()-interval '1 day')::int AS day FROM feedback`;
  if (limits.same > 0) return NextResponse.json({ ok: true, duplicate: true });
  if (limits.sender_hour >= 10 || limits.day >= 300) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  await db`INSERT INTO feedback(app,page,role,device,message,screenshot,screenshot_type,sender_hash)
    VALUES(${b.app},${b.page},${b.role ?? null},${b.device ?? null},${b.message},${shot},${b.screenshot?.type ?? null},${b.sender})`;
  return NextResponse.json({ ok: true }, { status: 201 });
}
function looksLikeImage(buf: Buffer, type: string) {
  if (type === "image/jpeg") return buf[0] === 0xff && buf[1] === 0xd8;
  if (type === "image/png") return buf.subarray(0, 4).toString("hex") === "89504e47";
  return buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP";
}
