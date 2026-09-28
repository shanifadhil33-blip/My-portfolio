import type { Project } from "@/data/projects";

export const clientProjects: Project[] = [
  {
    id: "recommendation-platform",
    title: "Multi-tenant recommendation platform",
    brief:
      "Database architecture, tenant isolation with row-level security, admin and publishing workflows, deployment.",
    tags: ["Row-level security", "Multi-tenant", "Admin workflows"],
    hideMedia: true,
    caseStudy: {
      problem:
        "The client wanted to launch many branded comparison and recommendation websites without paying for a new build each time. Adding a site had to be a setup job in an admin panel, not a coding job.",
      solution:
        "One Next.js and Supabase codebase serving multiple branded sites. A 23-table Postgres schema with row-level security on every table, so each tenant only sees its own data. An admin console where a non-technical owner configures a site, publishes it as a versioned snapshot, activates it, rolls it back or archives it.",
      outcome:
        "Delivered across four milestones, all approved. The owner can set up and publish a full site end to end from the admin panel. He tested it on a new vertical and found no failures in the core flows. Closed at 5 stars and rehired for the next phase.",
    },
    keyDecisions:
      "Tenant isolation enforced in the database with row-level security, not only in app code. Published snapshots made unchangeable with a database trigger. Publishing and going live kept as two separate steps, so rollback is simple and an accidental live change is hard. Every schema change written as a reviewed SQL file.",
  },
];

export const namedClientProjects = clientProjects;
