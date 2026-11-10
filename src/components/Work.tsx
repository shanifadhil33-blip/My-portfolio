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
          lead="Client work, with details anonymised, and live personal projects you can open and use."
        />
        <div className="mt-16 flex flex-col gap-24 md:mt-20 md:gap-32">
          <ClientWork />
          <Projects />
        </div>
      </div>
    </section>
  );
}
