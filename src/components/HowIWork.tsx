const steps = [
  {
    title: "Find the bottleneck.",
    body: "I look at your numbers, from new interest through to sales and repeat customers, and find the one step holding everything back.",
  },
  {
    title: "Plan the fix.",
    body: "I break it into small, concrete actions and decide which ones AI should do and which need a person.",
  },
  {
    title: "Build and connect.",
    body: "The AI works inside the tools you already use, such as your email, CRM, sheets and messaging.",
  },
  {
    title: "Test until it's reliable.",
    body: "Every system is run many times against real cases and scored, so it works every time, not just once.",
  },
  {
    title: "Hand it over.",
    body: "It runs in your own accounts with clear notes. No lock-in.",
  },
];

export default function HowIWork() {
  return (
    <section id="how-i-work" className="relative px-5 py-24 sm:px-6 md:py-40">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-balance text-2xl font-medium tracking-tight text-foreground">
          How I work
        </h2>

        <ol className="mt-12 grid grid-cols-1 gap-4 md:max-w-3xl">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-lg border border-border p-5 sm:gap-6 sm:p-8"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-sm font-medium text-accent"
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-medium text-foreground">
                  <span className="sr-only">{index + 1}. </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-pretty text-base leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
