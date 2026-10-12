"use client";
import { ArrowLeft } from "lucide-react";
export default function BackButton() {
  return <button type="button" onClick={() => (history.length > 1 ? history.back() : location.assign("/"))} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm text-foreground hover:bg-foreground/5"><ArrowLeft size={16} aria-hidden />Back</button>;
}
