"use client";

import { useState } from "react";
import { ArrowDown, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const WhatsappIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function Hero() {
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
        {/* Portrait + Content Layout */}
        <div className="flex flex-col items-center gap-8">



          {/* Portrait with glassmorphic aura */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative cursor-pointer group/portrait"
            onClick={() => setIsCardOpen(true)}
          >
            {/* Outer animated glow ring */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-[3px] rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent, rgba(99,102,241,0.4), transparent, rgba(139,92,246,0.3), transparent)",
              }}
            />

            {/* Ambient glow behind portrait */}
            <motion.div
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-6 bg-indigo-500/20 rounded-full blur-2xl"
            />

            {/* Glass border ring */}
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full p-[2px] bg-gradient-to-br from-white/20 via-white/5 to-white/10 transition-all duration-300 group-hover/portrait:scale-[1.03] group-hover/portrait:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              {/* Inner container */}
              <div className="w-full h-full rounded-full overflow-hidden ring-1 ring-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-[#030014] relative">
                <img
                  src="/adhil-portrait.jpg"
                  alt="Adhil Shanif"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/portrait:scale-105"
                />
                
                {/* Modern Hover Overlay */}
                <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover/portrait:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="text-center mt-8 flex flex-col items-center">
          {/* Location Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 hover:border-white/20 transition-all duration-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300 font-semibold tracking-wider uppercase">
              Dubai, United Arab Emirates
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            <span className="text-gradient">Adhil Shanif</span>
          </motion.h1>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48 }}
            className="mt-4 text-xl sm:text-2xl font-bold text-indigo-400 tracking-wide"
          >
            Full-Stack AI Engineer
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.52 }}
            className="mt-3 text-xs sm:text-sm text-slate-400 font-semibold tracking-wider max-w-2xl mx-auto uppercase flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5"
          >
            <span>End-to-End Custom AI Applications</span>
            <span className="hidden sm:inline text-indigo-500/50">•</span>
            <span>Automated Agents</span>
            <span className="hidden sm:inline text-indigo-500/50">•</span>
            <span>Full-Stack SaaS</span>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="#projects"
              id="view-projects-cta"
              className="group inline-flex items-center gap-2.5 mt-10 px-7 py-3.5 rounded-xl text-sm font-semibold bg-white text-slate-950 hover:bg-slate-200 transition-all duration-300 shadow-[0_0_30px_-5px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.25)]"
            >
              View Projects
              <ArrowDown
                size={15}
                className="group-hover:translate-y-0.5 transition-transform duration-300"
              />
            </a>
          </motion.div>
        </div>
      </div>


      {/* Profile Card Modal */}
      <AnimatePresence>
        {isCardOpen && (
          <motion.div
            key="profile-card-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsCardOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-[360px] h-[360px] sm:w-[400px] sm:h-[400px] rounded-full glass border border-white/10 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.25)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button inside the circle */}
              <button
                onClick={() => setIsCardOpen(false)}
                className="absolute top-8 right-8 sm:top-10 sm:right-10 text-slate-500 hover:text-white transition-colors duration-200"
                aria-label="Close card"
              >
                <X size={18} />
              </button>

              {/* Card Photo */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-indigo-500/30 mb-4 shadow-[0_4px_20px_rgba(99,102,241,0.2)] bg-[#030014]">
                <img
                  src="/adhil-portrait.jpg"
                  alt="Adhil Shanif"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Name & Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-1">Adhil Shanif</h3>
              <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase mb-3">
                Full-Stack AI Engineer
              </p>
              
              {/* Brief Bio */}
              <p className="text-xs sm:text-sm text-slate-400 max-w-[280px] leading-relaxed mb-6">
                Specializing in custom LLM applications, autonomous agents, and full-stack SaaS. I engineer close to the primitives to keep production systems high-performance and lean by design.
              </p>

              {/* Quick Actions Row */}
              <div className="flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/in/adhil-shanif-83a233358?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 flex items-center justify-center text-blue-400 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  title="LinkedIn"
                >
                  <LinkedinIcon size={18} />
                </a>
                <a
                  href="https://wa.me/971506884500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 flex items-center justify-center text-emerald-400 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  title="WhatsApp"
                >
                  <WhatsappIcon size={18} />
                </a>
                <a
                  href="mailto:shanifadhil6@gmail.com"
                  className="w-10 h-10 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 flex items-center justify-center text-indigo-400 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                  title="Email"
                >
                  <Mail size={18} />
                </a>
                <a
                  href="https://github.com/shanifadhil33-blip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                  title="GitHub"
                >
                  <GithubIcon size={18} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
