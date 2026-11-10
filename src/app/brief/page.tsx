import type { Metadata } from "next";
import BriefForm from "@/components/BriefForm";
import { shareMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Send a Project Brief",
  description:
    "Send Adhil Shanif a project brief: what you need built, your timeline and your budget. Replies by email within 24 hours.",
  alternates: { canonical: "/brief" },
  ...shareMeta("Send a Project Brief", "What you need built, your timeline and your budget. Replies by email within 24 hours.", "/brief"),
};

export default function BriefPage() {
  return (
    <main className="flex flex-1 flex-col px-5 py-16 sm:px-6 sm:py-24">
      <BriefForm />
    </main>
  );
}
