import { NextResponse } from "next/server";
import { PASS_URL, sessionCookie } from "@/lib/inbox/auth";
/** Sign out clears every session involved: this site's inbox cookie here, then the Groundwork Google session there (which comes back home). */
export async function GET() {
  const res = NextResponse.redirect(`${PASS_URL}/signout`, 303);
  res.cookies.set(sessionCookie.name, "", { path: "/", maxAge: 0 });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
