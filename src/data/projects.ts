import { projectLinks } from "./links";

export interface Project {
  id: string;
  title: string;
  brief: string;
  tags: string[];
  thumbnail: string;
  githubUrl?: string;
  liveUrl?: string;
  liveUrlLabel?: string;
  caseStudy: {
    problem: string;
    solution: string;
    outcome: string;
    screenshots?: string[];
  };
  role?: string;
  methodology?: string;
  techStackDetailed?: string[];
  systemOverview?: string;
  stages?: { title: string; engine?: string; description?: string; bulletPoints?: string[] }[];
  constraints?: { title: string; description: string }[];
  maintenanceProfile?: string;
}

const baseProjects: Project[] = [
  {
    id: "reclaim",
    title: "Reclaim",
    liveUrlLabel: "Visit Web Application",
    brief:
      "An AI-powered SaaS that parses medical insurance documents, flags claim errors, and autonomously drafts appeal letters for denied bills.",
    tags: ["Next.js", "PDF Parsing", "LLM APIs", "Supabase"],
    thumbnail: "/screenshots/reclaim-thumb.png",
    caseStudy: {
      problem:
        "Medical billing teams waste countless hours manually reviewing complex Explanation of Benefits (EOB) PDFs to spot denials and writing custom appeal letters from scratch.",
      solution:
        "Built an automated parsing engine that extracts structured billing data from insurance documents, combined with an AI agent that analyzes the denial reasons and generates highly contextualized appeal letters.",
      outcome:
        "A streamlined extraction and appeals pipeline that dramatically accelerates the claim resolution process.",
      screenshots: [
        "/screenshots/reclaim-1.png",
        "/screenshots/reclaim-2.png",
        "/screenshots/reclaim-3.png",
      ],
    },
  },
  {
    id: "eob-reader",
    title: "EOB Reader",
    liveUrlLabel: "Visit Web Application",
    brief:
      "An AI tool that parses medical insurance documents to extract billing data and identify claim denials.",
    tags: ["Next.js", "PDF Parsing", "LLM APIs", "Supabase"],
    thumbnail: "/screenshots/eob-reader-thumb.png",
    caseStudy: {
      problem:
        "Medical billing teams waste hours manually reviewing complex Explanation of Benefits (EOB) PDFs to spot claim denials.",
      solution:
        "Built an automated parsing engine that reads insurance documents, extracts structured billing data, and flags denials for immediate review.",
      outcome:
        "A streamlined extraction pipeline ready for payment flow integration.",
      screenshots: [
        "/screenshots/eob-reader-1.png",
        "/screenshots/eob-reader-2.png",
        "/screenshots/eob-reader-3.png",
      ],
    },
  },
  {
    id: "cold-email-agent",
    title: "Cold Email Agent",
    brief:
      "An autonomous agent for generating and executing targeted email outreach campaigns.",
    tags: ["Next.js", "Claude API", "PostgreSQL", "Automation"],
    thumbnail: "/screenshots/cold_email_agent.png",
    caseStudy: {
      problem:
        "B2B outreach is often highly manual or generic, leading to low conversion rates.",
      solution:
        "Developed an AI agent that researches targets and drafts highly contextualized, personalized emails automatically.",
      outcome: "Scalable, automated personalized outreach pipelines.",
    },
  },
  {
    id: "youtube-automation",
    title: "YouTube Automation Pipeline",
    brief:
      "A fully automated daily YouTube video generation and processing pipeline.",
    tags: ["GitHub Actions", "Python", "Video APIs", "Automation"],
    thumbnail: "/screenshots/akhir_zamaan_pipeline.png",
    caseStudy: {
      problem:
        "Managing daily YouTube content creation requires constant manual oversight of rendering, scripting, and uploading.",
      solution:
        "Engineered a hands-free workflow triggered via GitHub Actions to generate scripts, synthesize video, and deploy content daily.",
      outcome: "A completely automated, zero-touch daily video pipeline.",
    },
  },
  {
    id: "instagram-carousel",
    title: "Automated Instagram Carousel Pipeline",
    brief:
      "An end-to-end automation system that transforms raw YouTube transcripts into fully generated, visually rich Instagram carousels and posts them autonomously.",
    tags: [
      "LLM APIs",
      "Image Gen APIs (Flux/Leonardo)",
      "Automation",
      "Social APIs",
    ],
    thumbnail: "/screenshots/instagram_carousel_pipeline.png",
    caseStudy: {
      problem:
        "Creating high-value Instagram carousels from long-form content is highly manual, requiring content extraction, slide-by-slide copywriting, image prompting, and manual scheduling.",
      solution:
        "Built an automated workflow that accepts a YouTube transcript, uses an LLM to extract original concepts and structure them into carousel slides, generates precise prompts for AI image synthesis, and automatically publishes the final asset.",
      outcome:
        "A zero-touch content multiplier that turns video transcripts into ready-to-publish social assets without manual intervention.",
    },
    role: "AI Systems Engineer / Architect",
    methodology: "Agentic Workflow",
    techStackDetailed: [
      "Node.js (sharp)",
      "Google Gemini 2.5 Flash",
      "Pollinations.ai (FLUX.1-schnell)",
      "Cloudflare R2",
      "Cloudflare Workers",
      "Make.com",
      "Instagram Graph API"
    ],
    systemOverview: "Designed and deployed a fully autonomous, zero-touch content generation pipeline that operates entirely on $0/month infrastructure. The system ingests a single raw YouTube video transcript (e.g., podcasts, interviews) and programmatically orchestrates multiple APIs and local compositing tools to extract, format, render, and schedule cinematic 9-slide Instagram carousels.\n\nBuilt using an agentic \"Vibe Coding\" approach—directing LLM agents to construct the backend—this pipeline runs headlessly. Once a transcript is pasted, the system feeds an automated posting schedule (09:00 and 18:00 GST) for 7–10 days without requiring local hardware to remain awake.",
    stages: [
      {
        title: "1. Ingestion & Extraction (The Brain)",
        engine: "Gemini 2.5 Flash API",
        description: "The model digests raw, unformatted transcripts and parses them into high-signal 9-slide storyboards. It outputs a strictly typed JSON array containing the visual prompts, slide-by-slide typography (including highlight words), and the final SEO-optimized captions and hashtags."
      },
      {
        title: "2. Cinematic Visual Generation",
        engine: "Pollinations.ai (FLUX.1-schnell)",
        description: "Generates photorealistic, cinematic background plates based on the Gemini visual prompts.",
        bulletPoints: [
          "Constraint: Explicitly generates zero text in the images to eliminate AI spelling hallucinations and layout drift.",
          "Operates completely free of API keys or rate-limit caps."
        ]
      },
      {
        title: "3. Programmatic Typography (Local Compositor)",
        engine: "Node.js (sharp & SVG)",
        description: "The system dynamically calculates text wrapping, gradient overlays, and highlighted keyword formatting via SVGs. It composites these vector text layers perfectly over the Pollinations.ai background plates.",
        bulletPoints: [
          "Result: 100% accurate spelling, perfectly aligned typography, and rigid brand consistency that generative image models cannot guarantee."
        ]
      },
      {
        title: "4. Headless Orchestration & Cloud State",
        engine: "Cloudflare Workers & R2",
        description: "Compiled JPEGs and a master queue.json state file are pushed to public R2 URLs. A Cloudflare Worker, triggered by Cron events twice daily, reads the JSON queue from R2 and fires a webhook payload to Make.com containing the public R2 image links and captions. Make.com validates the array and executes the final OAuth handshake with the Instagram Graph API."
      }
    ],
    constraints: [
      {
        title: "Zero-Billing Infrastructure",
        description: "Replaced premium image-generation APIs and $10/mo prepayment requirements with Pollinations.ai and Gemini Flash, effectively dropping operational costs to $0 while maintaining 4K visual fidelity."
      },
      {
        title: "Public R2 URLs over Custom DNS",
        description: "Removed custom domain routing (which previously caused silent DNS lags and Meta API OAuthException failures) in favor of standard public R2 dev links. Make.com acts as the reliable bridge to the Graph API."
      },
      {
        title: "Cloud as the Single Source of Truth",
        description: "Migrated state management from local storage to a cloud-hosted JSON queue. This prevents local sync bugs from clobbering updates and allows the pipeline to run even when the local staging machine is offline."
      },
      {
        title: "Self-Cleaning Protocol",
        description: "Implemented an automated weekly cleanup script that sweeps the R2 bucket and deletes objects older than 7 days, guaranteeing the system never exceeds Cloudflare's free-tier storage limits."
      }
    ],
    maintenanceProfile: "~10 minutes per week (pasting a new raw transcript). The machine handles the rest indefinitely."
  },
];

export const projects: Project[] = baseProjects.map((project) => ({
  ...project,
  liveUrl: projectLinks[project.id]?.liveUrl || project.liveUrl,
  githubUrl: projectLinks[project.id]?.githubUrl || project.githubUrl,
}));
