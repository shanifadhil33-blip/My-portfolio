import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      {/* Fixed ambient glow */}
      <div className="ambient-bg" />

      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
