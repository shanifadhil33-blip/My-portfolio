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
  keyDecisions?: string;
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
      "A comprehensive B2B SaaS platform that automates the end-to-end medical billing appeals process, from EOB document ingestion to AI-generated denial appeal letters.",
    tags: ["Next.js", "Supabase", "OpenAI API", "Microservice Architecture"],
    thumbnail: "/screenshots/reclaim-thumb.png",
    role: "Full-Stack AI Engineer",
    methodology: "Microservice Architecture",
    techStackDetailed: [
      "Next.js (React)",
      "Tailwind CSS",
      "Supabase (PostgreSQL, Row Level Security)",
      "OpenAI API (GPT-4o)",
      "Supabase Storage",
      "Vercel Serverless Functions",
    ],
    caseStudy: {
      problem:
        "Medical billing teams spend countless hours manually reviewing complex, non-standardized Explanation of Benefits (EOB) PDFs and cross-referencing them to write insurance denial appeals. This tedious, error-prone workflow leads to a backlog of denied claims, missed filing deadlines, and millions in unrecovered revenue for healthcare providers.",
      solution:
        "Reclaim is a comprehensive B2B SaaS platform that automates the end-to-end medical billing appeals process. It utilizes a decoupled architecture where a specialized extraction module (the EOB Reader) ingests and parses messy EOB documents into clean, structured JSON data. The main application then feeds this structured data into an LLM agent to automatically draft highly accurate, payer-specific appeal letters for the biller to review and export.",
      outcome:
        "The decoupled architecture is actively deployed, successfully reducing the time it takes a medical biller to process a denied EOB and draft a comprehensive appeal letter from over 30 minutes down to under 2 minutes per claim.",
      screenshots: [
        "/screenshots/reclaim-1.png",
        "/screenshots/reclaim-2.png",
        "/screenshots/reclaim-3.png",
      ],
    },
    keyDecisions:
      "We made the deliberate decision to decouple the EOB Reader from the main Reclaim application, deploying the extraction engine as its own distinct microservice on Vercel. While this introduced a slight overhead in managing cross-service API communication, the tradeoff was necessary to ensure that heavy PDF parsing computations wouldn't block the main UI thread or degrade dashboard performance. This separation of concerns also allows us to scale the computationally expensive parsing engine independently as document volume increases.",
    systemOverview:
      "Reclaim is the comprehensive, user-facing SaaS platform that handles the entire lifecycle of a denied insurance claim. It acts as the front-end and main API gateway, managing user sessions, database interactions, and the final logic for generating appeal letters.\n\nThe platform connects to a decoupled extraction engine (the EOB Reader) via an internal API pipeline: the biller uploads a denied EOB, Reclaim hands the raw PDF off to the Reader for parsing, receives structured JSON back, merges it with appeal prompt templates, and runs it through an AI agent to produce the final letter.",
    stages: [
      {
        title: "1. Document Upload",
        engine: "Reclaim (Next.js)",
        description: "The medical biller logs into the Reclaim dashboard and uploads a denied EOB PDF. Reclaim receives the file and authenticates the user.",
      },
      {
        title: "2. API Handoff to Engine",
        engine: "Internal API",
        description: "Reclaim sends the raw PDF file via an internal API call directly to the EOB Reader microservice running on Vercel.",
      },
      {
        title: "3. Parsing & Extraction",
        engine: "EOB Reader (Serverless)",
        description: "The EOB Reader processes the document, navigating the layout to extract specific denial codes, patient data, and billing amounts.",
      },
      {
        title: "4. Structured Data Return",
        engine: "JSON Payload",
        description: "The EOB Reader packages the extracted information into a clean JSON payload and sends it back to Reclaim's main application logic.",
      },
      {
        title: "5. Appeals Generation",
        engine: "OpenAI GPT-4o",
        description: "Reclaim takes the structured JSON, merges it with its appeals prompt templates, and runs it through the AI agent to draft the final appeal letter.",
      },
      {
        title: "6. User Review & Export",
        engine: "Reclaim Dashboard",
        description: "The generated appeal letter is rendered on the front-end dashboard for the medical biller to review, edit, and export.",
      },
    ],
  },
  {
    id: "eob-reader",
    title: "EOB Reader",
    liveUrlLabel: "Visit Web Application",
    brief:
      "A stateless extraction microservice that ingests complex Explanation of Benefits PDFs and outputs clean, structured JSON as the dedicated parsing engine behind Reclaim.",
    tags: ["Vercel Serverless", "PDF Parsing", "REST API", "Microservice"],
    thumbnail: "/screenshots/eob-reader-thumb.png",
    role: "Backend Engineer",
    methodology: "Stateless Microservice",
    techStackDetailed: [
      "Vercel Serverless Functions",
      "PDF parsing libraries (pdf-parse)",
      "REST API",
    ],
    caseStudy: {
      problem:
        "Insurance companies issue Explanation of Benefits documents in wildly inconsistent formats, with no standardized layout for denial codes, patient information, or billing amounts. Attempting to parse these documents within the main application creates computational bottlenecks that degrade user experience.",
      solution:
        "The EOB Reader is deployed as its own distinct microservice on Vercel, purpose-built for a single job: ingesting a raw PDF, navigating its specific layout, and extracting key variables (denial codes, patient info, billed amounts, and dates of service) into a clean, standardized JSON payload. It handles error detection at the document level, flagging illegible documents or missing mandatory fields before the data ever reaches the appeals generator.",
      outcome:
        "A stateless, independently scalable extraction engine that processes documents in isolation and returns structured data without impacting main application performance.",
    },
    keyDecisions:
      "Deploying the parser as a standalone Vercel project rather than embedding it within Reclaim's codebase was a deliberate architectural choice. The stateless design means it processes a file and immediately forgets it (no sessions, no stored data), which simplifies scaling and keeps security surface area minimal. This also allows the parsing engine to be versioned and updated independently without redeploying the entire SaaS platform.",
    systemOverview:
      "The EOB Reader is a specialized microservice focused entirely on data extraction. It has one job: taking a complex, messy Explanation of Benefits PDF and turning it into clean, structured data. Deployed as its own specific project on Vercel, it operates as a distinct compute engine separated from the main user interface.\n\nCore responsibilities include PDF ingestion and parsing across varied insurance company layouts, data structuring into standardized JSON payloads, and document-level error handling to flag illegible or incomplete documents.",
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
      "A fully automated, $0-cost content pipeline that writes, illustrates, narrates, and assembles long-form documentary videos without human intervention.",
    tags: ["GitHub Actions", "LLM APIs", "FFmpeg", "Cloudflare R2"],
    thumbnail: "/screenshots/akhir_zamaan_pipeline.png",
    role: "AI Systems Engineer / Architect",
    methodology: "Agentic Automation",
    techStackDetailed: [
      "GitHub Actions (Ubuntu runner)",
      "Ollama Cloud (gpt-oss:120b-cloud)",
      "Tavily API",
      "HuggingFace Inference API (FLUX.1-schnell)",
      "Cloudflare Workers AI",
      "Pollinations.ai",
      "Microsoft Edge TTS",
      "Kokoro-82M (local ONNX)",
      "faster-whisper",
      "FFmpeg",
      "Cloudflare R2 (S3-compatible)",
      "Telegram Bot API",
    ],
    caseStudy: {
      problem:
        "Content creators spend dozens of hours per video manually researching topics, writing scripts, sourcing visual assets, recording voiceovers, and editing timelines. This tedious manual workflow limits publishing consistency and becomes financially unsustainable when using expensive, subscription-based AI creation tools.",
      solution:
        "Akhir Zamaan is an entirely automated, $0 content pipeline that writes, illustrates, narrates, and assembles long-form documentary videos without human intervention. Operating on a twice-weekly schedule, the system orchestrates approximately 10 different free-tier APIs to handle sequential tasks from web research to final video assembly. The compiled media files and transcripts are then automatically delivered directly to the operator's phone for manual upload.",
      outcome:
        "The pipeline is fully operational, successfully generating complete 10–13 minute documentary videos twice a week at a total monthly cost of exactly ~$0.00.",
    },
    keyDecisions:
      "We made the radical decision to use ephemeral GitHub Actions CI runners as the entire backend compute runtime instead of provisioning a persistent virtual private server (VPS). While this \"compute-as-a-runner\" strategy achieved a strict $0 operating cost, the tradeoff meant surviving without local storage or a GPU, forcing us to download models on every single clean boot and navigate rigid 6-hour runtime constraints. To prevent timeouts, we had to compromise on visual density (capping the pipeline at 150 images per video) and switch from local CPU voice rendering to cloud-based Edge TTS to save hours of processing time.",
    systemOverview:
      "Akhir Zamaan is a fully autonomous content factory that runs entirely on free-tier cloud infrastructure. Given no input beyond a scheduled cron trigger, the system researches trending topics via web APIs, generates a complete documentary script using a large language model, synthesizes hundreds of cinematic images, renders a professional voiceover with synchronized subtitles, and assembles the final video, all within a single ephemeral CI runner session.\n\nThe compiled video and transcript are then pushed to cloud storage and delivered via Telegram for manual upload, completing the entire creation pipeline without any human intervention.",
    stages: [
      {
        title: "1. Research & Scriptwriting",
        engine: "Ollama Cloud + Tavily API",
        description: "The pipeline begins by researching a topic via web search APIs, then feeds the research context into a large language model to generate a complete, structured documentary script with scene descriptions.",
      },
      {
        title: "2. Visual Asset Generation",
        engine: "HuggingFace / Cloudflare Workers AI / Pollinations.ai",
        description: "Each scene description is converted into an image generation prompt. The system distributes requests across three free-tier image APIs to generate up to 150 cinematic background plates per video.",
        bulletPoints: [
          "Parallel API routing across HuggingFace, Cloudflare Workers AI, and Pollinations.ai for redundancy and speed.",
          "Zero text rendered in images to eliminate AI spelling hallucinations.",
        ],
      },
      {
        title: "3. Audio & Subtitles",
        engine: "Edge TTS / Kokoro-82M / faster-whisper",
        description: "The script is narrated using cloud-based text-to-speech, then the audio is processed through a local whisper model to generate perfectly synchronized subtitle tracks.",
      },
      {
        title: "4. Video Assembly & Delivery",
        engine: "FFmpeg / Cloudflare R2 / Telegram Bot API",
        description: "FFmpeg composites the images, audio, and subtitles into a final video file. The compiled output is uploaded to Cloudflare R2 and a download link is pushed to Telegram for the operator.",
      },
    ],
    constraints: [
      {
        title: "Zero-Cost Compute",
        description: "Uses ephemeral GitHub Actions CI runners as the entire backend runtime instead of a persistent VPS, achieving a strict $0/month operating cost.",
      },
      {
        title: "No Persistent Storage",
        description: "Models must be downloaded on every single clean boot since CI runners are destroyed after each run. All persistent state lives in Cloudflare R2.",
      },
      {
        title: "6-Hour Runtime Limit",
        description: "GitHub Actions enforces a hard 6-hour cap per job. Visual density is capped at 150 images per video and voice rendering was moved to cloud TTS to stay within limits.",
      },
    ],
    maintenanceProfile: "Fully autonomous. Generates 2 complete 10–13 minute documentary videos per week at $0.00/month operating cost.",
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
    systemOverview: "Designed and deployed a fully autonomous, zero-touch content generation pipeline that operates entirely on $0/month infrastructure. The system ingests a single raw YouTube video transcript (e.g., podcasts, interviews) and programmatically orchestrates multiple APIs and local compositing tools to extract, format, render, and schedule cinematic 9-slide Instagram carousels.\n\nBuilt using an agentic \"Vibe Coding\" approach (directing LLM agents to construct the backend), this pipeline runs headlessly. Once a transcript is pasted, the system feeds an automated posting schedule (09:00 and 18:00 GST) for 7–10 days without requiring local hardware to remain awake.",
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
