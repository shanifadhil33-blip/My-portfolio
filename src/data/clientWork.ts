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
    client: "Canadian startup",
    title: "Recommendation engine with cited AI explanations",
    summary:
      "The public recommendation flow for a multi site platform. Visitors answer a few questions and get a shortlist of one to four specialist providers, with a plain explanation of why.",
    highlights: [
      "A pure rules engine picks the shortlist, and prices never affect it",
      "AI explanations cite only verified, current sources, and the server checks every answer before it is shown",
      "Row level security on every table, with 31 reviewed migrations that each have a rollback",
      "586 passing unit tests",
    ],
    stack: ["Next.js", "Supabase Postgres", "OpenAI", "Sentry", "Vercel"],
    relationship:
      "Repeat client. The first contract closed with a 5.0 review, and he hired me again for this work, which grew when he added a second branded site.",
  },
  {
    id: "vision-screening",
    client: "UK online eye care business",
    title: "At home vision screening in the browser",
    summary:
      "Customers check at home whether their glasses or lenses still give 6/6 vision, with the laptop as the chart and the phone as the answer pad. Screening only, never a diagnosis.",
    highlights: [
      "True size letters on any laptop, calibrated with a bank card, within one screen pixel on Chrome, Firefox and Safari",
      "Laptop and phone paired by QR code and kept in sync, with answers safe to resend",
      "ISO standard Landolt C test, where pure guessing passes a size 1 time in 64",
      "Feasibility prototype delivered on the deadline day, and 437 unit tests",
    ],
    stack: ["Next.js", "TypeScript", "Supabase Postgres", "Vercel"],
    relationship:
      "Repeat client. We were already working together on another platform, and after a signed off feasibility phase the work grew into nine more milestones.",
  },
];
