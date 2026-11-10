import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/site";

// IndexNow tells Bing (and Yandex, Naver, Seznam, Yep) which URLs changed. Google does not use it.
// The key is public by design: it is served at /<key>.txt to prove ownership of this host.
const INDEXNOW_KEY = "78ab3c46c2ec6085ecd61af795b773db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Submits the sitemap URLs once. Run it by hand after a content change, never on a schedule:
 *   GET /api/indexnow?token=<INDEXNOW_TOKEN>
 * INDEXNOW_TOKEN is a Vercel environment variable, so strangers cannot trigger submissions.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const expected = process.env.INDEXNOW_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return NextResponse.json({ ok: false, error: "Only production URLs are submitted." }, { status: 400 });
  }

  const host = new URL(SITE_URL).host;
  const urlList = sitemap().map((entry) => entry.url);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList }),
  });

  // 200 and 202 both mean accepted. Acceptance is not a promise of indexing.
  return NextResponse.json({ ok: res.ok, status: res.status, submitted: urlList }, { status: res.ok ? 200 : 502 });
}
