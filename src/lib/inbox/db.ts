import "server-only";
import { neon } from "@neondatabase/serverless";
/** Free Neon store, least privilege role inbox_app (select, insert, update read_at only). */
export function sql() {
  const url = process.env.INBOX_DATABASE_URL;
  if (!url) throw new Error("INBOX_DATABASE_URL is not set");
  return neon(url);
}
