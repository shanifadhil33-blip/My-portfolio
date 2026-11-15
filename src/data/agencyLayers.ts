// Content for the agency layer stack. Each layer opens as a two-sided card.
// Proof lines reference only work shown elsewhere on the site.

export type Mode = "whitelabel" | "referral";

export type LayerCard = {
  id: string;
  label: string;
  summary: string;
  take: string[];
  how: string[];
  get: string[];
  proof: string;
};

/** Build layers, bottom to top. All of them are delivered by me in both modes. */
export const engineeringLayers: LayerCard[] = [
  {
    id: "deploy",
    label: "Deployment & operations",
    summary: "Deploying the system, monitoring it and resolving problems after launch.",
    take: [
      "Hosting, domains, environments and CI/CD",
      "Error tracking, logging and alerts",
      "Production troubleshooting when something breaks",
      "Maintenance, dependency and security updates",
    ],
    how: [
      "Deploys run through your accounts, so you keep ownership",
      "Staging first, then production, with a rollback path",
      "Live issues get a written cause and fix",
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
    summary: "Connecting the application to the services it depends on.",
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
    summary: "Business logic, sign in, roles and access control.",
    take: [
      "Server logic, background jobs and webhooks",
      "Sign in, user roles and permissions",
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
      "Assistants that answer from business documents",
      "Agents with tool access and an approval step",
      "Usage limits, provider fallback and logging",
    ],
    how: [
      "Scoped as one feature, not a rebuild",
      "Model output is checked before anyone relies on it",
      "Works with the existing login and data",
    ],
    get: ["A working feature inside the product", "Notes on usage limits and failure cases"],
    proof: "Reclaim and EOB Reader: AI extraction from insurance PDFs, reviewed by a person before export.",
  },
  {
    id: "frontend",
    label: "Frontend",
    summary: "Screens, dashboards and admin panels, built from your design files.",
    take: [
      "Pages and components from Figma or your design system",
      "Dashboards, admin panels and forms with validation",
      "Responsive layouts checked on phone and desktop",
      "Loading, empty and error states, not just the happy path",
    ],
    how: [
      "Your designs stay the source of truth for the look",
      "Built to match them on phone and desktop",
      "You review it on a preview link before it goes live",
    ],
    get: ["Pull requests against your repo", "Screens tested on real devices"],
    proof: "Groundwork and the cleaning price estimator: role-based screens and Arabic right to left layouts.",
  },
];

export const agencyLayer: Record<Mode, LayerCard> = {
  whitelabel: {
    id: "top",
    label: "Working with a team",
    summary: "I join an existing project and work with the people responsible for its requirements and review.",
    take: [
      "I work in your repository and tools",
      "We agree on who reviews the work and answers questions",
      "Scope, decisions and progress are recorded in writing",
    ],
    how: [
      "You share the brief and the designs",
      "I reply in writing with questions and a clear scope",
      "Each milestone is agreed in writing before work starts",
    ],
    get: ["Written progress updates and handover notes", "Code and accounts under the agreed owner"],
    proof: "Repeat work from the same client after the first engagement closed at 5 stars.",
  },
  referral: {
    id: "top",
    label: "Starting a project",
    summary: "An introduction starts with the problem to solve. I discuss the requirements with the people who will use and review the software.",
    take: [
      "You introduce the people and the problem to solve",
      "I scope it in writing before any work starts",
      "We agree on milestones and who approves the work",
    ],
    how: [
      "Nothing starts until the client approves the written scope",
      "I work with the client directly, in writing",
      "You decide how closely you want to be kept in the loop",
    ],
    get: ["A written scope and agreed review points", "Copies of the updates, if you want them"],
    proof: "Repeat work from the same client after the first engagement closed at 5 stars.",
  },
};

export const wholeBuild: LayerCard = {
  id: "whole",
  label: "Complete application",
  summary: "I take the application from requirements through build, testing and deployment, with a written handover.",
  take: [
    "Requirements and architecture",
    "Frontend, backend and database",
    "Integrations and AI features",
    "Deployment, monitoring and handover",
  ],
  how: [
    "Requirements, architecture, build, testing, deployment, improvements",
    "Automated tests on every change, then I use the software myself before you see it",
    "Milestones you approve one at a time",
  ],
  get: ["A deployed application in your accounts", "Documentation and a written handover"],
  proof: "Multi-tenant recommendation platform: delivered across four approved milestones, then rehired for the next phase.",
};
