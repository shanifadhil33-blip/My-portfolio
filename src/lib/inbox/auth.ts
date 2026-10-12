import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/** Only this Google account can open /inbox. Checked on every request, server side. */
export const INBOX_OWNERS = ["shanifadhil33@gmail.com"];
export const PASS_URL = "https://groundwork-portal.vercel.app/api/inbox-pass";
const COOKIE = "inbox_session";

function secret() {
  const value = process.env.INBOX_PASS_SECRET;
  if (!value || value.length < 32) throw new Error("INBOX_PASS_SECRET is not set");
  return value;
}
const sign = (body: string) => createHmac("sha256", secret()).update(body).digest("base64url");
export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
/** token = base64url(JSON{email,purpose,exp}).sig */
export function makeToken(email: string, purpose: "pass" | "session", seconds: number) {
  const body = Buffer.from(JSON.stringify({ email, purpose, exp: Math.floor(Date.now() / 1000) + seconds })).toString("base64url");
  return `${body}.${sign(body)}`;
}
export function readToken(token: string | undefined, purpose: "pass" | "session") {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sig, sign(body))) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString()) as { email?: string; purpose?: string; exp?: number };
    if (data.purpose !== purpose || !data.exp || data.exp < Date.now() / 1000) return null;
    const email = String(data.email ?? "").toLowerCase();
    return INBOX_OWNERS.includes(email) ? email : null;
  } catch { return null; }
}
export async function inboxOwner() { return readToken((await cookies()).get(COOKIE)?.value, "session"); }
export const sessionCookie = { name: COOKIE, maxAge: 60 * 60 * 24 * 7 };
