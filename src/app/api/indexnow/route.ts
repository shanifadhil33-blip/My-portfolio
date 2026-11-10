import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/site";

// IndexNow tells Bing (and Yandex, Naver, Seznam, Yep) which URLs changed. Google does not use it.
// The key is public by design: it is served at /<key>.txt to prove ownership of this host.
const INDEXNOW_KEY = "78ab3c46c2ec6085ecd61af795b773db";

// SHA-256 of the private trigger token. Only the hash is in the code, so the repository
// being public does not let anyone else trigger a submission.
const TOKEN_SHA256 = "74876f066a862a89cdff1af048afa73228c5a3087f0e75f2a62d240bef55dd6c";

function tokenOk(token: string | null): boolean {
  if (!token) return false;
  const a = Buffer.from(createHash("sha256").update(token).digest("hex"));
  const b = Buffer.from(TOKEN_SHA256);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Submits the sitemap URLs once. Run it by hand after a content change, never on a schedule:
 *   GET /api/indexnow?token=<private token>
 */
export async function GET(request: Request) {
  if (!tokenOk(new URL(request.url).searchParams.get("token"))) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return NextResponse.json({ ok: false, error: "Only production URLs are submitted." }, { status: 400 });
  }

  const host = new URL(SITE_URL).host;
  const urlList = sitemap().map((entry) => entry.url);
  let res: Response;
  try {
    res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList }),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "IndexNow could not be reached." }, { status: 502 });
  }

  // 200 and 202 both mean accepted. Acceptance is not a promise of indexing.
  return NextResponse.json({ ok: res.ok, status: res.status, submitted: urlList }, { status: res.ok ? 200 : 502 });
}
