"use client";

import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { 
  Brain, 
  Cpu, 
  Layers, 
  GitMerge, 
  Terminal, 
  Box, 
  Database, 
  Server, 
  Workflow, 
  Sparkles, 
  Quote 
} from "lucide-react";

const stats = [
  { value: "5+", label: "Production Apps" },
  { value: "10+", label: "AI Agents" },
];

const capabilities = [
  {
    icon: Brain,
    title: "LLM Applications",
    description: "RAG, agentic workflows, vision and multimodal systems designed for real-world reliability and cost-efficiency.",
  },
  {
    icon: Layers,
    title: "Full-Stack B2B SaaS",
    description: "End-to-end products complete with secure authentication, stripe payments, advanced dashboards, and client portals.",
  },
  {
    icon: Cpu,
    title: "Autonomous Agents",
    description: "Event-driven, scheduled, multi-step decision-making agents executing complex workflows without human intervention.",
  },
  {
    icon: GitMerge,
    title: "Automation Pipelines",
    description: "Local and cloud-native integrations, cron jobs, webhook chains, and custom API syncs built for speed and resilience.",
  },
];

const stackGroups = [
  {
    title: "Languages & Runtimes",
    icon: Terminal,
    items: ["Python", "TypeScript", "Node.js"],
  },
  {
    title: "Package Ecosystems",
    icon: Box,
    items: ["npm", "PyPI"],
  },
  {
    title: "Data",
    icon: Database,
    items: ["Postgres (Supabase)", "Firebase"],
  },
  {
    title: "Infrastructure",
    icon: Server,
    items: ["Cloudflare", "Vercel", "Google Cloud"],
  },
  {
    title: "Orchestration",
    icon: Workflow,
    items: ["GitHub Actions", "n8n", "cron"],
  },
  {
    title: "Model Layer",
    icon: Sparkles,
    items: ["Groq", "OpenRouter", "Gemini", "Claude", "OpenAI"],
  },
];

export default function About() {
  return (
    <section id="about" className="py-28 px-6 relative overflow-hidden">
      {/* Subtle ambient lighting specifically for the About section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-indigo-400 mb-3">
              About & Methodology
            </h2>
            <div className="h-0.5 w-12 bg-indigo-500/30 rounded-full" />
          </div>
        </ScrollReveal>

        {/* Main Pitch & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          <div className="lg:col-span-7">
            <ScrollReveal delay={0.1}>
              <p className="text-xl sm:text-2xl text-slate-200 leading-[1.6] font-medium mb-6">
                I build production AI systems end-to-end — the model layer, the product around it, and the infrastructure it runs on.
              </p>
              <p className="text-base sm:text-lg text-slate-400 leading-[1.8] mb-6">
                I work close to the primitives — packages, protocols, model APIs — and assemble upward instead of stacking heavy, brittle abstractions. Most of what I build runs on free tiers, open-source libraries, and direct API calls billed in cents. The whole stack stays lean by design.
              </p>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5 w-full">
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.25)" }}
                    className="glass rounded-2xl p-6 flex flex-col items-center lg:items-start text-center lg:text-left border border-white/5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                  >
                    <div className="text-3xl font-extrabold text-gradient-accent">
                      {stat.value}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 mt-2 tracking-wider uppercase">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* What I Build Grid */}
        <div className="mb-24">
          <ScrollReveal>
            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-10 text-center lg:text-left">
              What I Build
            </h3>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <ScrollReveal key={cap.title} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -5, borderColor: "rgba(99, 102, 241, 0.2)" }}
                    className="glass rounded-2xl p-8 border border-white/5 h-full transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)] relative group overflow-hidden"
                  >
                    {/* Inner glowing corner */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors duration-300" />
                    
                    <div className="flex items-start gap-5">
                      <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all duration-300">
                        <Icon size={22} className="stroke-[1.5]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-white transition-colors duration-300">
                          {cap.title}
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Tech Stack Grid */}
        <div className="mb-24">
          <ScrollReveal>
            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-10 text-center lg:text-left">
              Base Stack
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stackGroups.map((group, i) => {
              const Icon = group.icon;
              return (
                <ScrollReveal key={group.title} delay={i * 0.05}>
                  <div className="glass rounded-2xl p-6 border border-white/5 h-full relative group hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon size={16} className="text-indigo-400 stroke-[2]" />
                      <h4 className="text-sm font-bold text-slate-200 tracking-wide">
                        {group.title}
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.03] text-slate-300 border border-white/5 hover:border-white/10 hover:text-white transition-all duration-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-6 glass rounded-xl px-5 py-3.5 border border-white/[0.06] text-center">
              <p className="text-xs sm:text-sm text-slate-400 font-medium italic">
                These are my defaults. I pick up whatever a project actually requires.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Engineering Approach Highlight Box */}
        <ScrollReveal>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="glass rounded-3xl p-8 sm:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-r from-indigo-950/20 via-slate-950/40 to-violet-950/20 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
          >
            <div className="absolute top-0 right-0 p-8 text-indigo-500/10 pointer-events-none hidden sm:block">
              <Quote size={80} className="stroke-[1]" />
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-2 text-indigo-400">
                <Quote size={20} className="fill-indigo-400/20" />
                <span className="text-xs font-bold tracking-widest uppercase">Engineering Approach</span>
              </div>
              <blockquote className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed italic">
                Most AI tools being sold right now are a UI on top of an API call. I work the layer below. Direct model access, open-source packages, lean infrastructure. The gap between building that way and stitching together SaaS subscriptions usually comes out to cents versus hundreds a month.
              </blockquote>
            </div>
          </motion.div>
        </ScrollReveal>

      </div>
    </section>
  );
}
