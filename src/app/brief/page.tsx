import type { Metadata } from "next";
import BriefForm from "@/components/BriefForm";

export const metadata: Metadata = {
  title: "Send a brief | Adhil Shanif",
  description: "Tell me what you need built, your timeline and your budget. I reply by email within 24 hours.",
};

export default function BriefPage() {
  return (
    <main className="flex flex-1 flex-col px-5 py-16 sm:px-6 sm:py-24">
      <BriefForm />
    </main>
  );
}
