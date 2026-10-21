import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      images: [...new Set(projects.flatMap((project) =>
        project.hideMedia ? [] : [project.thumbnail, ...(project.caseStudy?.screenshots ?? [])]
          .filter((src): src is string => Boolean(src))
          .map((src) => new URL(src, SITE_URL).href),
      ))],
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/brief`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
