"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import type { Project } from "@/data/projects";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div id="projects" className="scroll-mt-20">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">
          Personal projects
        </h3>
        <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted">
          Live apps and working prototypes. Open a project for the problem, the build and the decisions behind it.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => {
                if (project.caseStudy) setSelectedProject(project);
              }}
            />
          ))}
        </div>
      </div>

      <div className="zone-dark contents">
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </div>
  );
}
