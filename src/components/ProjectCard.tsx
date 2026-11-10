"use client";

import { Project } from "@/data/projects";
import ProjectImage, { CARD_IMAGE_SIZES } from "./ProjectImage";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const canOpen = Boolean(project.caseStudy);
  const isHero = Boolean(project.thumbnail?.startsWith("/screenshots/heroes/"));

  const className = `group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-[var(--card-shadow)] transition duration-300 ${
    canOpen
      ? "cursor-pointer active:bg-foreground/5 [@media(hover:hover)_and_(pointer:fine)]:hover:[transform:perspective(1000px)_rotateX(2deg)_rotateY(-2deg)_translateY(-4px)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-foreground/30"
      : ""
  }`;

  const body = (
    <>
      {!project.hideMedia && project.thumbnail && (
        <div
          className={
            isHero
              ? "aspect-[16/10] overflow-hidden border-b border-border bg-[#f6f5f3]"
              : "overflow-hidden border-b border-border bg-background"
          }
        >
          <ProjectImage
            src={project.thumbnail}
            alt={project.thumbnailAlt ?? `${project.title} screenshot`}
            sizes={CARD_IMAGE_SIZES}
            className={isHero ? "block h-full w-full object-cover" : "block h-auto w-full"}
          />
        </div>
      )}

      <div className="flex flex-grow flex-col justify-between p-5 sm:p-6">
        <div>
          <h3 className="text-lg font-medium text-foreground">{project.title}</h3>
          <p className="mt-2 text-pretty text-base leading-relaxed text-muted">{project.brief}</p>
          {project.owned && (
            <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground">
              <span className="font-medium">What I owned:</span> <span className="text-muted">{project.owned}</span>
            </p>
          )}
          {project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (!canOpen) {
    return (
      <article id={`project-card-${project.id}`} className={className}>
        {body}
      </article>
    );
  }

  return (
    <button id={`project-card-${project.id}`} type="button" onClick={onClick} className={className}>
      {body}
    </button>
  );
}
