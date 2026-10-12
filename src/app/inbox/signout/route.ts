import { NextResponse } from "next/server";
import { cookies } from "next/headers";
/** Sign out clears the whole portfolio session: every Auth.js cookie (session, chunks, csrf, callback) and the old inbox cookie. */
export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url), 303);
  for (const c of (await cookies()).getAll()) if (/^(__Secure-|__Host-)?authjs\./.test(c.name) || c.name === "inbox_session") res.cookies.set(c.name, "", { path: "/", maxAge: 0, secure: c.name.startsWith("__") });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
