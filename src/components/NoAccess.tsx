import Link from "next/link";
import { Lock } from "lucide-react";

/** Shown only after a Google sign in with an account that is not allowed. One button, no dead ends. */
export default function NoAccess() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 text-muted"><Lock size={20} aria-hidden /></span>
      <h1 className="mt-5 text-2xl font-medium tracking-tight text-foreground">This inbox is private</h1>
      <p className="mt-3 text-muted">This is Adhil’s private inbox. It’s where people who use his apps send feedback, problems, errors and ideas, so only Adhil can open it.</p>
      <Link href="/" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-foreground px-6 text-sm font-medium text-background hover:opacity-90">Go home</Link>
    </main>
  );
}
