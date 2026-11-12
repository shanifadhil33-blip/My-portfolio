// Single source for service content. The homepage, /services and the JSON-LD all read from here,
// so the words a visitor sees and the words a crawler reads stay the same.

export type WorkArea = { id: string; label: string; detail: string };

// Areas a client can hand over on their own or together.
export const workAreas: WorkArea[] = [
  { id: "complete", label: "Complete application", detail: "Scoped from requirements to a deployed, working product." },
  { id: "frontend", label: "Frontend", detail: "Interfaces, dashboards, admin panels and forms that work on every screen." },
  { id: "backend", label: "Backend", detail: "Business logic, background jobs, webhooks and file handling." },
  { id: "apis", label: "APIs", detail: "Designing, building and documenting APIs other systems can rely on." },
  { id: "databases", label: "Databases", detail: "Schemas, migrations, query performance and multi-tenant data models." },
  { id: "integrations", label: "Integrations", detail: "Payments, CRMs, email and third-party services connected properly." },
  { id: "security", label: "Security", detail: "Authentication, roles, tenant isolation and fixing what a review finds." },
  { id: "deployment", label: "Deployment", detail: "Hosting, domains, CI/CD, environments, monitoring and error tracking." },
  { id: "troubleshooting", label: "Troubleshooting", detail: "Investigating production problems and repairing existing systems." },
  { id: "ai", label: "AI agents & features", detail: "Agents, RAG, document extraction, context and memory, human approval steps." },
];

export type Audience = {
  id: string;
  who: string;
  heading: string;
  line: string;
  needs: string[];
  cta: { label: string; href: string };
};

export const audiences: Audience[] = [
  {
    id: "agencies",
    who: "Agencies & consultants",
    heading: "Technical delivery for agencies and consultants.",
    line: "Software for your clients, without hiring engineers.",
    needs: [
      "Portals, dashboards and web apps from your designs",
      "Integrations and AI features your clients ask for",
      "Behind your brand, or by referral",
      "Written updates you can send as your own",
    ],
    cta: { label: "Discuss a partnership", href: "/brief?type=agency" },
  },
  {
    id: "founders",
    who: "Founders",
    heading: "From idea to working software.",
    line: "You bring the idea and the customers. I take responsibility for the software.",
    needs: [
      "A rough idea shaped into a scoped first version",
      "Security, payments and deployment handled properly",
      "A prototype that stopped moving, taken over and finished",
      "Improvements after launch as real users arrive",
    ],
    cta: { label: "Discuss a project", href: "/brief?type=founder" },
  },
  {
    id: "businesses",
    who: "Businesses",
    heading: "Software built around your business.",
    line: "Internal tools, connected systems and AI, around how you already work.",
    needs: [
      "Internal applications and dashboards",
      "Connecting the systems you already use",
      "Automating repetitive, rule-based work",
      "AI features with a person approving the output",
    ],
    cta: { label: "Discuss a project", href: "/brief?type=business" },
  },
];

export type CapabilityGroup = { id: string; title: string; items: string[] };

export type Stage = {
  number: string;
  title: string;
  summary: string;
  groups: CapabilityGroup[];
};

