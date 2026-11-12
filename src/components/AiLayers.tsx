const steps = [
  { title: "Agents that own the job", line: "A coordinator sends the work to the right agent." },
  { title: "Work in the real tools", line: "Email, the CRM, accounting, and the company files." },
  { title: "Routine work just runs", line: "A discount above the limit waits for a person." },
  { title: "Cloud, or your server", line: "The data can stay inside the company." },
] as const;

export default function AiLayers() {
  return (
    <div className="mt-16 md:mt-24">
      <h3 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Forward deployed engineering, explained
      </h3>
      <p className="mt-3 max-w-xl text-pretty text-lg leading-relaxed text-muted">
        How an AI team joins a business and does real work, in about a minute.
      </p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-[#dbe2ea] bg-white shadow-[0_18px_40px_-28px_rgba(15,30,50,0.28)] sm:mt-10">
        <video
          className="aspect-video w-full bg-[#F8F1E7]"
          controls
          playsInline
          preload="metadata"
          poster="/ai-team/forward-deployed-poster.png"
          width={1920}
          height={1080}
          aria-label="Forward deployed engineering, explained"
        >
          <source src="/ai-team/forward-deployed.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12">
        {steps.map((step) => (
          <div key={step.title}>
            <h3 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{step.title}</h3>
            <p className="mt-3 max-w-xl text-pretty text-lg leading-relaxed text-muted">{step.line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
