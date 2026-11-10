// Content for the agency layer stack. Each layer opens as a two-sided card.
// Proof lines reference only work shown elsewhere on the site.

export type Mode = "alongside" | "whitelabel";

export type LayerCard = {
  id: string;
  label: string;
  summary: string;
  take: string[];
  how: string[];
  get: string[];
  proof: string;
};

/** Engineering layers, bottom to top. `agencyKeeps` marks layers an agency usually keeps when working alongside. */
export const engineeringLayers: (LayerCard & { agencyKeeps?: boolean })[] = [
  {
    id: "deploy",
    label: "Deployment & operations",
    summary: "Getting the client's system live and keeping it healthy after launch.",
    take: [
      "Hosting, domains, environments and CI/CD",
      "Error tracking, logging and alerts",
      "Production troubleshooting when something breaks",
      "Maintenance, dependency and security updates",
    ],
    how: [
      "Deploys run through your accounts, so you keep ownership",
      "Staging first, then production, with a rollback path",
      "Live issues get a written cause and fix, ready to forward",
    ],
    get: ["Deployment notes and a rollback plan", "Credentials handed over in writing"],
    proof: "A client review on Upwork singles out my credential rotation inventory and deployment notes.",
  },
  {
    id: "data",
    label: "Databases",
    summary: "Data models that stay correct as the product grows.",
    take: [
      "Schema design, relationships and constraints",
      "Migrations written, reviewed and reversible",
      "Tenant isolation enforced in the database",
      "Slow query investigation and fixes",
    ],
    how: [
      "I read the current schema before proposing changes",
      "Every schema change is a reviewed SQL file",
      "Nothing touches production data without your approval",
    ],
    get: ["Migration files with verify and rollback steps", "A short written map of the data model"],
    proof: "Multi-tenant recommendation platform: a 23 table Postgres schema with row level security on every table.",
  },
  {
    id: "integrations",
    label: "APIs & integrations",
    summary: "Connecting the client's system to the services it depends on.",
    take: [
      "Payment gateways and payment verification",
      "CRMs, email and scheduling tools",
      "Webhooks and data sync between systems",
      "APIs designed and documented for other teams",
    ],
    how: [
      "Each integration gets retries and clear error handling",
      "Secrets live in environment settings, never in code",
      "Tested against the provider's sandbox before going live",
    ],
    get: ["Working integrations with failure handling", "API documentation your team can use"],
    proof: "Scheduled pipelines and a cold email agent that call third-party APIs on a timetable.",
  },
  {
    id: "backend",
    label: "Backend & security",
    summary: "Business logic, sign-in and roles, and the security around them.",
    take: [
      "Server logic, background jobs and webhooks",
      "Sign-in, user roles and permissions",
      "Security review of an existing app, then the fixes",
      "Rate limits and abuse protection",
    ],
    how: [
      "I work in your codebase and follow its conventions",
      "Changes go through your pull request review",
      "Security findings are written up before anything is changed",
    ],
    get: ["Tested endpoints and jobs", "A written list of findings and what was fixed"],
    proof: "Multi-tenant recommendation platform: admin and publishing workflows with tenant isolation and versioned snapshots.",
  },
  {
    id: "ai",
    label: "AI features",
    summary: "AI added to a product that already exists, with a person in control.",
    take: [
      "Document reading and structured data extraction",
      "Assistants that answer from the client's own documents",
      "Agents with tool access and an approval step",
      "Cost limits, provider fallback and logging",
    ],
    how: [
      "Scoped as one feature, not a rebuild",
      "Model output is checked before anyone relies on it",
      "Works with the client's existing login and data",
    ],
    get: ["A working feature inside the product", "Notes on cost, limits and failure cases"],
    proof: "Reclaim and EOB Reader: AI extraction from insurance PDFs, reviewed by a person before export.",
  },
  {
    id: "frontend",
    label: "Frontend",
    summary: "Screens, dashboards and admin panels, built from your designer's files.",
    take: [
      "Pages and components from Figma or your design system",
      "Dashboards, admin panels and forms with validation",
      "Responsive layouts checked on phone and desktop",
      "Loading, empty and error states, not just the happy path",
    ],
    how: [
      "Your designer stays the source of truth for the look",
      "Built inside your component library",
      "Or keep frontend in house and I build what sits under it",
    ],
    get: ["Pull requests against your repo", "Screens tested on real devices"],
    proof: "Groundwork and the cleaning price estimator: role-based screens and Arabic right to left layouts.",
    agencyKeeps: true,
  },
];

export const agencyLayer: Record<Mode, LayerCard> = {
  alongside: {
    id: "top",
    label: "Your agency team",
    summary: "Design, client contact and project management stay with your team.",
    take: [
      "You own the client relationship",
      "You set priorities, I report into your process",
      "Your designers and PMs stay the source of truth",
    ],
    how: [
      "You share the scope or give me access to the codebase",
      "I reply in writing with questions and a milestone plan",
      "Fixed price per milestone, funded before work starts",
    ],
    get: ["Written updates you can forward to the client", "Code in your repo from day one"],
    proof: "Repeat work from the same client after the first engagement closed at 5 stars.",
  },
  whitelabel: {
    id: "top",
    label: "Your brand",
    summary: "The client sees your agency only. I work underneath, under your name.",
    take: [
      "I work in your tools and under your name",
      "No contact with your client unless you want it",
      "Your relationship and your margin stay yours",
    ],
    how: [
      "You share the scope or give me access to the codebase",
      "I reply in writing with questions and a milestone plan",
      "Fixed price per milestone, funded before work starts",
    ],
    get: ["Updates written so you can send them as your own", "Code and accounts in your name"],
    proof: "Repeat work from the same client after the first engagement closed at 5 stars.",
  },
};

export const wholeBuild: LayerCard = {
  id: "whole",
  label: "Complete application",
  summary: "Every layer in this stack, from one engineer, scoped from your requirements to a deployed product.",
  take: [
    "Requirements and architecture",
    "Frontend, backend and database",
    "Integrations and AI features",
    "Deployment, monitoring and handover",
  ],
  how: [
    "Requirements, architecture, build, testing, deployment, improvements",
    "Automated testing by my AI agents, followed by my own hands-on testing and final review",
    "Milestones you approve one at a time",
  ],
  get: ["A deployed application in your accounts", "Documentation and a written handover"],
  proof: "Multi-tenant recommendation platform: delivered across four approved milestones, then rehired for the next phase.",
};