export const stages: Stage[] = [
  {
    number: "01",
    title: "Discover & plan",
    summary: "Business goals, requirements, scope, research, architecture and a roadmap.",
    groups: [
      {
        id: "discovery",
        title: "Discovery and planning",
        items: [
          "Understand the business problem and the constraints",
          "Requirements, scope and a first version",
          "Architecture and technology choices",
          "Risks, dependencies and acceptance criteria",
          "A roadmap and project milestones",
        ],
      },
    ],
  },
  {
    number: "02",
    title: "Design & build",
    summary: "UX and UI, frontend, backend, APIs, databases and user management.",
    groups: [
      {
        id: "frontend",
        title: "UX, UI and frontend",
        items: [
          "User journeys, workflows and wireframes",
          "Responsive interface design and design systems",
          "Frontend development for web applications",
          "Dashboards, admin panels, forms and validation",
          "Accessibility, performance and browser support",
        ],
      },
      {
        id: "backend",
        title: "Backend and database engineering",
        items: [
          "Backend and API development",
          "Database design, schemas and migrations",
          "Business logic, validation and background jobs",
          "Search, file handling and data import and export",
          "Multi-tenant architecture and data synchronisation",
        ],
      },
    ],
  },
  {
    number: "03",
    title: "Connect & automate",
    summary: "Integrations, payments, external services, AI agents and workflows.",
    groups: [
      {
        id: "integrations",
        title: "Integrations and automations",
        items: [
          "Payments, CRMs, email and other business tools",
          "Third-party APIs, webhooks and notifications",
          "Scheduling, cloud storage and event-driven workflows",
          "Workflow automation",
        ],
      },
      {
        id: "ai",
        title: "AI agents and AI systems",
        items: [
          "Custom AI agents and multi-agent systems",
          "Retrieval, knowledge assistants and document extraction",
          "Context, memory, tool calling and human approval",
          "Evaluation, monitoring and usage controls",
          "AI features inside existing applications",
        ],
      },
    ],
  },
  {
    number: "04",
    title: "Secure & test",
    summary: "Access control, security reviews, automated tests, my own hands-on testing and corrections.",
    groups: [
      {
        id: "security",
        title: "Authentication and security",
        items: [
          "Authentication, roles and access control",
          "Multi-tenant data isolation",
          "Sessions, API security and secrets handling",
          "Input validation, rate limiting and abuse prevention",
          "Security reviews, dependency checks and audit logging",
        ],
      },
      {
        id: "testing",
        title: "Testing and quality assurance",
        items: [
          "Unit, integration and end-to-end tests",
          "API, database, permission and tenant isolation tests",
          "Regression, edge cases and error handling",
          "Performance, device and browser checks where needed",
          "AI agent evaluation",
          "I test it myself, then re-test every fix",
        ],
      },
    ],
  },
  {
    number: "05",
    title: "Launch & monitor",
    summary: "Hosting, domains, deployments, logging, monitoring, backups and recovery.",
    groups: [
      {
        id: "deployment",
        title: "Deployment and infrastructure",
        items: [
          "Hosting, domains, DNS and TLS",
          "Development, staging and production environments",
          "CI/CD, migrations, verification and rollback",
          "Cloud infrastructure configuration",
        ],
      },
      {
        id: "monitoring",
        title: "Monitoring, performance and recovery",
        items: [
          "Logging, error tracking and alerts",
          "Performance and availability monitoring",
          "Caching, queues and database optimisation",
          "Backups, restoration tests and recovery planning",
          "Production troubleshooting",
          "AI usage monitoring",
        ],
      },
    ],
  },
  {
    number: "06",
    title: "Improve & support",
    summary: "Maintenance, user feedback, bug fixes, feature updates and continued development.",
    groups: [
      {
        id: "handover",
        title: "Documentation and handover",
        items: [
          "Technical, architecture and API documentation",
          "Deployment and environment setup instructions",
          "Repository, credentials and source ownership",
          "Admin guidance and known limits, written down",
        ],
      },
      {
        id: "maintenance",
        title: "Maintenance and improvements",
        items: [
          "Bug fixes, security and dependency updates",
          "Performance and infrastructure adjustments",
          "Feature and integration updates after launch",
          "Improvements from real user feedback",
        ],
      },
    ],
  },
];

export const TESTING_LINE =
  "Automated tests on every change, then I use the software myself before you see it.";

export const qualitySteps = [
  { title: "Implementation", detail: "Built to the agreed requirements." },
  { title: "Automated checks", detail: "Tests and type checks on every change." },
  { title: "My hands-on review", detail: "I use the software and walk the important journeys." },
  { title: "Corrections", detail: "Problems fixed, then checked again." },
  { title: "Verified delivery", detail: "Delivered with a note of what was tested and any known limits." },
];

// Commitments a client can check me against. Replaces generic "I use AI tools" copy.
export const commitments = [
  "Nothing is called done until I have used it myself.",
  "Every delivery says what was tested, what wasn't, and any known limits.",
  "Problems are reported in writing when I find them, with the fix.",
  "If a project needs more than one engineer, I say so before work starts.",
];

export const engagementTerms = [
  { title: "Agreed milestones", detail: "I deliver a milestone, you review it, then we start the next one." },
  { title: "Written communication", detail: "Every decision is on record and easy to forward." },
  { title: "You own everything", detail: "The code, the accounts and the infrastructure, from day one." },
  { title: "Scoped first", detail: "The work is agreed in writing after I understand what you need." },
];

// Only technologies used in shipped projects or client work.
export const techLayers = [
  { layer: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js"] },
  { layer: "Backend", items: ["Node.js", "Python", "FastAPI", "Auth.js", "Zod"] },
  { layer: "Data", items: ["Postgres", "Supabase", "Neon", "Drizzle", "pgvector", "SQLite"] },
  { layer: "AI", items: ["OpenAI", "Claude", "Gemini", "Groq", "OpenRouter", "Whisper"] },
  { layer: "Infrastructure", items: ["Vercel", "Cloudflare", "Docker", "Render", "GitHub Actions"] },
];
