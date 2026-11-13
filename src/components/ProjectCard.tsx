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
          {project.underTheHood?.some((point) => point.cardDescription) && (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium text-muted">Under the hood</h4>
              <ul className="space-y-3">
                {project.underTheHood.filter((point) => point.cardDescription).map((point) => (
                  <li key={point.title} className="text-pretty text-sm leading-relaxed text-muted">
                    <span className="font-medium text-foreground">{point.title}:</span>{" "}
                    {point.cardDescription}
                  </li>
                ))}
              </ul>
            </div>
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

  if (project.showLiveOnCard && project.liveUrl) {
    return (
      <article id={`project-card-${project.id}`} className={className}>
        <button type="button" onClick={onClick} className="flex w-full flex-grow cursor-pointer flex-col text-left">
          {body}
        </button>
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors duration-150 hover:border-foreground/30 active:border-foreground/40 active:bg-foreground/5"
          >
            {project.liveUrlLabel || "Visit Site"}
          </a>
        </div>
      </article>
    );
  }

  return (
    <button id={`project-card-${project.id}`} type="button" onClick={onClick} className={className}>
      {body}
    </button>
  );
}
