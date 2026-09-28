import { Mail } from "lucide-react";
import { EMAIL, LINKEDIN_URL, mailtoHref } from "@/lib/site";

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export default function Contact() {
  return (
    <section id="contact" className="relative border-t border-border px-5 py-24 sm:px-6 md:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-8">
          <div>
            <h2 className="text-balance text-2xl font-medium tracking-tight text-foreground">
              Contact
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted">
              Tell me what you need built, your timeline and your budget. I reply in writing within 24 hours.
            </p>
            <div className="mt-4 flex items-center gap-2.5 text-muted">
              <Mail size={16} aria-hidden />
              <a
                href={`mailto:${EMAIL}`}
                className="text-base break-all text-accent transition-colors duration-150 hover:text-accent-hover"
              >
                {EMAIL}
              </a>
            </div>
          </div>

          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a
              href={mailtoHref("Project brief")}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 text-base font-medium text-background transition-colors duration-150 hover:bg-accent-hover sm:w-auto"
            >
              <Mail size={16} aria-hidden />
              Send a written brief
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border px-5 text-base font-medium text-foreground transition-colors duration-150 hover:border-accent hover:text-accent sm:w-auto"
            >
              <LinkedinIcon size={16} />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="mt-20 border-t border-border pt-8 md:mt-28">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Adhil Shanif. Built with Next.js.
          </p>
        </div>
      </div>
    </section>
  );
}
