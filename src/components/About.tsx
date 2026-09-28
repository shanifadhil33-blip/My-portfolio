import { UPWORK_URL } from "@/lib/site";

const stats = [
  "Top Rated on Upwork",
  "100% Job Success Score",
  "5.0 client rating",
];

const coreStack = [
  "Next.js",
  "TypeScript",
  "Python",
  "FastAPI",
  "Supabase (Postgres)",
  "OpenAI",
  "Claude",
  "Gemini",
];

const secondaryStack = [
  "Vercel",
  "Render",
  "Docker",
  "GitHub Actions",
  "Cloudflare",
];

const capabilities = [
  {
    title: "Internal tools and dashboards",
    description: "Role-based access, approvals, reporting, admin panels.",
  },
  {
    title: "Multi-user SaaS platforms",
    description:
      "Tenant-separated data, row-level security, user roles, configuration-driven workflows.",
  },
  {
    title: "AI systems",
    description:
      "Multi-step LLM pipelines, structured extraction from documents, human approval steps, validation so output stays accurate.",
  },
  {
    title: "Automation and integrations",
    description: "Scheduled jobs, webhooks, syncing data between systems.",
  },
];

const cardClass = "rounded-lg border border-border bg-background";

export default function About() {
  return (
    <section id="about" className="relative px-5 py-24 sm:px-6 md:py-40">
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col items-center text-center md:mb-20">
          <h2 className="text-balance text-2xl font-medium tracking-tight text-foreground">
            About
          </h2>
        </div>

        <div className="mb-24 grid grid-cols-1 items-start gap-12 lg:mb-32 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="mb-6 text-pretty text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
              I design and build custom software for businesses that need something off-the-shelf tools can&apos;t do.
            </p>
            <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
              That usually means internal tools, multi-user SaaS platforms and AI systems that have to work reliably with real data. I own the whole build: database design, backend, frontend, AI integration and deployment. I work in fixed-price milestones and communicate in writing, so every decision is documented.
            </p>
          </div>

          <div className="w-full lg:col-span-5">
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat}
                  className={`${cardClass} flex flex-col items-center p-6 text-center transition-colors duration-150 hover:border-foreground/25 lg:items-start lg:text-left`}
                >
                  <div className="text-base font-medium leading-snug text-foreground sm:text-lg">
                    {stat}
                  </div>
                </div>
              ))}
            </div>
            <a
              href={UPWORK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-accent underline underline-offset-4 transition-colors duration-150 hover:text-accent-hover"
            >
              Verified on Upwork
            </a>
          </div>
        </div>

        <div className="mb-24 lg:mb-32">
          <h3 className="mb-10 text-center text-xl font-medium tracking-tight text-foreground lg:text-left">
            What I build
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className={`${cardClass} h-full p-6 transition-colors duration-150 hover:border-foreground/25 sm:p-8`}
              >
                <h4 className="text-lg font-medium text-foreground">{cap.title}</h4>
                <p className="mt-2 text-base leading-relaxed text-muted">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-24 lg:mb-32">
          <h3 className="mb-10 text-center text-xl font-medium tracking-tight text-foreground lg:text-left">
            Stack
          </h3>

          <div className={`${cardClass} p-6 sm:p-8`}>
            <p className="mb-4 text-sm font-medium text-muted">Core</p>
            <div className="flex flex-wrap gap-2.5">
              {coreStack.map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-6 text-base leading-relaxed text-muted">
              {secondaryStack.join(", ")}
            </p>
          </div>

          <div className={`${cardClass} mt-6 px-5 py-4 text-center`}>
            <p className="text-base text-muted">
              I pick up whatever a project actually requires.
            </p>
          </div>
        </div>

        <div className={`${cardClass} p-8 sm:p-10`}>
          <p className="text-sm font-medium text-muted">Engineering approach</p>
          <blockquote className="mt-4 text-pretty text-base font-medium leading-relaxed text-foreground sm:text-lg">
            Most software problems are data problems. I start with the database and the rules, then build the screens on top, so the system stays correct as it grows.
          </blockquote>
        </div>
      </div>
    </section>
  );
}
