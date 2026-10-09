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
    screenshotAlts?: Record<string, string>;
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
      "AI reads an insurance PDF, pulls out only the denied claims with their amounts, and drafts an appeal letter you can edit and copy.",
    tags: ["Document AI", "Letter drafting", "Next.js"],
    thumbnail: "/screenshots/reclaim-worklist.png",
    role: "Solo engineer",
    methodology: "End to end",
    techStackDetailed: [
      "Next.js 16 (App Router)",
      "TypeScript",
      "Tailwind CSS and shadcn/ui",
      "Supabase (Postgres, Google sign-in, RLS)",
      "pdf.js",
      "Gemini API",
      "Groq",
      "OpenRouter",
      "docx and JSZip",
      "Vercel",
    ],
    caseStudy: {
      problem:
        "This is for people who handle insurance paperwork for a doctor's office. When an insurer refuses to pay for part of a visit, it says so in a statement, usually a PDF several pages long. Someone has to read every page, find the refused items, note how much money each one is worth, and write a letter asking the insurer to look again. It's slow work. A refused item that gets missed is money nobody asks for.",
      solution:
        "You upload the statement. Reclaim reads it and lists only the refused items. Each one shows the amount and the reason the insurer gave. Click one and you can check the details against the original page and fix anything that's wrong. Then you paste in your notes, and Reclaim writes a first draft of the appeal letter. You can edit it, copy it, or download it as a Word file. Letters are saved to your account, so you can come back to them or download several at once.",
      outcome:
        "You don't read every page yourself. You start from a short list and a draft letter instead of a blank page. A person still checks the details before any letter is written, and nothing is sent for you. The same approach fits any business that receives documents and has to answer some of them, such as refund requests, supplier disputes or warranty claims. You can try it with four made-up claims and no account. This is a portfolio project, and it uses made-up data only.",
      screenshots: [
        "/screenshots/reclaim-worklist.png",
        "/screenshots/reclaim-review.png",
        "/screenshots/reclaim-letter.png",
        "/screenshots/reclaim-history.png",
      ],
      screenshotAlts: {
        "/screenshots/reclaim-review.png":
          "Check the extracted fields against the PDF, then generate or review the letter.",
      },
    },
    keyDecisions:
      "Reclaim reads page images rather than relying only on text, because fax-style statements often have no usable text layer. The cost is bigger requests, so pages go three at a time and narrow pages fall back to text. A plain parser runs before any AI call on text, so standard tables cost nothing. The worklist is kept in the browser rather than the database, so fewer claim details are stored. The catch is that it doesn't follow you to another device. The model never has the last word: a person ticks \"verified\" before a letter is written, and the code sets the date and the patient name itself.",
    systemOverview:
      "The PDF never leaves the browser as a file. pdf.js renders each page to a JPEG at least 1200 px wide. Pages go to the server three at a time, which keeps each request under Vercel's 4.5 MB body limit. Narrow, fax-style pages are sent as their text layer instead. If the image pass finds no denials, the client tries the text layer.\n\nOn the server, text input first goes through a plain parser for standard claim tables. The AI is called only when that parser finds nothing. Every AI call asks for JSON (Gemini's JSON response type, or response_format: json_object on Groq and on the OpenRouter models that support it). The reply is parsed, field names are normalised, money and dates are formatted, and duplicate lines are removed.\n\nLetters come from a separate route. It prompts the model with the checked fields and the pasted notes only. The code then sets the letter date and the patient name itself, so the model can't change them.",
    stages: [
      {
        title: "1. Render",
        engine: "pdf.js in the browser",
        description:
          "Pages become JPEGs and are sent three at a time. Narrow pages are sent as text instead.",
      },
      {
        title: "2. Extract",
        engine: "Gemini, then Groq, then OpenRouter",
        description:
          "The local table parser runs first on text. Then each model in the chain returns JSON with only the denied lines. A result that fails the check is sent back to the same model with the problem stated, up to 3 attempts, before the next model is tried.",
      },
      {
        title: "3. Check",
        engine: "the person using it",
        description:
          "The fields open next to the PDF preview. A letter can't be generated until the notes are pasted and the \"verified\" box is ticked. Edits are saved to the row.",
      },
      {
        title: "4. Draft and export",
        engine: "the same provider chain, plus docx and JSZip",
        description:
          "The letter is saved to Postgres. It can be edited, copied, or downloaded as .docx or .txt. Several letters download as a ZIP.",
      },
    ],
    constraints: [
      {
        title: "Provider fallback",
        description:
          "The order is Gemini (Flash-Lite models first, so the small daily Flash allowance is used last), then Groq openai/gpt-oss-120b, then the older OpenRouter chains. Groq is skipped for page images. A provider with no API key is skipped. A failed call (any HTTP error, a timeout or an empty reply) moves on to the next model. Each call has a timeout: 90 seconds for images and 60 seconds for text.",
      },
      {
        title: "Health check",
        description:
          "GET /api/ai-health is for signed-in users only. It pings the first model of each configured provider, or all of them with ?all=1, and returns ok or not plus the HTTP status for each model. It never returns keys.",
      },
      {
        title: "No raw provider errors",
        description:
          "Error bodies from providers are thrown away on the server, and only the status code is logged. Users see plain messages such as \"busy, try again in a few seconds\" or \"that model took too long and was skipped\".",
      },
      {
        title: "Per-user data",
        description:
          "Letters live in a Postgres table with row-level security (auth.uid() = user_id), and every server query also filters on the user id. The worklist of denied lines stays in the browser's local storage, tagged with the user id. It's cleared when a different account signs in or the user signs out.",
      },
      {
        title: "Recycle bin",
        description: "Deleted letters go to a recycle bin and can be restored.",
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
    thumbnail: "/screenshots/doctalk-home.png",
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
        "For anyone who has to answer questions from long documents such as contracts, invoices or policies. A chatbot gives you an answer, but you can't tell where it came from without reading the whole file.",
      solution:
        "Open a PDF and ask a question. The answer shows which page it came from, and one click takes the PDF to that page. If the document doesn't say, DocTalk tells you that instead of guessing. Your own uploads stay private to you.",
      outcome:
        "Answers you can check in a few seconds. You can try three demo PDFs without an account.",
      screenshots: [
        "/screenshots/doctalk-home.png",
        "/screenshots/doctalk-documents.png",
        "/screenshots/doctalk-invoice.png",
      ],
    },
    keyDecisions:
      "The deployment stays on free tiers (Neon, Vercel Hobby, a private Blob store and the Gemini free tier), and the product has no billing or upgrade path. The model only names which passages it used. The page number on each citation is the one stored with the chunk, so the model can't invent a page.",
    systemOverview:
      "The app reads the PDF page by page and keeps the page number on every chunk. Those chunks are embedded in Postgres with pgvector and an HNSW index. A question is matched against that one document only. The answer comes back with Source p. N chips, and clicking one opens the PDF on that page. If the document doesn't contain the answer, it says \"That is not in this document.\" and cites nothing.",
    stages: [
      {
        title: "1. Upload and check",
        engine: "Vercel Blob",
        description:
          "A signed-in upload goes to a private Blob store. The server issues an upload token only after a session check, and only once a document slot is reserved. It keeps the file only if the bytes start with the PDF signature.",
      },
      {
        title: "2. Chunk and embed",
        engine: "Gemini embeddings",
        description:
          "Each page is split into chunks that keep the page number, then embedded and stored with that page.",
      },
      {
        title: "3. Retrieve",
        engine: "pgvector",
        description:
          "The question is matched inside that document only, using cosine search on the HNSW index, or the whole file when it is short enough to read in one pass.",
      },
      {
        title: "4. Answer with citations",
        engine: "Gemini",
        description:
          "The model answers from those passages and names which ones it used. Each Source p. N chip uses the page stored on the chunk. If the passages don't contain the answer, the reply is \"That is not in this document.\" and nothing is cited.",
      },
    ],
    constraints: [
      {
        title: "Visibility",
        description:
          "A SQL condition decides which documents a viewer can read. Public demo rows are visible to everyone. A private upload is visible only to the account that owns it.",
      },
      {
        title: "Private files",
        description:
          "Uploads go to a private Blob store behind an upload token. The server checks the PDF signature before it keeps the file, and the bytes are streamed through an authenticated route that runs the same visibility check.",
      },
      {
        title: "Atomic limits",
        description:
          "A signed-in account can keep 5 documents. The public demo allows 20 questions per network each UTC day. Both counters increment in one database statement, so two requests at once can't both pass the cap.",
      },
      {
        title: "Demo limit",
        description:
          "A provider 429 or 402, or the signed-out daily cap, returns \"Demo limit reached, try again later.\"",
      },
    ],
  },
  {
    id: "eob-reader",
    title: "EOB Reader",
    liveUrlLabel: "Visit Web Application",
    brief:
      "Upload a batch of insurance PDFs. AI pulls out every line item, a person approves each document, and approved rows export as a CSV.",
    tags: ["Batch extraction", "Human review", "CSV export"],
    thumbnail: "/screenshots/eob-reader-review.png",
    role: "Solo engineer",
    methodology: "End to end",
    techStackDetailed: [
      "Next.js 16 (App Router)",
      "TypeScript",
      "Tailwind CSS and shadcn/ui",
      "TanStack Table",
      "Supabase (Postgres, Google sign-in, private Storage, RLS)",
      "pdf.js",
      "Gemini API",
      "Groq",
      "OpenRouter",
      "Vercel",
    ],
    caseStudy: {
      problem:
        "This is for staff in a dental office. Insurance companies send payment statements as PDFs, often a stack at a time. Each one lists every treatment, what was charged and what the insurer paid. Someone then types those numbers into the office's software by hand, line by line.",
      solution:
        "You drop in the whole stack at once. EOB Reader reads each PDF and fills in a draft: who paid, for which patient, and every treatment line with its amounts. A person looks at each draft next to the original PDF and approves it, flags it to look at later, or rejects it. Only the approved ones go into the download. That's a spreadsheet file (CSV) laid out the way Dentrix, Eaglesoft or Open Dental expect, or the standard electronic payment file those programs can import. If a PDF is a scan or a photo, it's skipped with a clear message rather than a guess.",
      outcome:
        "The typing is done for you, and a person still has the final say before anything goes into the office's system. The same setup fits any pile of PDFs that has to end up in a spreadsheet or another program, such as invoices, bank statements or supplier price lists. You can try a made-up batch without an account. This is a portfolio project, and it uses made-up data only.",
      screenshots: [
        "/screenshots/eob-reader-review.png",
        "/screenshots/eob-reader-dashboard.png",
        "/screenshots/eob-reader-export.png",
      ],
    },
    keyDecisions:
      "Text only, with no OCR. A scan is turned away with a plain message rather than read badly, and that limit is stated up front. Nothing is exported until a person approves it, because a model can misread a number. That matters even more for the 835. Its builder adds a CO-45 or OA-23 adjustment when a line doesn't balance, so a balanced file doesn't prove the extraction was right, and the human check comes before export for that reason. Free providers go first and the paid fallback goes last. A small health route shows which provider is failing without opening server logs.",
    systemOverview:
      "This app is text only. There's no image or OCR path. The server reads each PDF's text layer with pdf.js. If no page has text, the file is reported as scanned, skipped, and not stored. Text pulled in the browser is used only if the server can't parse the file. Up to 5 files are processed at a time.\n\nEach PDF is stored in a private Supabase Storage bucket under that user's practice folder. Its draft is saved as one extraction row plus line-item rows. The review page opens the original through a signed URL that lasts one hour.\n\nThe extraction prompt asks for one JSON object covering the payer, patient, claim and check, plus every line with its code, amounts, adjustment and remark codes, and confidence scores. Gemini is asked through its JSON response type, with a 4,000-token output cap. Groq uses a max_tokens ceiling sized to fit its free tier of 8,000 tokens a minute. OpenRouter's Gemini models use response_format: json_object. The reply is parsed and normalised (field aliases, money strings turned into numbers).",
    stages: [
      {
        title: "1. Batch upload",
        engine: "pdf.js on the server",
        description:
          "Each file's text layer is read. Scans are skipped with a message, and the PDF goes to private storage.",
      },
      {
        title: "2. Draft",
        engine: "Gemini, then Groq, then OpenRouter",
        description:
          "One JSON object per PDF covers the header fields and every line item.",
      },
      {
        title: "3. Review",
        engine: "the person using it",
        description:
          "The draft sits next to the PDF, and each document is approved, flagged or rejected.",
      },
      {
        title: "4. Export",
        engine: "CSV and X12 835 builders",
        description:
          "Only approved documents are exported, as a CSV for Dentrix, Eaglesoft or Open Dental, or as an X12 835 (005010X221A1) file.",
      },
    ],
    constraints: [
      {
        title: "Provider fallback",
        description:
          "Gemini models are tried first, Flash-Lite first, because the key allows about 500 Flash-Lite and about 20 Flash requests a day. On a 429, 403, 404 or 5xx, a timeout, or JSON it can't parse, it moves to the next Gemini model. Any other error skips straight to Groq openai/gpt-oss-120b, then to the OpenRouter chain (gemini-2.5-flash, gemini-2.5-flash-lite, llama-3.3-70b-instruct). A provider with no key is skipped. If every model fails, the user sees \"The reader is busy right now. Please try again in a minute.\"",
      },
      {
        title: "Health check",
        description:
          "GET /api/ai-health is for signed-in users only. By default it pings one model per provider, or every model with ?all=1. It returns the status for each model plus an error snippet of up to 200 characters, with keys and bearer tokens removed.",
      },
      {
        title: "No raw provider errors",
        description:
          "Provider error text is redacted the same way before it's logged. Upload results show only the plain \"busy\" message.",
      },
      {
        title: "Per-user data",
        description:
          "Row-level security on practices, batches, extractions and line items limits each user to their own practice's rows. Storage policies limit reads, uploads and deletes to that practice's folder.",
      },
      {
        title: "Balance check on the 835",
        description:
          "The validator checks the totals. If it fails, the export route returns 422 and the page shows \"Export blocked: fix balancing errors first\".",
      },
      {
        title: "No false empty state",
        description:
          "The dashboard shows placeholder cards while batches load, instead of \"nothing here\".",
      },
      {
        title: "Known limits",
        description:
          "A PDF with several patients keeps only the first one. Reviewers can approve, flag or reject a document, and can't edit a field. The 835 file hasn't been tested against a real clearinghouse or practice-management import. The audit log and payer template tables exist but are unused.",
      },
    ],
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
