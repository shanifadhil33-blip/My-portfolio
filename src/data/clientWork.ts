import type { Project } from "@/data/projects";

export const clientProjects: Project[] = [
  {
    id: "recommendation-platform",
    title: "Multi-tenant recommendation platform",
    brief:
      "One codebase that runs many branded comparison sites, each configured and published from an admin panel instead of a new build.",
    tags: ["Row level security", "Multi-tenant", "Admin workflows"],
    hideMedia: true,
    owned: "Database architecture, tenant isolation, admin and publishing workflows, deployment.",
    caseStudy: {
      problem:
        "The client wanted to launch many branded comparison and recommendation websites without a new build each time. Adding a site had to be a setup job in an admin panel, not a coding job.",
      solution:
        "One Next.js and Supabase codebase serving multiple branded sites. A 23 table Postgres schema with row level security on every table, so each tenant only sees its own data. An admin console where an owner with no technical background configures a site, publishes it as a versioned snapshot, activates it, rolls it back or archives it.",
      outcome:
        "Delivered across four milestones, all approved. The owner can set up and publish a full site end to end from the admin panel. He tested it on a new vertical and found no failures in the core flows. Closed at 5 stars and rehired for the next phase.",
    },
    keyDecisions:
      "Tenant isolation enforced in the database with row level security, not only in app code. Published snapshots made unchangeable with a database trigger. Publishing and going live kept as two separate steps, so rollback is simple and an accidental live change is hard. Every schema change written as a reviewed SQL file.",
  },
];

export const namedClientProjects = clientProjects;

export interface ClientCaseStudy {
  id: string;
  client: string;
  title: string;
  summary: string;
  highlights: string[];
  stack: string[];
  relationship: string;
}

export const clientCaseStudies: ClientCaseStudy[] = [
  {
    id: "recommendation-engine",
    client: "A Canadian startup",
    title: "Recommendation flow with cited AI explanations",
    summary: "A few questions, then a shortlist with a plain explanation of why.",
    highlights: [
      "A rules engine picks a shortlist of one to four.",
      "AI explanations cite only verified sources that are still current.",
      "586 passing unit tests.",
    ],
    stack: ["Next.js", "Postgres", "LLM integration", "Error monitoring"],
    relationship:
      "Repeat client. A second contract followed, and it grew when I added another branded site and the cited explanations.",
  },
  {
    id: "vision-screening",
    client: "A UK online eye-care business",
    title: "Vision screening at home, in the browser",
    summary: "A home screening of glasses or lenses for 6/6 vision. Never a diagnosis.",
    highlights: [
      "True size calibration with a bank card, to within one pixel on Chrome, Firefox and Safari.",
      "An ISO Landolt C test for staff, where guessing alone passes one time in 64.",
      "437 unit tests.",
    ],
    stack: ["Next.js", "TypeScript", "Postgres"],
    relationship:
      "Repeat client. I was already working with them on another platform, and after feasibility the work grew into nine milestones, then one more.",
  },
];
