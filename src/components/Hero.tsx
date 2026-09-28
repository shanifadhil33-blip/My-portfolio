"use client";

import { useState } from "react";
import { ArrowDown, X, Mail } from "lucide-react";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, ROLE, mailtoHref } from "@/lib/site";

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const socialLinkClass =
  "flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-150 hover:border-accent hover:text-accent";

export default function Hero() {
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 sm:px-6"
    >
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <button
          type="button"
          className="group/portrait cursor-pointer border-0 bg-transparent p-0"
          onClick={() => setIsCardOpen(true)}
          aria-label="Open profile"
        >
          <div className="h-40 w-40 overflow-hidden rounded-full border border-border bg-background transition-colors duration-150 group-hover/portrait:border-accent sm:h-44 sm:w-44">
            <img
              src="/adhil-portrait.jpg"
              alt="Adhil Shanif"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </button>

        <div className="mt-8 flex flex-col items-center text-center">
          <p className="mb-6 text-sm text-muted">Dubai, UAE</p>

          <h1 className="text-balance text-[clamp(2.75rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-foreground">
            Adhil Shanif
          </h1>

          <p className="mt-4 text-lg font-medium text-muted sm:text-xl">{ROLE}</p>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted">
            Internal tools, SaaS platforms and AI-powered systems, built end to end and handed over working.
          </p>

          <div className="mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
            <a
              href={mailtoHref("Project brief")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-base font-medium text-background transition-colors duration-150 hover:bg-accent-hover"
            >
              <Mail size={16} aria-hidden />
              Send a written brief
            </a>
            <a
              href="#client-work"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-5 text-base font-medium text-foreground transition-colors duration-150 hover:border-accent hover:text-accent"
            >
              View work
              <ArrowDown size={16} aria-hidden />
            </a>
          </div>
        </div>
      </div>

      {isCardOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsCardOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Adhil Shanif"
            className="relative flex aspect-square w-[min(22.5rem,calc(100vw-2rem))] flex-col items-center justify-center rounded-full border border-border bg-background p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsCardOpen(false)}
              className="absolute top-8 right-8 flex h-11 w-11 items-center justify-center text-muted transition-colors duration-150 hover:text-foreground"
              aria-label="Close card"
            >
              <X size={18} />
            </button>

            <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border border-border bg-background sm:h-24 sm:w-24">
              <img
                src="/adhil-portrait.jpg"
                alt="Adhil Shanif"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <h3 className="mb-1 text-xl font-medium text-foreground sm:text-2xl">Adhil Shanif</h3>
            <p className="mb-3 max-w-[240px] text-sm leading-snug text-muted">{ROLE}</p>

            <p className="mb-6 max-w-[280px] text-sm leading-relaxed text-muted">
              I design and build internal tools, SaaS platforms and AI systems, and hand them over working.
            </p>

            <div className="flex items-center gap-3">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClass}
                title="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
              <a href={`mailto:${EMAIL}`} className={socialLinkClass} title="Email">
                <Mail size={18} />
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClass}
                title="GitHub"
              >
                <GithubIcon size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
