import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/inbox/auth";
export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url), 303);
  res.cookies.set(sessionCookie.name, "", { path: "/", maxAge: 0 });
  return res;
}
