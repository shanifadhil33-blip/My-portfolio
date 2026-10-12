import { NextResponse } from "next/server";
import { inboxOwner } from "@/lib/inbox/auth";
import { sql } from "@/lib/inbox/db";
/** The dot only lights up for the inbox owner; everyone else always gets false. */
export async function GET() {
  if (!(await inboxOwner())) return NextResponse.json({ unread: false }, { headers: { "Cache-Control": "no-store" } });
  const [row] = await sql()`SELECT count(*)::int AS n FROM feedback WHERE read_at IS NULL`;
  return NextResponse.json({ unread: row.n > 0, count: row.n }, { headers: { "Cache-Control": "no-store" } });
}
