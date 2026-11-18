import { UPWORK_URL } from "@/lib/site";
import { SectionHead } from "./ui";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="zone-light relative border-t border-border px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead id="about-title" n="04" label="About" title="Adhil Shanif." />
        <div className="about-copy mt-10 max-w-3xl space-y-5">
          <p className="text-pretty text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
            I build complete products by directing AI coding agents, and I own the scope, the testing, the GitHub repositories and the deployment on Vercel, Cloudflare and Supabase. I&apos;m based in Dubai and work remotely, from an idea, a specification or an existing app that needs fixing. Code, accounts and infrastructure belong to the client from day one.
          </p>
          <a
            href={UPWORK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-base text-accent underline underline-offset-4 hover:text-accent-hover"
          >
            Top Rated on Upwork: see verified reviews
          </a>
        </div>
      </div>
    </section>
  );
}
