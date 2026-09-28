"use client";

import { useEffect, useCallback, useState } from "react";
import { Project } from "@/data/projects";
import { X } from "lucide-react";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const labelClass = "mb-2 text-sm font-medium text-muted";
const primaryButtonClass =
  "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-background transition-colors duration-150 hover:bg-accent-hover";
const secondaryButtonClass =
  "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors duration-150 hover:border-accent hover:text-accent";

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const hasGithub = !!(project?.githubUrl && project.githubUrl.trim() !== "");
  const hasLive = !!(project?.liveUrl && project.liveUrl.trim() !== "");

  const handleClose = useCallback(() => {
    setIsImageZoomed(false);
    onClose();
  }, [onClose]);

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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  return (
    <>
      {project && (
        <div
          id="project-modal-overlay"
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
        >
          <div
            className="absolute inset-0 cursor-pointer bg-black/80"
            onClick={handleClose}
            aria-label="Close modal"
          />

          <div
            id="project-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-lg border border-border bg-background sm:rounded-lg"
          >
            <div className="sticky top-0 z-20 flex justify-end p-4 pb-0">
              <button
                id="project-modal-close"
                type="button"
                onClick={handleClose}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border transition-colors duration-150 hover:border-foreground/30"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-5 pt-2 pb-0 sm:px-6">
                {project.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border px-2.5 py-1 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {project.comingSoon && (
                  <span className="mb-3 inline-block rounded-md border border-border px-2 py-1 text-xs text-muted">
                    Coming soon
                  </span>
                )}
                <div className="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
                  <h2
                    id="project-modal-title"
                    className="text-balance text-2xl font-medium tracking-tight text-foreground"
                  >
                    {project.title}
                  </h2>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                    {hasGithub && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={secondaryButtonClass}
                      >
                        View on GitHub
                      </a>
                    )}
                    {hasLive && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={primaryButtonClass}
                      >
                        {project.liveUrlLabel || "Visit Site"}
                      </a>
                    )}
                    {!hasGithub && !hasLive && project.systemOverview && (
                      <button
                        type="button"
                        onClick={() => {
                          document
                            .getElementById("technical-details")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`${primaryButtonClass} cursor-pointer`}
                      >
                        View Specs
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-pretty text-base leading-relaxed text-muted">
                  {project.brief}
                </p>
              </div>

              {project.thumbnail && !project.hideMedia && (
                <button
                  type="button"
                  onClick={() => setIsImageZoomed(true)}
                  className="relative mx-5 mt-6 block aspect-video w-[calc(100%-2.5rem)] cursor-zoom-in overflow-hidden rounded-lg border border-border bg-background text-left sm:mx-6 sm:w-[calc(100%-3rem)]"
                  title="Zoom image"
                >
                  <span className="flex h-full w-full items-center justify-center text-sm text-muted">
                    Main Screenshot
                  </span>
                  <img
                    src={project.thumbnail}
                    alt={`${project.title} main screenshot`}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </button>
              )}

              <div className="space-y-6 p-5 sm:p-6">
                <div className="h-px bg-border" />

                {(project.role || project.methodology) && (
                  <div className="grid grid-cols-1 gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
                    {project.role && (
                      <div>
                        <span className="text-sm font-medium text-muted">Role</span>
                        <p className="mt-1 text-base font-medium text-foreground">{project.role}</p>
                      </div>
                    )}
                    {project.methodology && (
                      <div>
                        <span className="text-sm font-medium text-muted">Methodology</span>
                        <p className="mt-1 text-base font-medium text-foreground">
                          {project.methodology}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {[
                  { label: "Problem", text: project.caseStudy?.problem },
                  { label: "Solution", text: project.caseStudy?.solution },
                  { label: "Outcome", text: project.caseStudy?.outcome },
                ]
                  .filter((section): section is { label: string; text: string } =>
                    Boolean(section.text),
                  )
                  .map((section) => (
                    <div key={section.label}>
                      <h3 className={labelClass}>{section.label}</h3>
                      <p className="text-pretty text-base leading-relaxed text-muted">
                        {section.text}
                      </p>
                    </div>
                  ))}

                {project.techStackDetailed && project.techStackDetailed.length > 0 && (
                  <div>
                    <h3 className={`${labelClass} mb-3`}>Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStackDetailed.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.keyDecisions && (
                  <div>
                    <h3 className={labelClass}>Key Engineering Decisions</h3>
                    <p className="text-pretty text-base leading-relaxed text-muted">
                      {project.keyDecisions}
                    </p>
                  </div>
                )}

                {project.systemOverview && (
                  <div
                    id="technical-details"
                    className="scroll-mt-6 space-y-6 border-t border-border pt-4"
                  >
                    <div>
                      <h3 className={`${labelClass} mb-3`}>System Overview</h3>
                      <p className="text-pretty text-base leading-relaxed whitespace-pre-line text-muted">
                        {project.systemOverview}
                      </p>
                    </div>

                    {project.stages && project.stages.length > 0 && (
                      <div className="space-y-4 pt-2">
                        <h3 className={labelClass}>The 4-Stage Architecture</h3>
                        <div className="space-y-4">
                          {project.stages.map((stage) => (
                            <div
                              key={stage.title}
                              className="rounded-lg border border-border p-4 transition-colors duration-150 hover:border-foreground/25"
                            >
                              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                <h4 className="text-base font-medium text-foreground">
                                  {stage.title}
                                </h4>
                                {stage.engine && (
                                  <span className="rounded border border-border px-2 py-1 text-xs text-muted">
                                    {stage.engine}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm leading-relaxed text-muted">{stage.description}</p>
                              {stage.bulletPoints && stage.bulletPoints.length > 0 && (
                                <ul className="mt-2.5 space-y-1.5">
                                  {stage.bulletPoints.map((pt, index) => (
                                    <li key={index} className="text-sm leading-relaxed text-muted">
                                      {pt.startsWith("Constraint: ")
                                        ? pt.substring(12)
                                        : pt.startsWith("Result: ")
                                          ? pt.substring(8)
                                          : pt}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.constraints && project.constraints.length > 0 && (
                      <div className="space-y-4 pt-2">
                        <h3 className={labelClass}>Engineering Constraints & Solutions</h3>
                        <div className="grid grid-cols-1 gap-3.5">
                          {project.constraints.map((c) => (
                            <div
                              key={c.title}
                              className="rounded-lg border border-border p-4 transition-colors duration-150 hover:border-foreground/25"
                            >
                              <h4 className="mb-1.5 text-sm font-medium text-foreground">{c.title}</h4>
                              <p className="text-sm leading-relaxed text-muted">{c.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.maintenanceProfile && (
                      <div className="pt-2">
                        <h3 className={labelClass}>Maintenance Profile</h3>
                        <p className="rounded-lg border border-border p-3 text-sm leading-relaxed text-muted">
                          {project.maintenanceProfile}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {project?.thumbnail && !project.hideMedia && isImageZoomed && (
        <div
          onClick={() => setIsImageZoomed(false)}
          className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/95 p-4"
        >
          <img
            src={project.thumbnail}
            alt={`${project.title} screenshot full size`}
            className="max-h-[90dvh] max-w-full object-contain"
          />
        </div>
      )}
    </>
  );
}
