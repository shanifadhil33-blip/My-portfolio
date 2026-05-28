"use client";

import { useEffect, useCallback, useState } from "react";
import { Project } from "@/data/projects";
import { X, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const hasGithub = !!(project?.githubUrl && project.githubUrl.trim() !== "");
  const hasLive = !!(project?.liveUrl && project.liveUrl.trim() !== "");

  // Stable close handler
  const handleClose = useCallback(() => {
    setIsImageZoomed(false);
    onClose();
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          id="project-modal-overlay"
          key="project-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
        >
          {/* Backdrop — clicking this closes the modal */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            onClick={handleClose}
            aria-label="Close modal"
          />

          {/* Modal panel — stop click propagation so clicks inside don't close */}
          <motion.div
            id="project-modal-content"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] glass rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col"
          >
            {/* Sticky close button header */}
            <div className="sticky top-0 z-20 flex justify-end p-4 pb-0">
              <button
                id="project-modal-close"
                onClick={handleClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.08] border border-white/[0.1] hover:bg-white/[0.15] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 -mt-4">
              {/* Header */}
              <div className="px-6 pt-2 pb-0">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[10px] tracking-wider uppercase text-slate-500 bg-white/[0.03] border border-white/[0.06] rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-start justify-between gap-4 mt-2">
                  <h2 className="text-2xl font-bold text-gradient">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    {hasGithub && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-4 py-1.5 text-xs font-medium text-slate-300 bg-white/[0.05] border border-white/[0.1] rounded-lg hover:bg-white/[0.1] hover:text-white transition-colors"
                      >
                        View on GitHub
                      </a>
                    )}
                    {hasLive && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-4 py-1.5 text-xs font-medium text-slate-950 bg-white border border-white rounded-lg hover:bg-slate-200 transition-colors shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)]"
                      >
                        {project.liveUrlLabel || "Visit Site"}
                      </a>
                    )}
                    {!hasGithub && !hasLive && project.systemOverview && (
                      <button
                        onClick={() => {
                          document
                            .getElementById("technical-details")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="shrink-0 px-4 py-1.5 text-xs font-medium text-slate-950 bg-white border border-white rounded-lg hover:bg-slate-200 transition-colors shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)] cursor-pointer"
                      >
                        View Specs
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {project.brief}
                </p>
              </div>

              {/* Main screenshot */}
              <button 
                onClick={() => setIsImageZoomed(true)}
                className="mx-6 mt-6 aspect-video bg-slate-900/40 border border-white/[0.04] rounded-xl flex items-center justify-center relative overflow-hidden group/image cursor-zoom-in block w-[calc(100%-3rem)] text-left focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                title="Zoom image"
              >
                <div className="flex flex-col items-center gap-2 text-slate-700 relative z-0 w-full h-full justify-center">
                  <ImageIcon size={36} strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase">
                    Main Screenshot
                  </span>
                </div>
                <img 
                  src={project.thumbnail} 
                  alt={`${project.title} main screenshot`} 
                  className="absolute inset-0 w-full h-full object-cover z-10 opacity-90 group-hover/image:opacity-100 transition-opacity duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </button>

              {/* Case Study */}
              <div className="p-6 space-y-6">
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                {/* Role / Methodology Metadata Grid */}
                {(project.role || project.methodology) && (
                  <div className="grid grid-cols-2 gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                    {project.role && (
                      <div>
                        <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Role</span>
                        <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-0.5">{project.role}</p>
                      </div>
                    )}
                    {project.methodology && (
                      <div>
                        <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Methodology</span>
                        <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-0.5">{project.methodology}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Problem, Solution, Outcome */}
                {[
                  { label: "Problem", text: project.caseStudy.problem },
                  { label: "Solution", text: project.caseStudy.solution },
                  { label: "Outcome", text: project.caseStudy.outcome },
                ].map((section) => (
                  <div key={section.label}>
                    <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-indigo-400/80 mb-2">
                      {section.label}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {section.text}
                    </p>
                  </div>
                ))}

                {/* Detailed System Specifications Section */}
                {project.systemOverview && (
                  <div id="technical-details" className="pt-4 border-t border-white/[0.06] space-y-6 scroll-mt-6">
                    <div>
                      <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3">
                        System Overview
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                        {project.systemOverview}
                      </p>
                    </div>

                    {/* Detailed stages */}
                    {project.stages && project.stages.length > 0 && (
                      <div className="space-y-4 pt-2">
                        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-indigo-400 mb-2">
                          The 4-Stage Architecture
                        </h3>
                        <div className="space-y-4">
                          {project.stages.map((stage) => (
                            <div key={stage.title} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-200">{stage.title}</h4>
                                {stage.engine && (
                                  <span className="px-2 py-0.5 text-[9px] font-bold text-indigo-400 bg-indigo-500/10 rounded border border-indigo-500/20">
                                    {stage.engine}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">{stage.description}</p>
                              {stage.bulletPoints && stage.bulletPoints.length > 0 && (
                                <ul className="mt-2.5 space-y-1.5">
                                  {stage.bulletPoints.map((pt, index) => (
                                    <li key={index} className="text-xs text-slate-400 flex items-start gap-1.5">
                                      <span className="text-indigo-400 mt-1 select-none">•</span>
                                      <span>{pt.startsWith("Constraint: ") ? pt.substring(12) : pt.startsWith("Result: ") ? pt.substring(8) : pt}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints & Solutions */}
                    {project.constraints && project.constraints.length > 0 && (
                      <div className="space-y-4 pt-2">
                        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-indigo-400 mb-2">
                          Engineering Constraints & Solutions
                        </h3>
                        <div className="grid grid-cols-1 gap-3.5">
                          {project.constraints.map((c) => (
                            <div key={c.title} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                              <h4 className="text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider">{c.title}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Maintenance Profile */}
                    {project.maintenanceProfile && (
                      <div className="pt-2">
                        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-indigo-400 mb-2.5">
                          Maintenance Profile
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg">
                          {project.maintenanceProfile}
                        </p>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Image Lightbox Overlay */}
      {project && isImageZoomed && (
        <motion.div
          key="project-modal-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsImageZoomed(false)}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <motion.img
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            src={project.thumbnail}
            alt={`${project.title} screenshot full size`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
