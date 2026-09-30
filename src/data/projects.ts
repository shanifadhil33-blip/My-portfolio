import { projectLinks } from "./links";

export interface Project {
  id: string;
  title: string;
  brief: string;
  tags: string[];
  thumbnail?: string;
  hideMedia?: boolean;
  comingSoon?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  liveUrlLabel?: string;
  caseStudy?: {
    problem: string;
    solution: string;
    outcome?: string;
    screenshots?: string[];
  };
  role?: string;
  methodology?: string;
  techStackDetailed?: string[];
  keyDecisions?: string;
  systemOverview?: string;
  stages?: {
    title: string;
    engine?: string;
    description?: string;
    bulletPoints?: string[];
  }[];
  constraints?: { title: string; description: string }[];
  maintenanceProfile?: string;
}

const baseProjects: Project[] = [
  {
    id: "reclaim",
    title: "Reclaim",
    liveUrlLabel: "Visit Web Application",
    brief:
      "For freelance medical billers. Vision AI reads EOB pages, extracts only denied claims, and generates editable appeal letters (.docx or ZIP).",
    tags: ["Vision", "Appeal letters", "Next.js"],
    thumbnail: "/screenshots/reclaim-thumb.png",
    role: "Solo engineer",
    methodology: "End to end",
    techStackDetailed: [
      "Next.js",
      "TypeScript",
      "Supabase with RLS",
      "Google sign-in",
      "OpenRouter",
      "Sentry",
      "Polar",
    ],
    caseStudy: {
      problem:
        "Freelance medical billers work from Explanation of Benefits PDFs that mix paid lines and denials. Writing an appeal means finding the denied claims and turning the biller's notes into a letter.",
      solution:
        "The biller uploads an EOB PDF. Vision AI reads each page and extracts only the denied claims, with validation and retries. From the biller's notes, the app generates editable appeal letters that download as a .docx or a ZIP.",
    },
    keyDecisions:
      "Vision AI reads each page and keeps only the denied claims. Validation and retries run on that extraction before a letter is written. The letters stay editable and download as a .docx, or as a ZIP when there is more than one.",
    systemOverview:
      "Reclaim is a web app for freelance medical billers. A biller uploads an Explanation of Benefits PDF. Vision AI reads EOB pages and extracts only denied claims. The biller adds notes, and the app generates editable appeal letters as a .docx or a ZIP.",
    stages: [
      {
        title: "1. Upload",
        description: "The biller uploads an Explanation of Benefits PDF.",
      },
      {
        title: "2. Extract denied claims",
        description:
          "Vision AI reads each page and extracts only the denied claims, with validation and retries.",
      },
      {
        title: "3. Biller notes",
        description: "The biller adds notes for the denied claims.",
      },
      {
        title: "4. Appeal letters",
        description:
          "The app generates editable appeal letters, downloadable as a .docx or a ZIP.",
      },
    ],
  },
  {
    id: "eob-reader",
    title: "EOB Reader",
    liveUrlLabel: "Visit Web Application",
    brief:
      "For US dental practices. Batch-upload EOB PDFs, AI extracts claim data from PDF text, staff review and approve, then export an X12 835 ERA with a balance check plus CSVs for Dentrix, Eaglesoft and Open Dental.",
    tags: ["X12 835", "ERA export", "Dental"],
    thumbnail: "/screenshots/eob-reader-thumb.png",
    role: "Solo engineer",
    methodology: "End to end",
    techStackDetailed: [
      "Next.js",
      "TypeScript",
      "Supabase (database, auth, storage, RLS)",
      "OpenRouter",
      "Polar",
    ],
    caseStudy: {
      problem:
        "US dental practices receive Explanation of Benefits as PDFs. Staff still have to get the claim data into an ERA file and into the practice management system.",
      solution:
        "Staff batch-upload EOB PDFs. AI extracts claim data from the PDF text. Staff review and approve each claim, then export an X12 835 ERA file with a balance check, plus CSVs for Dentrix, Eaglesoft and Open Dental.",
      outcome:
        "The app is live. A practice can turn a batch of EOB PDFs into an X12 835 ERA file and CSVs for Dentrix, Eaglesoft and Open Dental.",
    },
    keyDecisions:
      "Extraction reads the PDF text. Staff review and approve each claim before anything is exported. The X12 835 file includes a balance check, and separate CSVs cover Dentrix, Eaglesoft and Open Dental.",
    systemOverview:
      "Staff sign in, batch-upload EOB PDFs. AI extracts claim data from the PDF text. Staff review and approve each claim, then export an X12 835 ERA with a balance check, plus CSVs for Dentrix, Eaglesoft and Open Dental.",
    stages: [
      {
        title: "1. Sign in",
        description: "Sign in through Supabase auth.",
      },
      {
        title: "2. Batch upload",
        description: "Staff upload a batch of EOB PDFs.",
      },
      {
        title: "3. Review and approve",
        description:
          "AI extracts claim data from the PDF text. Staff review and approve each claim.",
      },
      {
        title: "4. Export",
        description:
          "Download an X12 835 ERA file with a balance check, plus CSVs for Dentrix, Eaglesoft and Open Dental.",
      },
    ],
  },
  {
    id: "doctalk",
    title: "DocTalk",
    liveUrlLabel: "Visit Web Application",
    brief:
      "Ask a PDF a question and get an answer that cites the page it came from, with the PDF opened on that page.",
    tags: ["Next.js", "pgvector", "Citations"],
    thumbnail: "/screenshots/doctalk-invoice.png",
    role: "Solo engineer",
    methodology: "End to end",
    techStackDetailed: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Auth.js",
      "Neon Postgres",
      "pgvector",
      "Drizzle",
      "Gemini API",
      "Vercel Blob",
      "react-pdf",
    ],
    caseStudy: {
      problem:
        "When you ask a chatbot about a contract or an invoice, you get an answer but no way to check it without reading the whole file. For anything with money or legal terms in it, an answer you can't check isn't much use.",
      solution:
        "The app reads the PDF page by page and keeps the page number on every chunk. A question is matched against that one document only. The answer comes back with Source p. N chips, and clicking one opens the PDF on that page. If the document doesn't contain the answer, it says \"That is not in this document.\" and cites nothing. Signed-in uploads stay private. Three demo PDFs are open to everyone.",
      outcome:
        "The app is live. A visitor can open a demo PDF, ask a question, and land on the page the answer came from.",
      screenshots: [
        "/screenshots/doctalk-home.png",
        "/screenshots/doctalk-documents.png",
        "/screenshots/doctalk-invoice.png",
      ],
    },
  },
  {
    id: "pipeline",
    title: "Pipeline",
    comingSoon: true,
    hideMedia: true,
    brief: "An automated multi-step data and AI workflow, built for reliability.",
    tags: [],
  },
  {
    id: "cold-email-agent",
    title: "Autonomous Cold Email Agent",
    brief:
      "A working prototype that sends personalized cold email on a schedule, with a hard cap of 30 emails per day.",
    tags: ["Python", "GitHub Actions", "MailerSend API", "SQLite"],
    thumbnail: "/screenshots/cold_email_agent.png",
    role: "Solo engineer",
    methodology: "Scheduled automation",
    techStackDetailed: [
      "Python 3.12",
      "SQLite",
      "MailerSend API",
      "GitHub Actions",
      "Cloudflare R2",
      "hashlib (MD5 variant rotation)",
    ],
    caseStudy: {
      problem:
        "Personalized cold email does not scale by hand. Someone has to throttle sends, log who was contacted, and honor opt-outs.",
      solution:
        "I built a Python agent that reads leads from a CSV, skips anyone already contacted or opted out, and fills a template opener from the lead's role and company. No model is in the loop. Subject lines rotate from a stable hash of the email address. GitHub Actions runs a short job on a schedule, MailerSend sends the message, and the day stops at 30 emails.",
      outcome:
        "A working prototype. It sends on a schedule and stops at 30 emails per day.",
    },
    keyDecisions:
      "I kept the opener as a template, with no model in the loop, so the text stays consistent and does not invent details. Each run is a short GitHub Actions job that sends up to 2 emails, saves state, and exits. The hard cap is 30 emails per day. Lesson: keep all prospect data out of version control and in environment-level storage.",
    systemOverview:
      "The pipeline starts from a lead export. A GitHub Actions job runs the agent on a weekday schedule. The Python runner checks each lead against SQLite so it does not contact the same person twice, fills the email, sends it through the MailerSend API, and writes the updated state back so the next run continues from there.",
    stages: [
      {
        title: "1. Lead ingestion and deduplication",
        engine: "Python / SQLite",
        description:
          "Loads leads from a CSV. The agent skips anyone already emailed, still pending, or on the opt-out list.",
      },
      {
        title: "2. Stable variant rotation",
        engine: "hashlib (MD5)",
        description:
          "Uses a hash of the email address to pick one of five subject lines and one of five openers. The same lead keeps the same variant on a rerun.",
      },
      {
        title: "3. Personalization and assembly",
        engine: "Template",
        description:
          "Fills an opener from the prospect's job title and company name, then adds a plain-text body and an opt-out link.",
      },
      {
        title: "4. Send",
        engine: "MailerSend API",
        description:
          "Sends the email through the MailerSend API. Each attempt is logged in SQLite so a failed send can be retried.",
      },
      {
        title: "5. State and cap",
        engine: "GitHub Actions",
        description:
          "Saves state after the run. Jobs are scheduled through the weekday, with up to 2 sends per run and a hard cap of 30 emails per day.",
      },
    ],
    constraints: [
      {
        title: "Opt-out",
        description:
          "A suppression list in SQLite blocks future sends. Outgoing email includes an opt-out link.",
      },
      {
        title: "Daily cap",
        description:
          "Up to 2 emails per run, and a hard stop at 30 emails per day.",
      },
    ],
    maintenanceProfile:
      "Upload a new leads CSV when the queue is empty, and process opt-out requests.",
  },
  {
    id: "youtube-automation",
    title: "YouTube Automation Pipeline",
    brief:
      "Automates script, voice and video generation for long-form documentary videos, with a manual upload step.",
    tags: ["GitHub Actions", "LLM APIs", "FFmpeg", "Cloudflare R2"],
    thumbnail: "/screenshots/akhir_zamaan_pipeline.png",
    role: "Solo engineer",
    methodology: "Scheduled pipeline",
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
        "A long-form video means research, a script, images, a voiceover and an edit. Doing each of those by hand limits how often a video can go out.",
      solution:
        "The pipeline automates script, voice and video generation. On a schedule it researches a topic, writes a documentary script, generates images, renders a voiceover with subtitles, and assembles the file with FFmpeg. The finished video is sent to Telegram. Upload to YouTube is a manual step.",
      outcome:
        "It produces a complete documentary video on a twice-weekly schedule. Putting it on YouTube is still done by hand.",
    },
    keyDecisions:
      "I run the job on ephemeral GitHub Actions runners instead of a rented server. Runners have no disk that survives the job and no GPU, so models are downloaded on each boot, and the job has to finish inside the runner time limit. I cap the video at 150 images and use cloud text to speech instead of rendering the voice on the runner CPU.",
    systemOverview:
      "Given a scheduled trigger, the system researches a topic, writes a documentary script, generates images, renders a voiceover with subtitles, and assembles the video in one runner session. The file and transcript go to cloud storage, and a Telegram message carries the download link. Upload is manual.",
    stages: [
      {
        title: "1. Research and script",
        engine: "Ollama Cloud + Tavily API",
        description:
          "The job searches the web for a topic, then asks a language model for a documentary script with scene descriptions.",
      },
      {
        title: "2. Images",
        engine: "HuggingFace / Cloudflare Workers AI / Pollinations.ai",
        description:
          "Each scene becomes an image prompt. Requests are spread across image APIs, up to 150 images per video.",
        bulletPoints: [
          "Requests go to HuggingFace, Cloudflare Workers AI and Pollinations.ai.",
          "Images are generated with no text in the frame, so the model is not asked to spell words.",
        ],
      },
      {
        title: "3. Audio and subtitles",
        engine: "Edge TTS / faster-whisper",
        description:
          "The script is narrated with cloud text to speech. A whisper model builds subtitle timings from that audio.",
      },
      {
        title: "4. Assembly and handoff",
        engine: "FFmpeg / Cloudflare R2 / Telegram Bot API",
        description:
          "FFmpeg combines images, audio and subtitles. The file is uploaded to Cloudflare R2 and a link is sent on Telegram for manual upload.",
      },
    ],
    constraints: [
      {
        title: "Runner limits",
        description:
          "The job runs on a GitHub Actions runner. There is no disk that survives the job, and the runner time limit caps how many images can be generated.",
      },
      {
        title: "Manual upload",
        description:
          "The pipeline stops at a finished file and a Telegram link. Uploading to YouTube is a separate manual step.",
      },
    ],
    maintenanceProfile:
      "Runs twice a week and sends a finished video for manual upload.",
  },
  {
    id: "instagram-carousel",
    title: "Automated Instagram Carousel Pipeline",
    brief:
      "Takes a YouTube transcript and builds Instagram carousel slides (copy, images and type), then publishes them on a schedule.",
    tags: ["LLM APIs", "Image generation", "Automation", "Instagram API"],
    thumbnail: "/screenshots/instagram_carousel_pipeline.png",
    role: "Solo engineer",
    methodology: "Scheduled pipeline",
    techStackDetailed: [
      "Node.js (sharp)",
      "Google Gemini 2.5 Flash",
      "Pollinations.ai (FLUX.1-schnell)",
      "Cloudflare R2",
      "Cloudflare Workers",
      "Make.com",
      "Instagram Graph API",
    ],
    caseStudy: {
      problem:
        "Turning a long video into an Instagram carousel means pulling out the points, writing each slide, making images and posting them.",
      solution:
        "The pipeline takes a YouTube transcript, uses a language model to split it into carousel slides, generates background images, composites the type in code, and publishes on a schedule through the Instagram API.",
      outcome:
        "A transcript becomes a queued set of carousel posts. Publishing follows the schedule after the transcript is pasted in.",
    },
    systemOverview:
      "Paste one YouTube transcript. The pipeline extracts the points, writes slide text and a caption, generates background images, composites the type, and stores the files with a queue file. A Cloudflare Worker runs at 09:00 and 18:00 GST, reads the queue, and sends the post to Make.com, which publishes it with the Instagram Graph API.\n\nAfter the transcript is pasted, later posts go out from that queue. The laptop does not have to stay on.",
    stages: [
      {
        title: "1. Transcript to slides",
        engine: "Gemini 2.5 Flash API",
        description:
          "The model reads the transcript and returns a JSON array of 9 slides: image prompt, slide text, highlight words, caption and hashtags.",
      },
      {
        title: "2. Background images",
        engine: "Pollinations.ai (FLUX.1-schnell)",
        description:
          "Generates a background plate from each slide's image prompt, with no text in the image.",
      },
      {
        title: "3. Type compositing",
        engine: "Node.js (sharp and SVG)",
        description:
          "Slide text is drawn as SVG and composited over the background, so spelling and alignment come from the layout code.",
      },
      {
        title: "4. Queue and publish",
        engine: "Cloudflare Workers, R2 and Make.com",
        description:
          "JPEGs and a queue.json file go to R2. A Worker on a twice-daily cron reads the queue and calls Make.com, which posts through the Instagram Graph API.",
      },
    ],
    constraints: [
      {
        title: "Text stays out of the image model",
        description:
          "Backgrounds are generated with no words in them. The words are composited afterward so spelling does not depend on the image model.",
      },
      {
        title: "Public R2 URLs",
        description:
          "Posts use the public R2 object URLs. Make.com sits between the worker and the Instagram Graph API.",
      },
      {
        title: "Queue file in R2",
        description:
          "The queue lives in R2, so posting continues after the machine that built the slides is off.",
      },
      {
        title: "Cleanup",
        description:
          "A weekly script deletes R2 objects older than 7 days so the bucket does not grow without a limit.",
      },
    ],
    maintenanceProfile:
      "Paste a new transcript when you want another batch. Queued posts publish on the schedule.",
  },
];

export const projects: Project[] = baseProjects.map((project) => ({
  ...project,
  liveUrl: projectLinks[project.id]?.liveUrl || project.liveUrl,
  githubUrl: projectLinks[project.id]?.githubUrl || project.githubUrl,
}));
