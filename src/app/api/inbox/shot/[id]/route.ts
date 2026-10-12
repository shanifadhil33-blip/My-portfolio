import { inboxOwner } from "@/lib/inbox/auth";
import { sql } from "@/lib/inbox/db";
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await inboxOwner()) || !/^[0-9a-f-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const [row] = await sql()`SELECT screenshot, screenshot_type FROM feedback WHERE id=${id}`;
  if (!row?.screenshot) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(row.screenshot as Buffer), { headers: { "Content-Type": row.screenshot_type, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'" } });
}
