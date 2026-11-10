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
      "Connecting the systems you already pay for",
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
          "Understanding the business problem",
          "Requirements gathering and scoping",
          "Technical feasibility analysis",
          "Feature prioritisation and product roadmap",
          "Project milestones",
          "User stories and acceptance criteria",
          "System architecture",
          "Technology selection and technical research",
          "Project risks and dependencies",
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
          "Frontend development and interactive applications",
          "Dashboards and admin panels",
          "Forms and validation",
          "Accessibility considerations",
          "Cross-browser compatibility",
          "Frontend performance and SEO where relevant",
        ],
      },
      {
        id: "backend",
        title: "Backend and database engineering",
        items: [
          "Backend and API development",
          "Database design, schemas and relationships",
          "Business logic and data validation",
          "Background jobs, scheduled tasks and webhooks",
          "Data processing, search and filtering",
          "File handling and data import and export",
          "Query optimisation and database migrations",
          "Multi-tenant architecture",
          "Data synchronisation",
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
          "Payment gateways and payment verification",
          "Third-party APIs and external services",
          "Email, CRM and business software integrations",
          "Scheduling systems and cloud storage",
          "Workflow automation and event-driven workflows",
          "Webhook processing and notifications",
        ],
      },
      {
        id: "ai",
        title: "AI agents and AI systems",
        items: [
          "Custom AI agents and multi-agent systems",
          "Retrieval-augmented generation and knowledge assistants",
          "Document processing and structured data extraction",
          "Context engineering, memory and tool calling",
          "Safe agent permissions and human approval steps",
          "Agent evaluation, testing and monitoring",
          "AI usage and cost controls",
          "AI features inside existing applications",
        ],
      },
    ],
  },
  {
    number: "04",
    title: "Secure & test",
    summary: "Access control, security reviews, automated agent testing, my own hands-on testing and corrections.",
    groups: [
      {
        id: "security",
        title: "Authentication and security",
        items: [
          "Authentication, user roles and role-based permissions",
          "Authorisation and access control",
          "Multi-tenant data isolation",
          "Secure sessions and API security",
          "Secrets management and input validation",
          "Security reviews and dependency vulnerability checks",
          "Rate limiting and abuse prevention",
          "Audit logging where needed",
          "Privacy-conscious architecture",
        ],
      },
      {
        id: "testing",
        title: "Testing and quality assurance",
        items: [
          "Unit, integration and end-to-end testing",
          "API, database and authentication testing",
          "Permission and tenant isolation testing",
          "Regression and edge-case testing",
          "Performance testing where needed",
          "Cross-device and cross-browser testing",
          "AI agent evaluation",
          "Error handling verification",
          "Bug fixing and re-testing after corrections",
          "Final hands-on review by me",
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
          "Hosting, domains, DNS and SSL/TLS",
          "Development, staging and production environments",
          "CI/CD and automated build pipelines",
          "Database migrations on release",
          "Deployment verification and rollback procedures",
          "Cloud infrastructure configuration",
        ],
      },
      {
        id: "monitoring",
        title: "Monitoring, performance and recovery",
        items: [
          "Logging, error tracking and alerts",
          "Performance and availability monitoring",
          "Caching and database optimisation",
          "Queue and job reliability, retries and failure handling",
          "AI agent and resource cost monitoring",
          "Database backups and restoration testing",
          "Recovery workflows and failure planning",
          "Production troubleshooting",
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
          "Repository handover and source code ownership",
          "Administrator and user guidance where needed",
          "Secure credentials handover",
          "Known limitations, written down",
        ],
      },
      {
        id: "maintenance",
        title: "Maintenance and improvements",
        items: [
          "Bug fixes, security and dependency updates",
          "Performance improvements",
          "Feature enhancements and integration updates",
          "User feedback and post-launch improvements",
          "Scaling and infrastructure adjustments",
          "Ongoing AI system improvements",
        ],
      },
    ],
  },
];

export const TESTING_LINE =
  "Automated testing by my AI agents, followed by my own hands-on testing and final review.";

export const qualitySteps = [
  { title: "Implementation", detail: "Built to the agreed requirements." },
  { title: "Automated checks", detail: "Tests, type checks and reviews run by my AI agents." },
  { title: "My hands-on review", detail: "I use the software and walk the important journeys." },
  { title: "Corrections", detail: "Problems fixed, then checked again." },
  { title: "Verified delivery", detail: "Reviewed against the acceptance criteria." },
];

export const engagementTerms = [
  { title: "Fixed price milestones", detail: "You fund a milestone, I deliver it, you approve it." },
  { title: "Written communication", detail: "Every decision is on record and easy to forward." },
  { title: "You own everything", detail: "The code, the accounts and the infrastructure, from day one." },
  { title: "Priced by scope", detail: "Pricing is set after I understand what you need." },
];

// Only technologies used in shipped projects or client work.
export const techLayers = [
  { layer: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js"] },
  { layer: "Backend", items: ["Node.js", "Python", "FastAPI", "Auth.js", "Zod"] },
  { layer: "Data", items: ["Postgres", "Supabase", "Neon", "Drizzle", "pgvector", "SQLite"] },
  { layer: "AI", items: ["OpenAI", "Claude", "Gemini", "Groq", "OpenRouter", "Whisper"] },
  { layer: "Infrastructure", items: ["Vercel", "Cloudflare", "Docker", "Render", "GitHub Actions"] },
];
