"use client";

import { Project } from "@/data/projects";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  index: number;
}

export default function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  return (
    <motion.div
      id={`project-card-${project.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group text-left w-full rounded-2xl overflow-hidden glass glass-hover transition-all duration-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 flex flex-col h-full cursor-pointer"
    >
      <div className="aspect-video bg-slate-900/50 border-b border-white/[0.04] flex items-center justify-center relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-violet-500/[0.03]" />
        
        {/* Placeholder beneath the image */}
        <div className="flex flex-col items-center gap-2 text-slate-700 relative z-0">
          <ImageIcon size={28} strokeWidth={1.5} />
          <span className="text-[10px] tracking-wider uppercase">Screenshot</span>
        </div>

        {/* Actual Image */}
        <img 
          src={project.thumbnail} 
          alt={project.title} 
          className="absolute inset-0 w-full h-full object-cover z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          onError={(e) => {
            // Fallback to hide broken images
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-200 group-hover:text-white transition-colors duration-300">{project.title}</h3>
            <ArrowUpRight size={15} className="text-slate-600 group-hover:text-indigo-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 mt-0.5 shrink-0" />
          </div>
          <p className="mt-2.5 text-sm text-slate-500 leading-relaxed line-clamp-2">{project.brief}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-[10px] tracking-wider uppercase text-slate-500 bg-white/[0.03] border border-white/[0.06] rounded-md">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
