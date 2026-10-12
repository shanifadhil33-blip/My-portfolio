import Link from "next/link";
import { Inbox } from "lucide-react";
import { PASS_URL } from "@/lib/inbox/auth";

/** Signed out: one clear way in, plus a way home. */
export default function InboxSignIn() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 text-muted"><Inbox size={20} aria-hidden /></span>
      <h1 className="mt-5 text-2xl font-medium tracking-tight text-foreground">Inbox</h1>
      <p className="mt-2 text-muted">Sign in to see your messages.</p>
      <a href={PASS_URL} className="mt-6 inline-flex min-h-12 w-full max-w-xs items-center justify-center gap-3 rounded-lg bg-foreground px-6 text-base font-medium text-background hover:opacity-90">
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
        Sign in with Google
      </a>
      <Link href="/" className="mt-3 inline-flex min-h-11 items-center px-4 text-sm text-muted hover:text-foreground">Go home</Link>
    </main>
  );
}
