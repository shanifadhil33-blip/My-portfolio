"use client";

import { Mail, ArrowUpRight, MessageCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const EMAIL = "shanifadhil6@gmail.com";
const WHATSAPP_LINK = "https://wa.me/971506884500";
const LINKEDIN_LINK = "https://www.linkedin.com/in/adhil-shanif-83a233358?utm_source=share_via&utm_content=profile&utm_medium=member_android";

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const GmailIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="#4285F4" d="M4 5.25V18a2 2 0 0 0 2 2h3V8.25L4 5.25z" />
    <path fill="#34A853" d="M20 5.25V18a2 2 0 0 1-2 2h-3V8.25L20 5.25z" />
    <path fill="#EA4335" d="M20 5.25V8.25L12 13 4 8.25V5.25c0-.85.9-1.39 1.62-.95L12 8.25l6.38-3.95c.72-.44 1.62.1 1.62.95z" />
    <path fill="#FBBC05" d="M4 8.25V11l8 6 8-6V8.25L12 13 4 8.25z" opacity="0.15" />
  </svg>
);

export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6 relative">
      {/* Top divider gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500 mb-4">
                Contact
              </h2>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Mail size={14} className="text-slate-600" />
                <a href={`mailto:${EMAIL}`} className="text-sm hover:text-slate-200 transition-colors duration-300">
                  {EMAIL}
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 sm:mt-0 w-full sm:w-auto">
              <a
                href={LINKEDIN_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto justify-center inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold glass text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all duration-300 shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.25)] border-blue-500/20 hover:border-blue-500/40"
              >
                <span className="text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <LinkedinIcon size={16} />
                </span>
                LinkedIn
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto justify-center inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold glass text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all duration-300 shadow-[0_0_20px_-5px_rgba(34,197,94,0.1)] hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.2)] border-emerald-500/20 hover:border-emerald-500/40"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                WhatsApp Me
              </a>
              <a
                href={`mailto:${EMAIL}?subject=Inquiry%20from%20Portfolio`}
                id="hire-me-cta"
                className="group w-full sm:w-auto justify-center inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold glass text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all duration-300 shadow-[0_0_20px_-5px_rgba(239,68,68,0.15)] hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.25)] border-red-500/20 hover:border-red-500/40"
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  <GmailIcon size={16} />
                </span>
                Email Me
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Footer */}
        <ScrollReveal delay={0.1}>
          <div className="mt-20 pt-8 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
            <p className="text-xs text-slate-700">
              © {new Date().getFullYear()} Adhil Shanif. Built with Next.js.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
