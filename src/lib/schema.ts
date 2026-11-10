// Schema.org graph. Every node describes something visible on the page it appears on.
// No ratings, reviews, organisation or business claims: this is one person's portfolio.
import { projects } from "@/data/projects";
import { stages } from "@/data/services";
import {
  GITHUB_URL,
  LINKEDIN_URL,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  ROLE,
  SITE_NAME,
  SITE_URL,
  UPWORK_URL,
} from "@/lib/site";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const abs = (path: string) => new URL(path, SITE_URL).href;

/** Site-wide identity: the person and the website. Rendered once in the root layout. */
export function baseGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Adhil Shanif",
        url: SITE_URL,
        image: abs("/adhil-portrait.jpg"),
        jobTitle: ROLE,
        description: PAGE_DESCRIPTION,
        address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
        sameAs: [LINKEDIN_URL, GITHUB_URL, UPWORK_URL],
        knowsAbout: [
          "Custom software development",
          "Full-stack web development",
          "Backend development",
          "API development",
          "Database design",
          "Multi-tenant SaaS architecture",
          "Systems integration",
          "Workflow automation",
          "AI agents",
          "Retrieval-augmented generation",
          "Document data extraction",
          "Deployment and monitoring",
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description: PAGE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
    ],
  };
}

/** Homepage: a profile page about the person, plus the publicly reachable projects. */
export function homeGraph() {
  const publicProjects = projects.filter((p) => p.liveUrl || p.githubUrl);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": PERSON_ID },
        primaryImageOfPage: abs("/adhil-portrait.jpg"),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#projects`,
        name: "Personal software projects",
        itemListElement: publicProjects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.title,
            description: p.brief,
            url: p.liveUrl ?? p.githubUrl,
            ...(p.thumbnail && !p.hideMedia ? { image: abs(p.thumbnail) } : {}),
            ...(p.githubUrl ? { codeRepository: p.githubUrl } : {}),
            keywords: p.tags.join(", "),
            creator: { "@id": PERSON_ID },
          },
        })),
      },
    ],
  };
}

/** /services: the service, its stages as an offer catalogue, and the breadcrumb. */
export function servicesGraph(description: string) {
  const url = `${SITE_URL}/services`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: "Software development services",
        description,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: "Software development and technical delivery",
        serviceType: "Custom software development",
        description,
        url,
        provider: { "@id": PERSON_ID },
        audience: [
          { "@type": "BusinessAudience", audienceType: "Software agencies and consultants" },
          { "@type": "BusinessAudience", audienceType: "Founders" },
          { "@type": "BusinessAudience", audienceType: "Businesses" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Software development lifecycle",
          itemListElement: stages.map((stage) => ({
            "@type": "OfferCatalog",
            name: stage.title,
            description: stage.summary,
            itemListElement: stage.groups.map((g) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: g.title, description: g.items.join("; ") },
            })),
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: url },
        ],
      },
    ],
  };
}
