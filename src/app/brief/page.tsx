import type { Metadata } from "next";
import Link from "next/link";
import BriefForm from "@/components/BriefForm";

export const metadata: Metadata = {
  title: "Send a brief | Adhil Shanif",
  description: "Tell me what you need built, your timeline and your budget. I reply by email within 24 hours.",
};

export default function BriefPage() {
  return (
    <main className="flex-1 px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm text-muted transition-colors duration-150 hover:text-accent"
        >
          Adhil Shanif
        </Link>
        <h1 className="mt-6 text-balance text-3xl font-medium tracking-tight text-foreground">
          Send a brief
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted">
          Tell me what you need built, your timeline and your budget. I reply by email within 24 hours.
        </p>
        <BriefForm />
      </div>
    </main>
  );
}
