import { NextResponse } from "next/server";
import { inboxOwner } from "@/lib/inbox/auth";
import { sql } from "@/lib/inbox/db";
export async function POST(req: Request) {
  if (!(await inboxOwner())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const form = await req.formData().catch(() => null);
  const id = String(form?.get("id") ?? "");
  const db = sql();
  if (id === "all") await db`UPDATE feedback SET read_at=now() WHERE read_at IS NULL`;
  else if (/^[0-9a-f-]{36}$/.test(id)) await db`UPDATE feedback SET read_at=now() WHERE id=${id} AND read_at IS NULL`;
  return NextResponse.redirect(new URL("/inbox", req.url), 303);
}
