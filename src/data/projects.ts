import { projectLinks } from "./links";

export interface ProjectVideo {
  src: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
}

export interface Project {
  id: string;
  title: string;
  brief: string;
  tags: string[];
  thumbnail?: string;
  thumbnailAlt?: string;
  hideMedia?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  liveUrlLabel?: string;
  caseStudy?: {
    problem?: string;
    solution?: string;
    outcome?: string;
    screenshots?: string[];
    screenshotAlts?: Record<string, string>;
    videos?: ProjectVideo[];
  };
  role?: string;
  /** Short list of what I was responsible for, shown on the card. */
  owned?: string;
  methodology?: string;
  techStackDetailed?: string[];
  whatYouCanTry?: string[];
  underTheHood?: { title: string; description: string; cardDescription?: string }[];
  honestNote?: string;
  showLiveOnCard?: boolean;
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
    thumbnail: "/screenshots/heroes/reclaim.webp",
    thumbnailAlt:
      "Reclaim on a soft blue background, with the denial list in an angled browser window and the drafted letter overlapping it.",
    role: "Solo engineer",
    methodology: "End to end",
    techStackDetailed: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "pdf.js",
      "docx",
      "Vercel",
    ],
    underTheHood: [
      {
        title: "Stack",
        description:
          "Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, pdf.js, docx, Vercel.",
        cardDescription:
          "Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, pdf.js, docx, Vercel.",
      },
      {
        title: "Database",
        description:
          "Supabase Postgres. The repo schema has a profiles table and an appeals table. Row level security is switched on for both, with policies that limit each row to the signed in user.",
        cardDescription:
          "Row level security is switched on for the profiles and appeals tables, with policies that limit each row to the signed in user.",
      },
      {
        title: "Sign in",
        description:
          "Google sign in through Supabase Auth. The app does not store a password.",
        cardDescription:
          "Google sign in through Supabase Auth. The app does not store a password.",
      },
      {
        title: "AI",
        description:
          "a fallback chain of Google Gemini, then Groq, then OpenRouter. A provider is skipped when its key is missing. Groq is not used for vision. Default Gemini model names in the code include gemini 3.5 flash lite, gemini 3.1 flash lite, gemini 3.8 flash, and gemini 2.5 flash lite.",
        cardDescription:
          "a fallback chain of Google Gemini, then Groq, then OpenRouter. A provider is skipped when its key is missing.",
      },
      {
        title: "Privacy",
        description:
          "denied claim rows are kept in the browser's localStorage and are cleared on sign out.",
      },
      {
        title: "Tests",
        description:
          "two Node test files in the repo (AI provider order and worklist deduping).",
      },
    ],
    honestNote:
      "This is a portfolio project, not a HIPAA product, and not for real patient information.",
    showLiveOnCard: true,
    caseStudy: {
      problem:
        "This is for people who handle insurance paperwork for a doctor's office. When an insurer refuses to pay for part of a visit, it says so in a statement, usually a PDF several pages long. Someone has to read every page, find the refused items, note how much money each one is worth, and write a letter asking the insurer to look again. It's slow work. A refused item that gets missed is money nobody asks for.",
      solution:
        "You upload the statement. Reclaim reads it and lists only the refused items. Each one shows the amount and the reason the insurer gave. Click one and you can check the details against the original page and fix anything that's wrong. Then you paste in your notes, and Reclaim writes a first draft of the appeal letter. You can edit it, copy it, or download it as a Word file. Letters are saved to your account, so you can come back to them or download several at once.",
      outcome:
        "You don't read every page yourself. You start from a short list and a draft letter instead of a blank page. A person still checks the details before any letter is written, and nothing is sent for you. The same approach fits any business that receives documents and has to answer some of them, such as refund requests, supplier disputes or warranty claims. You can try it with four fictional claims and no account. This is a portfolio project, and it uses fictional data only.",
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
      "Reclaim reads page images rather than relying only on text, because fax style statements often have no usable text layer. The cost is bigger requests, so pages go three at a time and narrow pages fall back to text. A plain parser runs before any AI call on text, so standard tables cost nothing. The worklist is kept in the browser rather than the database, so fewer claim details are stored. The catch is that it doesn't follow you to another device. The model never has the last word: a person ticks \"verified\" before a letter is written, and the code sets the date and the patient name itself.",
    systemOverview:
      "The PDF never leaves the browser as a file. pdf.js renders each page to a JPEG at least 1200 px wide. Pages go to the server three at a time, which keeps each request under Vercel's 4.5 MB body limit. Narrow, fax style pages are sent as their text layer instead. If the image pass finds no denials, the client tries the text layer.\n\nOn the server, text input first goes through a plain parser for standard claim tables. The AI is called only when that parser finds nothing. Every AI call asks for JSON (Gemini's JSON response type, or response_format: json_object on Groq and on the OpenRouter models that support it). The reply is parsed, field names are normalised, money and dates are formatted, and duplicate lines are removed.\n\nLetters come from a separate route. It prompts the model with the checked fields and the pasted notes only. The code then sets the letter date and the patient name itself, so the model can't change them.",
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
          "GET /api/ai-health works only for users who are signed in. It pings the first model of each configured provider, or all of them with ?all=1, and returns ok or not plus the HTTP status for each model. It never returns keys.",
      },
      {
        title: "No raw provider errors",
        description:
          "Error bodies from providers are thrown away on the server, and only the status code is logged. Users see plain messages such as \"busy, try again in a few seconds\" or \"that model took too long and was skipped\".",
      },
      {
        title: "Data kept per user",
        description:
          "Letters live in a Postgres table with row level security (auth.uid() = user_id), and every server query also filters on the user id. The worklist of denied lines stays in the browser's local storage, tagged with the user id. It's cleared when a different account signs in or the user signs out.",
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
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Auth.js",
      "Drizzle",
      "Neon Postgres with pgvector",
      "Vercel Blob",
      "Vercel",
    ],
    underTheHood: [
      {
        title: "Stack",
        description:
          "Next.js 15, React 19, TypeScript, Tailwind CSS, Auth.js, Drizzle, Neon Postgres with pgvector, Vercel Blob, Vercel.",
        cardDescription:
          "Next.js 15, React 19, TypeScript, Auth.js, Drizzle, Neon Postgres with pgvector, Vercel Blob.",
      },
      {
        title: "Database",
        description:
          "documents, chunks, extractions, settings, and questions. Chunks use an HNSW cosine index. Document lists are filtered in the app by the signed in Google account id (demo documents or rows whose user id is the viewer). Private file bytes are streamed only after that same visibility check.",
        cardDescription:
          "Document lists are filtered in the app by the signed in Google account id. Private file bytes are streamed only after that same visibility check.",
      },
      {
        title: "Sign in",
        description:
          "Google sign in with Auth.js and JWT sessions. Upload and delete require a session.",
        cardDescription:
          "Google sign in with Auth.js and JWT sessions. Upload and delete require a session.",
      },
      {
        title: "AI",
        description:
          "embeddings default to Gemini gemini-embedding-2 at 768 dimensions. Chat defaults to Gemini gemini-3.5-flash-lite, with an optional OpenRouter fallback when both the key and model are set. Answers are asked only from retrieved passages and cite page numbers.",
        cardDescription:
          "Answers are asked only from retrieved passages and cite page numbers. Chat defaults to Gemini gemini-3.5-flash-lite, with an optional OpenRouter fallback.",
      },
      {
        title: "Limits",
        description:
          "PDFs only, 10 MB, at most 5 documents per account. Signed out demo questions are capped at 20 per IP per UTC day, with an atomic database counter.",
      },
      {
        title: "Tests",
        description:
          "223 test cases across 56 Vitest files in the repo.",
      },
    ],
    showLiveOnCard: true,
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
          "An upload from a signed in account goes to a private Blob store. The server issues an upload token only after a session check, and only once a document slot is reserved. It keeps the file only if the bytes start with the PDF signature.",
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
          "Each signed in account can keep 5 documents. The public demo allows 20 questions per network each UTC day. Both counters increment in one database statement, so two requests at once can't both pass the cap.",
      },
      {
        title: "Demo limit",
        description:
          "A provider 429 or 402, or the daily cap for signed out visitors, returns \"Demo limit reached, try again later.\"",
      },
    ],
  },
  {
    id: "cleaning-estimator",
    title: "Cleaning Price Estimator",
    liveUrlLabel: "Visit Web Application",
    brief:
      "For home cleaning companies that want customers to get a price on their phone and book on WhatsApp. This portfolio demo updates the estimate as they choose their home and extras.",
    tags: ["Home cleaning", "Instant pricing", "Next.js"],
    thumbnail: "/screenshots/cleaning-estimator-desktop.png",
    techStackDetailed: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Three.js",
      "React Three Fiber",
      "Vercel",
    ],
    underTheHood: [
      {
        title: "Stack",
        description:
          "Next.js 15, React 19, TypeScript, Three.js, React Three Fiber, Vercel.",
        cardDescription:
          "Next.js 15, React 19, TypeScript, Three.js, React Three Fiber, Vercel.",
      },
      {
        title: "Prices",
        description:
          "Rates, brand copy, and a WhatsApp number live in JSON config files. The price is calculated in the browser.",
        cardDescription:
          "Rates, brand copy, and a WhatsApp number live in JSON config files. The price is calculated in the browser.",
      },
      {
        title: "Booking",
        description:
          "a WhatsApp link opens with the quote already written in the message.",
        cardDescription:
          "a WhatsApp link opens with the quote already written in the message.",
      },
      {
        title: "Markets",
        description:
          "a company slug at /c/ followed by the company slug, plus /us (USD, English and Spanish), /ca (CAD, English and French), and /uk (GBP, English).",
        cardDescription:
          "company routes for the US, Canada and the UK, plus a per company slug.",
      },
      {
        title: "Tests",
        description:
          "29 Vitest cases in 4 unit test files (quote, market quote, phone, and countries). Playwright scripts are also in the repo under e2e.",
      },
    ],
    honestNote:
      "This is a demo for a fictional brand. Contact details in the market files are placeholders.",
    showLiveOnCard: true,
    caseStudy: {
      problem:
        "This is for home cleaning companies that want customers to see a price and book on WhatsApp from their phone. Customers can see the crew, hours and materials in their estimate before they book.",
      solution:
        "Customers pick a studio, apartment, townhouse, villa or penthouse, then choose the size, floors, rooms and extras. A 3D house model rebuilds live as they choose. The price updates instantly and shows the crew, hours, materials and weekly saving. They can then book on WhatsApp with a reference code. The estimator supports English, Arabic, Urdu and Hindi, with right to left layouts.",
      outcome:
        "Customers get an instant price and a way to book on WhatsApp. Each company has one settings file for pricing, so a tailored version for another company is a small settings change. This is a portfolio demo, and the WhatsApp number is a placeholder.",
      screenshots: [
        "/screenshots/cleaning-estimator-desktop.png",
        "/screenshots/cleaning-estimator-phone-en.png",
        "/screenshots/cleaning-estimator-phone-ar.png",
      ],
      screenshotAlts: {
        "/screenshots/cleaning-estimator-desktop.png":
          "Cleaning Price Estimator on desktop in English with a 3D house model and price estimate.",
        "/screenshots/cleaning-estimator-phone-en.png":
          "Cleaning Price Estimator on a phone in English.",
        "/screenshots/cleaning-estimator-phone-ar.png":
          "Cleaning Price Estimator on a phone in Arabic with a right to left layout.",
      },
    },
    keyDecisions:
      "Pricing comes from one settings file per company. A tailored version for another company needs only a small settings change. The estimator is made for phones first and supports English, Arabic, Urdu and Hindi with right to left layouts.",
    systemOverview:
      "Home choices rebuild the 3D house model live and update the price instantly. The estimate shows the crew, hours, materials and weekly saving. Customers book on WhatsApp with a reference code.",
    stages: [
      {
        title: "1. Choose the home",
        description:
          "Pick the home type, size, floors, rooms and extras. The 3D house model rebuilds live as the choices change.",
      },
      {
        title: "2. See the price",
        description:
          "The estimate updates instantly with the crew, hours, materials and weekly saving.",
      },
      {
        title: "3. Book on WhatsApp",
        description:
          "Book on WhatsApp with a reference code. The portfolio demo uses a placeholder number.",
      },
    ],
    constraints: [
      {
        title: "Portfolio demo",
        description:
          "The WhatsApp number is a placeholder.",
      },
      {
        title: "Phone and desktop checks",
        description:
          "Tested with automated phone checks at widths of 360 and 390 pixels in English, Arabic, Urdu and Hindi, plus desktop checks.",
      },
    ],
  },
  {
    id: "gleam",
    title: "Gleam",
    liveUrlLabel: "Visit Web Application",
    brief:
      "Tap any part of a 3D house and the big live total updates, with a Book this price button and a bundle saving. 7 markets, including Arabic right to left, and light and dark mode.",
    tags: ["Exterior cleaning", "Three.js", "Cloudflare Pages"],
    thumbnail: "/screenshots/gleam-desktop.webp",
    thumbnailAlt:
      "Gleam on desktop in the UK, with a 3D house, a live total, and a Book this price button.",
    techStackDetailed: [
      "static HTML and JavaScript",
      "Three.js",
      "Cloudflare Pages",
    ],
    underTheHood: [
      {
        title: "Stack",
        description:
          "static HTML and JavaScript built from the wip folder, a Three.js 3D house (Three r170 loaded from a CDN), and Cloudflare Pages (the live host is a pages.dev URL). A GitHub Actions workflow also publishes the built files to GitHub Pages.",
        cardDescription:
          "static HTML and JavaScript, a Three.js 3D house, and Cloudflare Pages.",
      },
      {
        title: "Prices",
        description:
          "prices and the booking message are built in the browser.",
        cardDescription:
          "prices and the booking message are built in the browser.",
      },
      {
        title: "Booking",
        description:
          "a placeholder number is used. Some markets open WhatsApp, others open a prefilled SMS.",
        cardDescription:
          "Some markets open WhatsApp, others open a prefilled SMS.",
      },
      {
        title: "Languages",
        description:
          "English, with an Arabic switch and a right to left layout for the Saudi market, remembered in localStorage.",
        cardDescription:
          "English, with an Arabic switch and a right to left layout for the Saudi market.",
      },
    ],
    showLiveOnCard: true,
    caseStudy: {
      videos: [
        {
          src: "/videos/gleam-desktop-uk.mp4",
          poster: "/screenshots/gleam-desktop-poster.webp",
          width: 1920,
          height: 1200,
          alt: "Laptop demo of Gleam in the UK. Parts of the house are picked, the live total builds, and the request is sent.",
        },
        {
          src: "/videos/gleam-phone-uk.mp4",
          poster: "/screenshots/gleam-phone-poster.webp",
          width: 780,
          height: 1688,
          alt: "Phone demo of Gleam in the UK. Parts of the house are tapped, a bundle saving applies, and the request is sent.",
        },
      ],
      screenshots: [
        "/screenshots/gleam-desktop.webp",
        "/screenshots/gleam-phone-hero.webp",
        "/screenshots/gleam-phone-services.webp",
        "/screenshots/gleam-phone-summary.webp",
        "/screenshots/gleam-phone-sent.webp",
        "/screenshots/gleam-phone-arabic.webp",
        "/screenshots/gleam-phone-dark.webp",
      ],
      screenshotAlts: {
        "/screenshots/gleam-desktop.webp":
          "Gleam on desktop in the UK, with a 3D house, a live total, and a Book this price button.",
        "/screenshots/gleam-phone-hero.webp":
          "Gleam on a phone in the UK, with a live total and a Book this price button.",
        "/screenshots/gleam-phone-services.webp":
          "Gleam on a phone in the UK, with services selected and a bundle saving.",
        "/screenshots/gleam-phone-summary.webp":
          "Gleam on a phone showing a sample booking summary with a bundle saving.",
        "/screenshots/gleam-phone-sent.webp":
          "Gleam on a phone after the request is sent, confirming the name, number, and chosen services.",
        "/screenshots/gleam-phone-arabic.webp":
          "Gleam on a phone in Saudi Arabia in Arabic, with a right to left layout and a live total in riyals.",
        "/screenshots/gleam-phone-dark.webp":
          "Gleam on a phone in dark mode in the UK, with a 3D house and a Book this price button.",
      },
    },
  },
  {
    id: "meridian-freight",
    title: "Meridian Freight",
    liveUrlLabel: "Visit Web Application",
    brief:
      "Step through a freight quote from service and route to cargo and size, then copy the summary. Shipping lanes on a 3D globe, a container load planner, English and Persian right to left, and light and dark mode.",
    tags: ["Freight forwarding", "Three.js", "Cloudflare Pages"],
    thumbnail: "/screenshots/heroes/meridian-freight.webp",
    thumbnailAlt:
      "Meridian Freight on desktop, with a quote from Yiwu to Mashhad and shipping lanes on a 3D globe.",
    techStackDetailed: [
      "React",
      "Vite",
      "TypeScript",
      "Three.js",
      "Cloudflare Pages",
    ],
    underTheHood: [
      {
        title: "Stack",
        description:
          "React, Vite and TypeScript, with Three.js for the globe and the container load planner. Cloudflare Pages hosts the site.",
        cardDescription:
          "React, Vite, TypeScript, Three.js, and Cloudflare Pages.",
      },
      {
        title: "Quote",
        description:
          "The quote is built in the browser, from service and route to cargo and size, then a summary. You can copy it or open it in an email. Nothing you enter is sent to a server.",
        cardDescription:
          "The quote is built in the browser. You can copy the summary or open it in an email.",
      },
      {
        title: "Languages",
        description:
          "English and Persian. Persian switches the page to a right to left layout. Language and the light or dark theme are remembered in the browser.",
        cardDescription:
          "English and Persian, with a right to left layout for Persian, and light and dark mode.",
      },
    ],
    honestNote:
      "This is a portfolio demo for an invented brand, not a freight business. Nothing you enter is sent, and no one replies.",
    showLiveOnCard: true,
    caseStudy: {
      screenshots: ["/screenshots/heroes/meridian-freight.webp"],
      screenshotAlts: {
        "/screenshots/heroes/meridian-freight.webp":
          "Meridian Freight on desktop, with a quote from Yiwu to Mashhad and shipping lanes on a 3D globe.",
      },
    },
  },
  {
    id: "eob-reader",
    title: "EOB Reader",
    liveUrlLabel: "Visit Web Application",
    brief:
      "Upload a batch of insurance PDFs. AI pulls out every line item, a person approves each document, and approved rows export as a CSV.",
    tags: ["Batch extraction", "Human review", "CSV export"],
    thumbnail: "/screenshots/heroes/eob-reader.webp",
    thumbnailAlt:
      "EOB Reader on a soft green background, with a straight browser window and a zoomed card of the extracted amounts.",
    role: "Solo engineer",
    methodology: "End to end",
    techStackDetailed: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "pdf.js",
      "Vercel",
    ],
    underTheHood: [
      {
        title: "Stack",
        description:
          "Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, pdf.js, Vercel.",
        cardDescription:
          "Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, pdf.js, Vercel.",
      },
      {
        title: "Database",
        description:
          "Supabase Postgres and a private storage bucket. The repo migrations create 7 app tables (practices, batches, eob_extractions, eob_line_items, payer_templates, audit_log, and feedback). Row level security is switched on for those tables, with 11 named policies in the migrations (including 3 storage policies).",
        cardDescription:
          "Row level security is switched on for the app tables, with 11 named policies in the migrations (including 3 storage policies).",
      },
      {
        title: "Sign in",
        description:
          "Google sign in through Supabase Auth. The app does not store a password. After sign in, uploads are limited to that Google account.",
        cardDescription:
          "Google sign in through Supabase Auth. After sign in, uploads are limited to that Google account.",
      },
      {
        title: "AI",
        description:
          "Google Gemini first, then Groq, then OpenRouter. A provider is skipped when its key is missing. A local Ollama path exists if AI_PROVIDER is set to ollama. Default Gemini model names in the repo include gemini 3.5 flash lite, gemini 3.1 flash lite, gemini 3.8 flash, and gemini 2.5 flash lite.",
        cardDescription:
          "Google Gemini first, then Groq, then OpenRouter. A provider is skipped when its key is missing.",
      },
      {
        title: "Files",
        description:
          "a scanned PDF with no text layer is skipped.",
      },
      {
        title: "Tests",
        description:
          "25 test cases across 3 test files (extraction, list order, and batch formatting).",
      },
    ],
    honestNote:
      "This is a learning project, not a HIPAA product, and not for real patient information. A public fictional demo works without an account.",
    showLiveOnCard: true,
    caseStudy: {
      problem:
        "This is for staff in a dental office. Insurance companies send payment statements as PDFs, often a stack at a time. Each one lists every treatment, what was charged and what the insurer paid. Someone then types those numbers into the office's software by hand, line by line.",
      solution:
        "You drop in the whole stack at once. EOB Reader reads each PDF and fills in a draft: who paid, for which patient, and every treatment line with its amounts. A person looks at each draft next to the original PDF and approves it, flags it to look at later, or rejects it. Only the approved ones go into the download. That's a spreadsheet file (CSV) laid out the way Dentrix, Eaglesoft or Open Dental expect, or the standard electronic payment file those programs can import. If a PDF is a scan or a photo, it's skipped with a clear message rather than a guess.",
      outcome:
        "The typing is done for you, and a person still has the final say before anything goes into the office's system. The same setup fits any pile of PDFs that has to end up in a spreadsheet or another program, such as invoices, bank statements or supplier price lists. You can try a fictional batch without an account. This is a portfolio project, and it uses fictional data only.",
      screenshots: [
        "/screenshots/eob-reader-review.png",
        "/screenshots/eob-reader-dashboard.png",
        "/screenshots/eob-reader-export.png",
      ],
    },
    keyDecisions:
      "Text only, with no OCR. A scan is turned away with a plain message rather than read badly, and that limit is stated up front. Nothing is exported until a person approves it, because a model can misread a number. That matters even more for the 835. Its builder adds a CO-45 or OA-23 adjustment when a line doesn't balance, so a balanced file doesn't prove the extraction was right, and the human check comes before export for that reason. Free providers go first and the paid fallback goes last. A small health route shows which provider is failing without opening server logs.",
    systemOverview:
      "This app is text only. There's no image or OCR path. The server reads each PDF's text layer with pdf.js. If no page has text, the file is reported as scanned, skipped, and not stored. Text pulled in the browser is used only if the server can't parse the file. Up to 5 files are processed at a time.\n\nEach PDF is stored in a private Supabase Storage bucket under that user's practice folder. Its draft is saved as one extraction row plus line item rows. The review page opens the original through a signed URL that lasts one hour.\n\nThe extraction prompt asks for one JSON object covering the payer, patient, claim and check, plus every line with its code, amounts, adjustment and remark codes, and confidence scores. Gemini is asked through its JSON response type, with an output cap of 4,000 tokens. Groq uses a max_tokens ceiling sized to fit its free tier of 8,000 tokens a minute. OpenRouter's Gemini models use response_format: json_object. The reply is parsed and normalised (field aliases, money strings turned into numbers).",
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
          "GET /api/ai-health works only for users who are signed in. By default it pings one model per provider, or every model with ?all=1. It returns the status for each model plus an error snippet of up to 200 characters, with keys and bearer tokens removed.",
      },
      {
        title: "No raw provider errors",
        description:
          "Provider error text is redacted the same way before it's logged. Upload results show only the plain \"busy\" message.",
      },
      {
        title: "Data kept per user",
        description:
          "Row level security on practices, batches, extractions and line items limits each user to their own practice's rows. Storage policies limit reads, uploads and deletes to that practice's folder.",
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
          "A PDF with several patients keeps only the first one. Reviewers can approve, flag or reject a document, and can't edit a field. The 835 file hasn't been tested against a real clearinghouse or practice management import. The audit log and payer template tables exist but are unused.",
      },
    ],
  },
  {
    id: "cold-email-agent",
    title: "Cold Email Agent",
    brief:
      "A working prototype that sends personalized cold email on a schedule, with a hard cap of 30 emails per day.",
    tags: ["Python", "GitHub Actions", "MailerSend API", "SQLite"],
    thumbnail: "/screenshots/cold_email_agent.png",
    role: "Solo engineer",
    methodology: "Scheduled automation",
    techStackDetailed: [
      "Python",
      "GitHub Actions",
      "SQLite",
      "MailerSend",
    ],
    underTheHood: [
      {
        title: "Stack",
        description:
          "Python, GitHub Actions, SQLite (outreach.db), MailerSend, requests.",
        cardDescription:
          "Python, GitHub Actions, SQLite, MailerSend, requests.",
      },
      {
        title: "How it runs",
        description:
          "a GitHub Actions workflow wakes the agent every 15 minutes, Monday to Friday, in a US morning window (12:00 to 18:00 UTC). Each run sends up to BATCH_SIZE emails and then stops. A DAILY_CAP (default 30) stops further sends that day.",
        cardDescription:
          "a GitHub Actions workflow sends a limited batch on a weekday morning schedule, with a daily cap.",
      },
      {
        title: "Data",
        description:
          "sent state is stored in SQLite and committed back to the repo so the same person is not emailed twice. A suppression list holds unsubscribes.",
        cardDescription:
          "sent state is stored in SQLite so the same person is not emailed twice. A suppression list holds unsubscribes.",
      },
      {
        title: "Personalization",
        description:
          "subject and body variants are chosen in code, not by a live model call.",
        cardDescription:
          "subject and body variants are chosen in code, not by a live model call.",
      },
    ],
    caseStudy: {
      problem:
        "Personalized cold email does not scale by hand. Someone has to throttle sends, log who was contacted, and honor every request to unsubscribe.",
      solution:
        "I built a Python agent that reads leads from a CSV, skips anyone already contacted or opted out, and fills a template opener from the lead's role and company. No model is in the loop. Subject lines rotate from a stable hash of the email address. GitHub Actions runs a short job on a schedule, MailerSend sends the message, and the day stops at 30 emails.",
      outcome:
        "A working prototype. It sends on a schedule and stops at 30 emails per day.",
    },
    keyDecisions:
      "I kept the opener as a template, with no model in the loop, so the text stays consistent and does not invent details. Each run is a short GitHub Actions job that sends up to 2 emails, saves state, and exits. The hard cap is 30 emails per day. Lesson: keep all prospect data out of version control and in each environment's own storage.",
    systemOverview:
      "The pipeline starts from a lead export. A GitHub Actions job runs the agent on a weekday schedule. The Python runner checks each lead against SQLite so it does not contact the same person twice, fills the email, sends it through the MailerSend API, and writes the updated state back so the next run continues from there.",
    stages: [
      {
        title: "1. Lead ingestion and deduplication",
        engine: "Python / SQLite",
        description:
          "Loads leads from a CSV. The agent skips anyone already emailed, still pending, or on the unsubscribe list.",
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
          "Fills an opener from the prospect's job title and company name, then adds a plain text body and an unsubscribe link.",
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
        title: "Unsubscribe",
        description:
          "A suppression list in SQLite blocks future sends. Outgoing email includes an unsubscribe link.",
      },
      {
        title: "Daily cap",
        description:
          "Up to 2 emails per run, and a hard stop at 30 emails per day.",
      },
    ],
    maintenanceProfile:
      "Upload a new leads CSV when the queue is empty, and process unsubscribe requests.",
  },
  {
    id: "youtube-automation",
    title: "YouTube Automation Pipeline",
    brief:
      "Automates script, voice and video generation for long documentary videos, with a manual upload step.",
    tags: ["GitHub Actions", "LLM APIs", "FFmpeg", "Cloudflare R2"],
    thumbnail: "/screenshots/akhir_zamaan_pipeline.png",
    role: "Solo engineer",
    methodology: "Scheduled pipeline",
    techStackDetailed: [
      "Node.js 20",
      "FFmpeg",
      "Cloudflare R2",
      "Telegram",
      "GitHub Actions",
    ],
    underTheHood: [
      {
        title: "Stack",
        description:
          "Node.js 20 on GitHub Actions, FFmpeg, Cloudflare R2 for delivery, Telegram for the download link.",
        cardDescription:
          "Node.js 20 on GitHub Actions, FFmpeg, Cloudflare R2, and Telegram for the download link.",
      },
      {
        title: "AI and media",
        description:
          "Ollama Cloud (gpt-oss:120b-cloud) for script and metadata, optional DeepSeek V3 for the script tier, Tavily for research, image fallback of Hugging Face Flux Schnell then Cloudflare Workers AI then Pollinations, TTS fallback of Edge TTS then Kokoro then StreamElements, and faster-whisper base.en for caption timing.",
        cardDescription:
          "Ollama Cloud for script and metadata, with named fallbacks for images, voice and captions.",
      },
      {
        title: "Source text",
        description:
          "Quran and hadith are read from local files, not generated by a model.",
        cardDescription:
          "Quran and hadith are read from local files, not generated by a model.",
      },
      {
        title: "Status",
        description:
          "frozen as a portfolio case study on 15 July 2026. The scheduled cron is disabled; a manual workflow run remains.",
      },
    ],
    caseStudy: {
      problem:
        "A long video means research, a script, images, a voiceover and an edit. Doing each of those by hand limits how often a video can go out.",
      solution:
        "The pipeline automates script, voice and video generation. On a schedule it researches a topic, writes a documentary script, generates images, renders a voiceover with subtitles, and assembles the file with FFmpeg. The finished video is sent to Telegram. Upload to YouTube is a manual step.",
      outcome:
        "It produces two complete documentary videos a week. Putting it on YouTube is still done by hand.",
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
          "JPEGs and a queue.json file go to R2. A Worker on a cron that runs twice a day reads the queue and calls Make.com, which posts through the Instagram Graph API.",
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
  {
    id: "groundwork",
    title: "Groundwork",
    liveUrlLabel: "Visit Web Application",
    brief:
      "A facility maintenance app for service companies in the Gulf. A client request becomes a job, the office assigns a technician, the technician finishes it on his phone, and the client sees every step.",
    tags: ["Maintenance", "22 languages", "Spoken notes"],
    thumbnail: "/screenshots/heroes/groundwork.webp",
    thumbnailAlt:
      "Groundwork on a light background, with the owner day in a browser window and the same day on a phone.",
    role: "Solo engineer",
    methodology: "End to end",
    techStackDetailed: ["Next.js 16", "React 19", "TypeScript", "Auth.js", "node-postgres", "Vercel"],
    showLiveOnCard: true,
    whatYouCanTry: [
      "9 demo people: owner, admin, supervisor, office staff, technician, two client managers, client staff and a home client. Each one sees the same company through their own role.",
      "Each visitor gets a private copy of the demo company, which deletes itself after 6 hours.",
    ],
    underTheHood: [
      {
        title: "Database",
        description:
          "Neon Postgres. 64 tables, built by 75 versioned migrations. 33 of those migrations have a rollback script.",
      },
      {
        title: "Data separation",
        description:
          "row level security is switched on and forced on every table (64 of 64), with 180 policies. One company can never see another company's data, a client sees only his own company's jobs, and a technician sees only the jobs given to him, even if the app code has a bug.",
        cardDescription:
          "row level security is switched on and forced on every table (64 of 64), with 180 policies.",
      },
      {
        title: "Database logins",
        description:
          "the app connects with a limited login that cannot bypass row level security and cannot change the database structure. Migrations run under a separate owner login.",
        cardDescription:
          "the app connects with a limited login that cannot bypass row level security and cannot change the database structure.",
      },
      {
        title: "Roles",
        description:
          "owner, admin, supervisor, office staff, technician, client manager, client staff and home client. Permissions are checked on the server and again inside the database, not just hidden buttons.",
        cardDescription:
          "Permissions are checked on the server and again inside the database, not just hidden buttons.",
      },
      {
        title: "History",
        description:
          "database triggers record every change to jobs, clients, sites and team. The app's own login can read this history but cannot edit or delete it.",
      },
      {
        title: "Secrets",
        description:
          "WhatsApp phone numbers, message text and voice notes are encrypted with AES 256 GCM before they are stored. Agent access keys are stored only as hashes and shown once.",
        cardDescription: "Agent access keys are stored only as hashes and shown once.",
      },
      {
        title: "Sign in",
        description:
          "Google sign in with database sessions, one time codes for field workers who have no email, and the one tap demo logins.",
      },
      {
        title: "AI assistant",
        description:
          "answers from the app's own data and asks before changing anything. Runs on free models (Google Gemini, Groq, OpenRouter and others), with a daily limit per company and a per minute limit per person kept in the database.",
      },
      {
        title: "Speed",
        description:
          "tested on a copy with 21,000 jobs and 250,000 history rows. Every API answers in under 300 ms and every page loads in under 1.5 s. Jobs load 50 at a time.",
        cardDescription:
          "Every API answers in under 300 ms and every page loads in under 1.5 s.",
      },
      {
        title: "Reliability",
        description:
          "every create carries an idempotency key so a retry never makes a duplicate, queries stop at 8 seconds with a clear message, and the app works offline for pages already opened.",
      },
      {
        title: "Languages",
        description: "22 languages including Arabic (Gulf Arabic, right to left layout).",
      },
      {
        title: "Stack",
        description: "Next.js 16, React 19, TypeScript, Auth.js, node-postgres, Vercel.",
      },
      {
        title: "Tests",
        description: "4,827 automated tests, including row level security checks for every role.",
      },
    ],
    honestNote:
      "WhatsApp intake is shown as a preview in the demo; a live WhatsApp provider is not connected yet.",
    caseStudy: {
      problem:
        "This is for small maintenance, plumbing and HVAC companies in the Gulf. The day's work is scattered across WhatsApp chats, paper notes and phone calls. A late job is easy to miss, and a day off is easy to double book. When the work is finished, the note often just says done, even when the fix will not last or a part is still missing.",
      solution:
        "Groundwork puts the company in one place. The owner, the admin, the supervisor, the technician and the client each open their own screen. It lays out the day, marks late jobs, counts each person's jobs, and keeps days off on the plan. A technician closes a job from a spoken note and says how it ended: fixed, a temporary fix, waiting on a part, or not fixable. Documents show when they run out. Clients follow their own requests. A practice chat, in the style of WhatsApp, answers questions about the work. It runs in 22 languages, including right to left.",
      outcome:
        "You can try the whole company with one click. Open the live app, tap Try the demo, and pick a person. Each visit gets its own practice jobs, separate from real accounts, and they clear after 6 hours. This is a portfolio project, and it uses practice data only.",
      screenshots: [
        "/screenshots/groundwork-desktop-home.png",
        "/screenshots/groundwork-desktop-schedule.png",
        "/screenshots/groundwork-desktop-documents.png",
        "/screenshots/groundwork-desktop-report.png",
        "/screenshots/groundwork-phone-report.png",
        "/screenshots/groundwork-phone-client.png",
        "/screenshots/groundwork-phone-chat.png",
        "/screenshots/groundwork-phone-arabic.png",
      ],
      screenshotAlts: {
        "/screenshots/groundwork-desktop-home.png":
          "Groundwork on desktop for the owner, with today's jobs, late jobs, and a plan to approve.",
        "/screenshots/groundwork-desktop-schedule.png":
          "Groundwork week plan on desktop, with a technician marked on leave and jobs across the week.",
        "/screenshots/groundwork-desktop-documents.png":
          "Groundwork documents on desktop, with permits and certificates that are expired or close to expiry.",
        "/screenshots/groundwork-desktop-report.png":
          "Groundwork job report on desktop, with a spoken note and the choices fixed, temporary fix, needs a part, and can't be fixed.",
        "/screenshots/groundwork-phone-report.png":
          "Groundwork on a phone, where a technician speaks or types what he found before closing the job.",
        "/screenshots/groundwork-phone-client.png":
          "Groundwork on a phone for the client, with maintenance requests and jobs that need a time confirmed.",
        "/screenshots/groundwork-phone-chat.png":
          "Groundwork practice chat on a phone, with the assistant listing late jobs from the sample company.",
        "/screenshots/groundwork-phone-arabic.png":
          "Groundwork on a phone in Arabic, with a right to left layout, today's jobs, and late work.",
      },
    },
    keyDecisions:
      "The day plan is a proposal. Nothing is saved until the owner says yes. The job report does not choose an outcome. The technician says what happened, in his own language, and then picks fixed, a temporary fix, needs a part, or can't be fixed. A practice visit gets its own copy of the company, and that copy clears after 6 hours, so a judge can try it without touching a real account.",
    systemOverview:
      "Each role opens a different home. The owner sees the day, the late jobs, prices waiting on the client, and a plan he can approve. The technician sees only his own jobs, speaks or types a note, and files the report. The client sees only his own requests and can confirm a time. The practice chat answers from the sample jobs and says plainly that it is not connected to WhatsApp. Choosing Arabic switches that person's screens to a right to left layout. The app is a Next.js site on Vercel.",
    stages: [
      {
        title: "1. Requests come in",
        description:
          "Clients send a request, or the office adds one. It lands in one list instead of a chat thread.",
      },
      {
        title: "2. The day is planned",
        description:
          "Open jobs are placed against the people who are in, their trade, and their days off. Nothing is saved until someone approves the plan.",
      },
      {
        title: "3. The job is closed in words",
        description:
          "The technician speaks or types what he found and what he did, then picks how it ended. The report stays on the job.",
      },
      {
        title: "4. The client sees the result",
        description:
          "The client follows his own requests from open to done, including work that is waiting on a part.",
      },
    ],
    constraints: [
      {
        title: "Practice copy",
        description:
          "Each visitor gets a private copy of the sample company. It expires after 6 hours and is then cleared. Real accounts never see that data.",
      },
      {
        title: "The person decides",
        description:
          "A plan, a lesson, and a job outcome wait for a yes. The report does not pick how the job ended.",
      },
      {
        title: "Languages",
        description:
          "The screens run in 22 languages. Arabic, Urdu and the other right to left languages flip the layout. Voice is marked ready in English and still early in the other languages.",
      },
      {
        title: "Practice chat",
        description:
          "The chat uses the sample company and is not connected to WhatsApp.",
      },
    ],
  },
];

const orderedProjects = [
  ...baseProjects.filter((project) => project.id === "groundwork"),
  ...baseProjects.filter((project) => project.id !== "groundwork"),
];

export const projects: Project[] = orderedProjects.map((project) => ({
  ...project,
  liveUrl: projectLinks[project.id]?.liveUrl || project.liveUrl,
  githubUrl: projectLinks[project.id]?.githubUrl || project.githubUrl,
}));
