import type { Metadata } from "next";
import { namedClientProjects } from "@/data/clientWork";
import { mailtoHref, UPWORK_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Build partner for agencies | Adhil Shanif",
  description:
    "I work with agencies as a referral or co-delivery partner on custom software and AI projects.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function PartnersPage() {
  return (
    <>
      <main className="flex-1 px-5 py-24 sm:px-6 md:py-40">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Build partner for agencies
          </h1>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted">
            <p>
              I work with agencies as a referral or co-delivery partner on custom software and AI projects. I stay in direct written contact with the end client, and the agency keeps its client relationship and its margin.
            </p>
            <p>
              What I take on: internal tools, multi-tenant SaaS platforms, AI systems and integrations.
            </p>
            <p>
              How it works: fixed scope, fixed price, milestone-based, written communication.
            </p>
          </div>

          <ul className="mt-10 space-y-3">
            {namedClientProjects.map((project) => (
              <li
                key={project.id}
                className="rounded-lg border border-border px-5 py-4"
              >
                <p className="text-base font-medium text-foreground">
                  {project.title}
                </p>
                <p className="mt-1.5 text-base leading-relaxed text-muted">
                  {project.brief}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-base leading-relaxed text-muted">
            Top Rated on Upwork, 100% Job Success, 5.0 client rating.{" "}
            <a
              href={UPWORK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 transition-colors duration-150 hover:text-accent-hover"
            >
              Upwork profile
            </a>
          </p>

          <a
            href={mailtoHref("Partnership")}
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-5 text-base font-medium text-background transition-colors duration-150 hover:bg-accent-hover active:bg-accent-pressed"
          >
            Email me about a project
          </a>
        </div>
      </main>
    </>
  );
}
