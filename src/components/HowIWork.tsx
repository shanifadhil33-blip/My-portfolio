const points = [
  "Fixed-price milestones. You fund a milestone, I deliver it, you approve it.",
  "Written communication only, so every decision is on record.",
  "You own the code, the accounts and the infrastructure from day one.",
  "Pricing is set by scope, after I understand what you need.",
];

export default function HowIWork() {
  return (
    <section id="how-i-work" className="relative px-5 py-24 sm:px-6 md:py-40">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-balance text-2xl font-medium tracking-tight text-foreground">
          How I work
        </h2>

        <div className="mt-8 max-w-2xl space-y-3">
          {points.map((point) => (
            <p
              key={point}
              className="rounded-lg border border-border px-5 py-4 text-base leading-relaxed text-foreground"
            >
              {point}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
