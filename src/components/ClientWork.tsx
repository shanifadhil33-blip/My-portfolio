"use client";

import { useState } from "react";
import { clientProjects } from "@/data/clientWork";
import type { Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { UPWORK_URL } from "@/lib/site";

function StarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#C4B59A"
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
}

const review = {
  quote:
    "He successfully designed and built the foundations and administration system for a complex multi-site recommendation platform, taking it from the initial architecture through to a working, versioned publishing system. He is highly capable, thoughtful and exceptionally thorough. He does not simply implement instructions mechanically; he understands the wider commercial objective, identifies potential problems early and proposes sensible, well-reasoned solutions. He takes genuine ownership of the outcome, tests carefully and frequently goes beyond the immediate specification to ensure that the underlying system is secure, scalable and maintainable.",
  attribution: "Client, multi-site recommendation platform (Upwork)",
};

export default function ClientWork() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="client-work" className="relative px-5 py-24 sm:px-6 md:py-40">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-balance text-2xl font-medium tracking-tight text-foreground">
          Client work
        </h2>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted">
          Details are anonymised to respect client confidentiality.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clientProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => {
                if (project.caseStudy) setSelectedProject(project);
              }}
            />
          ))}
        </div>

        <div className="mt-20 md:mt-28">
          <h3 className="text-xl font-medium tracking-tight text-foreground">
            Client reviews
          </h3>

          <figure className="mt-8 max-w-3xl rounded-lg border border-border p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="inline-flex gap-0.5" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIcon key={index} />
                ))}
              </span>
              <p className="text-sm text-muted">5.0</p>
            </div>
            <blockquote className="mt-4 text-pretty text-base leading-relaxed text-foreground">
              {review.quote}
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted">{review.attribution}</figcaption>
          </figure>

          <a
            href={UPWORK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-11 items-center text-base text-accent underline underline-offset-4 transition-colors duration-150 hover:text-accent-hover"
          >
            See all reviews on Upwork
          </a>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
