import { Mail } from "lucide-react";
import { EMAIL, LINKEDIN_URL, UPWORK_URL, WHATSAPP_URL, mailtoHref } from "@/lib/site";

const contactCards = [
  {
    label: "Email",
    href: mailtoHref("Project enquiry"),
    logo: (
      <svg viewBox="0 0 48 48" width="24" height="24" className="shrink-0" aria-hidden="true">
        <path fill="#4285F4" d="M6 40h7V23L1 14v21a5 5 0 0 0 5 5Z" />
        <path fill="#34A853" d="M35 40h7a5 5 0 0 0 5-5V14l-12 9Z" />
        <path fill="#EA4335" d="M35 7v16l-11 8-11-8V7l11 8Z" />
        <path fill="#C5221F" d="M1 14l12 9V7L9 4C5.7 1.525 1 3.88 1 8Z" />
        <path fill="#FBBC04" d="M35 7v16l12-9V8c0-4.12-4.7-6.475-8-4Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: LINKEDIN_URL,
    logo: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="#0A66C2" className="shrink-0" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    logo: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="#25D366" className="shrink-0" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    label: "Upwork",
    href: UPWORK_URL,
    logo: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="#14A800" className="shrink-0" aria-hidden="true">
        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
      </svg>
    ),
  },
];

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
              Tell me what you need built, your timeline and your budget. I reply by email within 24 hours.
            </p>
            <div className="mt-4 flex items-center gap-2.5 text-muted">
              <Mail size={16} aria-hidden />
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex min-h-11 items-center break-all text-base text-accent transition-colors duration-150 hover:text-accent-hover active:opacity-80"
              >
                {EMAIL}
              </a>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            {contactCards.map(({ label, href, logo }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={label === "Email" ? undefined : "_blank"}
                rel={label === "Email" ? undefined : "noopener noreferrer"}
                className="flex min-h-16 w-full items-center gap-3 rounded-xl border border-border px-5 py-4 text-base font-medium text-foreground transition-[background-color,border-color,transform] duration-200 ease-out hover:border-foreground/30 hover:bg-foreground/5 active:scale-[0.99] active:border-foreground/40 active:bg-foreground/10"
              >
                {logo}
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-border pt-8 md:mt-28">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Adhil Shanif. Built with Next.js. <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">Privacy</a>
          </p>
        </div>
      </div>
    </section>
  );
}
