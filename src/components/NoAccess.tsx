import Link from "next/link";
import { Lock } from "lucide-react";
import { PASS_URL } from "@/lib/inbox/auth";

/** Shown only after a Google sign in with an account that is not allowed. One button to try another account, and a quiet way home. */
export default function NoAccess() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 text-muted"><Lock size={20} aria-hidden /></span>
      <h1 className="mt-5 text-2xl font-medium tracking-tight text-foreground">This inbox is private</h1>
      <p className="mt-3 text-muted">This is Adhil’s private inbox. It’s where people who use his apps send feedback, problems, errors and ideas, so only Adhil can open it.</p>
      {/* Ends the current sign in and opens Google's account picker. */}
      <a href={`${PASS_URL}?switch=1`} className="mt-6 inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-lg bg-foreground px-6 text-base font-medium text-background hover:opacity-90">Sign in with a different account</a>
      <Link href="/" className="mt-3 inline-flex min-h-11 items-center px-4 text-sm text-muted hover:text-foreground">Go home</Link>
    </main>
  );
}
