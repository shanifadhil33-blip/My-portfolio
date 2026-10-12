import { NextResponse } from "next/server";
import { makeToken, readToken, sessionCookie } from "@/lib/inbox/auth";
/** Groundwork's Google sign in sends a 2 minute pass here; we swap it for a 7 day inbox cookie. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = readToken(url.searchParams.get("t") ?? undefined, "pass");
  if (!email) return NextResponse.redirect(new URL("/inbox?denied=1", url), 303);
  const res = NextResponse.redirect(new URL("/inbox", url), 303);
  res.cookies.set(sessionCookie.name, makeToken(email, "session", sessionCookie.maxAge), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: sessionCookie.maxAge });
  return res;
}
