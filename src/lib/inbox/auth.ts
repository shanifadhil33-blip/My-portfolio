import "server-only";
import { timingSafeEqual } from "node:crypto";
import { auth } from "@/auth";
import { isInboxOwner } from "./owners";

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
/** Checked on every request, on the server: the signed session must belong to the allowed account. */
export async function inboxOwner() { const email = (await auth())?.user?.email; return isInboxOwner(email) ? email!.toLowerCase() : null; }
