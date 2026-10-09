"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { Project } from "@/data/projects";
import { ChevronDown, X } from "lucide-react";
import ProjectImage, { MODAL_IMAGE_SIZES } from "./ProjectImage";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

function altForShot(project: Project, src: string, index: number, total: number): string {
  const specific = project.caseStudy?.screenshotAlts?.[src];
  if (specific) return specific;
  if (total === 1) return `${project.title} main screenshot`;
  return `${project.title} screenshot ${index + 1}`;
}

function imagesForModal(project: Project): string[] {
  if (project.hideMedia) return [];
  const shots = (project.caseStudy?.screenshots ?? []).filter((src) => src.trim() !== "");
  if (!project.thumbnail) return shots;
  if (shots.includes(project.thumbnail)) return shots;
  return [project.thumbnail, ...shots];
}

function hasTechnicalDetails(project: Project): boolean {
  return Boolean(
    (project.techStackDetailed && project.techStackDetailed.length > 0) ||
      project.keyDecisions ||
      project.systemOverview ||
      (project.stages && project.stages.length > 0) ||
      (project.constraints && project.constraints.length > 0) ||
      project.maintenanceProfile,
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, summary, [tabindex]:not([tabindex="-1"])';

function focusableIn(root: ParentNode | null): HTMLElement[] {
  if (!root) return [];
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1,
  );
}

const labelClass = "mb-2 text-sm font-medium text-muted";
const primaryButtonClass =
  "inline-flex min-h-11 w-full shrink-0 cursor-pointer items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-background transition-colors duration-150 hover:bg-accent-hover active:bg-accent-pressed sm:w-auto";
const secondaryButtonClass =
  "inline-flex min-h-11 w-full shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors duration-150 hover:border-foreground/30 active:border-foreground/40 active:bg-foreground/5 sm:w-auto";

const plainSections = [
  { key: "problem" as const, label: "Who it's for and the problem" },
  { key: "solution" as const, label: "What it does" },
  { key: "outcome" as const, label: "What you get" },
];

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const zoomCloseRef = useRef<HTMLButtonElement>(null);

  const hasGithub = !!(project?.githubUrl && project.githubUrl.trim() !== "");
  const hasLive = !!(project?.liveUrl && project.liveUrl.trim() !== "");
  const modalImages = project ? imagesForModal(project) : [];
  const showTechnical = project ? hasTechnicalDetails(project) : false;
  const plain = plainSections
    .map((section) => ({
      label: section.label,
      text: project?.caseStudy?.[section.key],
    }))
    .filter((section): section is { label: string; text: string } => Boolean(section.text));

  const handleClose = useCallback(() => {
    setZoomedSrc(null);
    onClose();
  }, [onClose]);

  const openTechnicalDetails = useCallback(() => {
    const details = document.getElementById("technical-details");
    if (!(details instanceof HTMLDetailsElement)) return;
    details.open = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      details.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  }, []);

  useEffect(() => {
    if (!project) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.getElementById("project-modal-close")?.focus();
    return () => {
      document.body.style.overflow = previous;
      returnFocus.current?.focus();
    };
  }, [project]);

  useEffect(() => {
    if (zoomedSrc) zoomCloseRef.current?.focus();
  }, [zoomedSrc]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (zoomedSrc) {
          setZoomedSrc(null);
          return;
        }
        if (project) handleClose();
        return;
      }
      if (event.key !== "Tab") return;
      const root = zoomedSrc
        ? document.getElementById("screenshot-zoom")
        : document.getElementById("project-modal-content");
      const nodes = focusableIn(root);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose, project, zoomedSrc]);

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
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-lg border border-border bg-background sm:rounded-lg"
          >
            <div className="flex justify-end p-4 pb-0">
              <button
                id="project-modal-close"
                type="button"
                onClick={handleClose}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border transition-colors duration-150 hover:border-foreground/30 active:border-foreground/40 active:bg-foreground/5"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="scrollbar-none flex-1 overflow-y-auto">
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
                    {showTechnical && (hasGithub || hasLive) && (
                      <button type="button" onClick={openTechnicalDetails} className={secondaryButtonClass}>
                        Technical details
                      </button>
                    )}
                    {showTechnical && !hasGithub && !hasLive && (
                      <button type="button" onClick={openTechnicalDetails} className={primaryButtonClass}>
                        View Specs
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-pretty text-base leading-relaxed text-muted">{project.brief}</p>
              </div>

              {modalImages.length > 0 && (
                <div className="mx-5 mt-6 space-y-4 sm:mx-6">
                  {modalImages.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setZoomedSrc(src)}
                      className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-border bg-background text-left transition-colors duration-150 active:border-foreground/40 [@media(hover:hover)_and_(pointer:fine)]:hover:border-foreground/30"
                      title="Zoom image"
                    >
                      <ProjectImage
                        src={src}
                        alt={altForShot(project, src, index, modalImages.length)}
                        sizes={MODAL_IMAGE_SIZES}
                        className="block h-auto w-full"
                      />
                    </button>
                  ))}
                </div>
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
                        <p className="mt-1 text-base font-medium text-foreground">{project.methodology}</p>
                      </div>
                    )}
                  </div>
                )}

                {plain.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-base font-medium text-foreground">In plain words</h3>
                    {plain.map((section) => (
                      <div key={section.label}>
                        <h4 className={labelClass}>{section.label}</h4>
                        <p className="text-pretty text-base leading-relaxed text-muted">{section.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {showTechnical && (
                  <details id="technical-details" className="hood-panel scroll-mt-4 rounded-lg border border-border">
                    <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left text-base font-medium text-foreground transition-colors duration-150 active:bg-foreground/5 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/5">
                      <span className="text-pretty">Under the hood: stack, architecture and trade-offs</span>
                      <ChevronDown className="hood-chevron shrink-0" size={16} aria-hidden />
                    </summary>
                    <div className="space-y-6 border-t border-border px-4 py-5">
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

                      {project.systemOverview && (
                        <div>
                          <h3 className={`${labelClass} mb-3`}>System Overview</h3>
                          <p className="text-pretty text-base leading-relaxed whitespace-pre-line text-muted">
                            {project.systemOverview}
                          </p>
                        </div>
                      )}

                      {project.stages && project.stages.length > 0 && (
                        <div className="space-y-4">
                          <h3 className={labelClass}>Pipeline</h3>
                          <div className="space-y-4">
                            {project.stages.map((stage) => (
                              <div key={stage.title} className="rounded-lg border border-border p-4">
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                  <h4 className="text-base font-medium text-foreground">{stage.title}</h4>
                                  {stage.engine && (
                                    <span className="rounded border border-border px-2 py-1 text-xs text-muted">
                                      {stage.engine}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm leading-relaxed text-muted">{stage.description}</p>
                                {stage.bulletPoints && stage.bulletPoints.length > 0 && (
                                  <ul className="mt-2.5 space-y-1.5">
                                    {stage.bulletPoints.map((point, index) => (
                                      <li key={index} className="text-sm leading-relaxed text-muted">
                                        {point.startsWith("Constraint: ")
                                          ? point.substring(12)
                                          : point.startsWith("Result: ")
                                            ? point.substring(8)
                                            : point}
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
                        <div className="space-y-4">
                          <h3 className={labelClass}>Reliability and safety</h3>
                          <div className="grid grid-cols-1 gap-3.5">
                            {project.constraints.map((constraint) => (
                              <div key={constraint.title} className="rounded-lg border border-border p-4">
                                <h4 className="mb-1.5 text-sm font-medium text-foreground">{constraint.title}</h4>
                                <p className="text-sm leading-relaxed text-muted">{constraint.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.keyDecisions && (
                        <div>
                          <h3 className={labelClass}>Key decisions and trade-offs</h3>
                          <p className="text-pretty text-base leading-relaxed text-muted">{project.keyDecisions}</p>
                        </div>
                      )}

                      {project.maintenanceProfile && (
                        <div>
                          <h3 className={labelClass}>Maintenance Profile</h3>
                          <p className="rounded-lg border border-border p-3 text-sm leading-relaxed text-muted">
                            {project.maintenanceProfile}
                          </p>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {project && zoomedSrc && (
        <div
          id="screenshot-zoom"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} screenshot`}
          onClick={() => setZoomedSrc(null)}
          className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/95 p-4"
        >
          <button
            ref={zoomCloseRef}
            type="button"
            onClick={() => setZoomedSrc(null)}
            className="absolute top-4 right-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors duration-150 hover:border-foreground/30 active:border-foreground/40 active:bg-foreground/5"
            aria-label="Close screenshot"
          >
            <X size={16} />
          </button>
          <div className="max-h-[90dvh] max-w-full" onClick={(event) => event.stopPropagation()}>
            <ProjectImage
              src={zoomedSrc}
              alt={
                project.caseStudy?.screenshotAlts?.[zoomedSrc] ??
                `${project.title} screenshot full size`
              }
              sizes="90vw"
              className="block h-auto max-h-[90dvh] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
