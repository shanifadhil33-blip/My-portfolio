import { techLayers } from "@/data/services";
import { SectionHead } from "./ui";

export default function WhatIBuild() {
  return (
    <section id="services" aria-labelledby="services-title" className="zone-light relative px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead id="services-title" n="03" label="What I build" title="The stack behind the work." />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {techLayers.map((group) => (
            <div key={group.layer}>
              <h3 className="font-mono text-xs tracking-[0.16em] text-accent uppercase">{group.layer}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={`inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm text-foreground ${
                      item === "AI agent orchestration" ? "border-accent bg-accent/10 font-medium" : "border-border bg-surface"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
