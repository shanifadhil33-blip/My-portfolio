const projects = [
  {
    name: "Groundwork:",
    body: "AI agents that run a field service company's daily jobs in 22 languages, by voice or text, with permissions for every role.",
  },
  {
    name: "Nazir:",
    body: "an AI that tests other AI assistants for safety and accuracy before they go live, in English and Arabic. Over 1,700 automated tests.",
  },
  {
    name: "Soldline:",
    body: "an AI delivery agent for agencies that connects HubSpot, ClickUp and Google, with a person approving every action.",
  },
];

export default function Proof() {
  return (
    <section id="proof" className="relative border-t border-border px-5 py-24 sm:px-6 md:py-40">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-balance text-2xl font-medium tracking-tight text-foreground">
          Proof
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <li
              key={project.name}
              className="rounded-lg border border-border p-6 text-pretty text-base leading-relaxed text-muted sm:p-8"
            >
              <span className="font-medium text-foreground">{project.name}</span> {project.body}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
