const points = [
  "It never sends, pays, deletes or changes important records without a person approving it.",
  "It only sees the data each role is allowed to see.",
  "Every action is logged, so you can check what happened.",
  "Your data stays in your accounts.",
];

export default function NeverAlone() {
  return (
    <section id="ai-never-alone" className="relative border-t border-border px-5 py-24 sm:px-6 md:py-40">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-balance text-2xl font-medium tracking-tight text-foreground">
          What AI never does alone
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {points.map((point) => (
            <li
              key={point}
              className="rounded-lg border border-border p-6 text-pretty text-base leading-relaxed text-foreground sm:p-8 sm:text-lg"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
