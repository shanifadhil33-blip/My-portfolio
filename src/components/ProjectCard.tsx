"use client";

import { useState } from "react";
import { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const canOpen = Boolean(project.caseStudy);

  const className = `group flex h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-background text-left transition-colors duration-150 ${
    canOpen ? "cursor-pointer hover:border-foreground/30" : ""
  }`;

  const body = (
    <>
      {!project.hideMedia && (
        <div className="relative flex aspect-video shrink-0 items-center justify-center overflow-hidden border-b border-border bg-background">
          {!isLoaded && (
            <span className="text-sm text-muted">
              {project.comingSoon ? "Coming soon" : "Screenshot"}
            </span>
          )}

          {project.thumbnail && (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover"
              onLoad={() => setIsLoaded(true)}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>
      )}

      <div className="flex flex-grow flex-col justify-between p-5 sm:p-6">
        <div>
          {project.comingSoon && (
            <span className="mb-3 inline-block rounded-md border border-border px-2 py-1 text-xs text-muted">
              Coming soon
            </span>
          )}
          <h3 className="text-lg font-medium text-foreground">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-base leading-relaxed text-muted">{project.brief}</p>
          {project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
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
    <button
      id={`project-card-${project.id}`}
      type="button"
      onClick={onClick}
      className={className}
    >
      {body}
    </button>
  );
}
