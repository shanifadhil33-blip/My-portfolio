import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { inboxOwner, PASS_URL } from "@/lib/inbox/auth";
import { sql } from "@/lib/inbox/db";
import BackHome from "@/components/BackHome";
import NoAccess from "@/components/NoAccess";

export const metadata: Metadata = { title: "Inbox", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Row = { id: string; created_at: string; app: string; page: string; role: string | null; device: string | null; message: string; has_shot: boolean; read_at: string | null };

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const owner = await inboxOwner();
  if (!owner) {
    if ((await searchParams).denied) return <NoAccess />;
    redirect(PASS_URL);
  }
  const rows = (await sql()`SELECT id, created_at, app, page, role, device, message, screenshot IS NOT NULL AS has_shot, read_at
    FROM feedback ORDER BY created_at DESC LIMIT 200`) as Row[];
  const unread = rows.filter(r => !r.read_at).length;
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-6">
      <BackHome />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">Inbox</h1>
          <p className="mt-1 text-sm text-muted">{unread ? `${unread} new` : "All read"} · {rows.length} total</p>
        </div>
        <div className="flex gap-2">
          {unread > 0 && <form action="/api/inbox/read" method="post"><input type="hidden" name="id" value="all" /><button className="min-h-11 rounded-lg border border-border px-4 text-sm text-foreground hover:bg-foreground/5">Mark all read</button></form>}
          <a href="/inbox/signout" className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm text-muted hover:text-foreground">Sign out</a>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="mt-10 rounded-xl border border-border p-8 text-center text-muted">No feedback yet. New messages from your apps show up here.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {rows.map(r => (
            <li key={r.id} className={`rounded-xl border p-5 ${r.read_at ? "border-border" : "border-foreground/40 bg-foreground/[0.03]"}`}>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                {!r.read_at && <span className="h-2 w-2 rounded-full bg-red-500" aria-label="New" />}
                <span className="rounded-md bg-foreground/5 px-2 py-0.5 font-medium text-foreground">{r.app}</span>
                {r.role && <span>{r.role}</span>}
                <span>{r.page || "/"}</span>
                <time dateTime={new Date(r.created_at).toISOString()} className="ml-auto">{new Date(r.created_at).toLocaleString("en-GB", { timeZone: "Asia/Dubai", dateStyle: "medium", timeStyle: "short" })} GST</time>
              </div>
              <p className="mt-3 whitespace-pre-wrap break-words text-foreground">{r.message}</p>
              {/* eslint-disable-next-line @next/next/no-img-element -- private, auth gated image */}
              {r.has_shot && <a href={`/api/inbox/shot/${r.id}`} target="_blank" rel="noreferrer" className="mt-3 block"><img src={`/api/inbox/shot/${r.id}`} alt="Screenshot sent with this message" className="max-h-72 rounded-lg border border-border" loading="lazy" /></a>}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <span className="break-all">{r.device}</span>
                {!r.read_at && <form action="/api/inbox/read" method="post"><input type="hidden" name="id" value={r.id} /><button className="min-h-11 rounded-lg px-3 text-sm text-foreground hover:bg-foreground/5">Mark read</button></form>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
