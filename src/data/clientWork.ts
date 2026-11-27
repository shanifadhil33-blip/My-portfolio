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

export interface ClientCaseSection {
  label: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface ClientCaseStudy {
  id: string;
  client: string;
  title: string;
  summary: string;
  highlights: string[];
  stack: string[];
  relationship: string;
  sections: ClientCaseSection[];
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
    sections: [
      {
        label: "The ask",
        paragraphs: [
          "A small Canadian startup that earns from customer leads and paid advice. The founder wanted one platform to run many branded recommendation sites.",
          "Visitors answer a few questions, get a shortlist with a plain explanation, and are passed to specialist providers. The first site covered international company setup, with more verticals planned.",
        ],
      },
      {
        label: "What made it hard",
        bullets: [
          "Many sites from one codebase and one database, each set up in the admin panel, never in code.",
          "Branching questionnaires frozen into versioned publications, so a live site never changes mid edit.",
          "Rules that can't let one factor dominate the shortlist, or be stricter than the real regulations.",
          "AI explanations limited to verified, in date sources, with a plain fallback when the evidence is thin.",
        ],
      },
      {
        label: "What I owned",
        paragraphs: [
          "Architecture, milestone scoping, database design and every migration, security, the build, testing, deployment, and all client communication in writing.",
          "Every production account stayed in the client's name.",
        ],
      },
      {
        label: "How it works",
        bullets: [
          "A site is a database row plus configuration. Publishing freezes it into an immutable snapshot, and activating picks the live version.",
          "A pure rules engine picks a shortlist of one to four, and prices never affect it.",
          "The AI only explains what the rules picked, and the server checks every answer for citations, outside countries, prices and links before it is shown, recording which sources were used.",
          "Row level security on every table, and every schema change was a reviewed SQL file with preflight, verify and rollback.",
          "An all or nothing data importer flags bad rows instead of quietly fixing them.",
        ],
      },
      {
        label: "What was delivered",
        paragraphs: [
          "Multi site architecture, database, admin and publishing, then production hardening, the public recommendation flow, rules and supplier integration, and a knowledge library with AI explanations.",
          "Every milestone accepted. 31 migrations and 586 passing unit tests.",
        ],
      },
      {
        label: "Working together",
        paragraphs: [
          "The founder tested every release himself on laptop and phone, against principles he set in writing, and I reported every step in writing.",
          "The first contract closed with a 5.0 review. A second contract followed and grew as he added a second branded site and the cited explanations. He wants to keep me on the technical and integration side.",
        ],
      },
    ],
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
    sections: [
      {
        label: "The ask",
        paragraphs: [
          "A UK online eye care business run by a qualified optometrist. He wanted customers to check at home, in a browser, whether their glasses or lenses still give 6/6 vision.",
          "Screening, never diagnosis. Feasibility first, then small steps.",
        ],
      },
      {
        label: "What made it hard",
        bullets: [
          "Letters must be true physical size on any screen, so each laptop is calibrated with a bank card.",
          "Two devices work together: the laptop shows the chart and the phone is the answer pad, paired by QR code and kept in sync.",
          "Every clinical rule came from the client: progression, stopping, scoring, result wording and record retention.",
          "Edge cases like zoom, tab switching, reloads mid test, and screens too coarse for the smallest letters.",
          "The feasibility phase had a 15 day deadline.",
        ],
      },
      {
        label: "What I owned",
        paragraphs: [
          "Architecture and every technical decision, scoping, client communication, database migrations, deployment, and real device testing at taped distances.",
        ],
      },
      {
        label: "How it works",
        paragraphs: [
          "Next.js and TypeScript with Postgres in a private schema, reachable only through narrow database functions with row level security. The server owns session state, and answers are safe to resend. Letter size is pure maths from the calibration, pinned by unit tests.",
          "When online results beat a paper chart, we ruled out size first (his calipers matched within 0.1 to 0.2 mm), then I built an ISO standard Landolt C comparison test where pure guessing passes a size one time in 64.",
        ],
      },
      {
        label: "What was delivered",
        bullets: [
          "A feasibility prototype on the deadline day, with calibration signed off in writing.",
          "A free public quick test with card calibration, phone pairing, 3 or 2 metre setup, automatic start and the agreed result wording.",
          "Letter sizes within one screen pixel on Chrome, Firefox and Safari.",
          "A staff only Landolt C test with full records.",
          "Phone camera movement detection is built and in testing, at about 1 cm accuracy at 2 metres.",
          "437 unit tests.",
        ],
      },
      {
        label: "Working together",
        paragraphs: [
          "We were already working together on a separate web platform when he hired me for this. Every clinical rule was agreed with him in writing before I built it.",
          "After the feasibility sign off, the work grew into nine milestones, then one more he asked for mid build.",
        ],
      },
    ],
  },
];
