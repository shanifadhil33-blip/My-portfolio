"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import type { Project } from "@/data/projects";
import ScrollReveal from "./ScrollReveal";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-28 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500 mb-12">
            Projects
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
