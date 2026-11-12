import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

// Dates of real content changes. Update the date when a page's content changes;
// do not use the build time, which would claim every page changed on every deploy.
const UPDATED = {
  home: "2026-11-11",
  services: "2026-11-11",
  brief: "2026-11-11",
  partners: "2026-11-11",
  privacy: "2026-10-12",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const projectImages = [
    ...new Set(
      projects.flatMap((project) =>
        project.hideMedia
          ? []
          : [project.thumbnail, ...(project.caseStudy?.screenshots ?? [])]
              .filter((src): src is string => Boolean(src))
              .map((src) => new URL(src, SITE_URL).href),
      ),
    ),
  ];

  return [
    {
      url: SITE_URL,
      lastModified: UPDATED.home,
      images: [new URL("/adhil-portrait.jpg", SITE_URL).href, ...projectImages],
    },
    { url: `${SITE_URL}/services`, lastModified: UPDATED.services },
    { url: `${SITE_URL}/brief`, lastModified: UPDATED.brief },
    { url: `${SITE_URL}/partners`, lastModified: UPDATED.partners },
    { url: `${SITE_URL}/privacy`, lastModified: UPDATED.privacy },
  ];
}
