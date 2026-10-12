import Link from "next/link";
import { Lock } from "lucide-react";
import BackButton from "./BackButton";

export default function NoAccess() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 text-muted"><Lock size={20} aria-hidden /></span>
      <h1 className="mt-5 text-2xl font-medium tracking-tight text-foreground">You can’t access this</h1>
      <p className="mt-2 text-muted">This page is private.</p>
      <div className="mt-6 flex gap-2">
        <BackButton />
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background hover:opacity-90">Go home</Link>
      </div>
    </main>
  );
}
