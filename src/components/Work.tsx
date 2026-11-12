import ClientWork from "./ClientWork";
import Projects from "./Projects";
import { SectionHead } from "./ui";

export default function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="zone-light relative px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          id="work-title"
          n="03"
          label="Work"
          title="Delivered software, not mockups."
          lead="Client work first, with details anonymised, then demos and personal builds you can open and try."
        />
        <div className="mt-16 flex flex-col gap-24 md:mt-20 md:gap-32">
          <ClientWork />
          <Projects />
        </div>
      </div>
    </section>
  );
}
