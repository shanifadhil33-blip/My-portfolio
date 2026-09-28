// Direction: precision tech. Flat near-black, one muted stone accent, type and space only.
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ClientWork from "@/components/ClientWork";
import Projects from "@/components/Projects";
import HowIWork from "@/components/HowIWork";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <ClientWork />
        <Projects />
        <HowIWork />
        <Contact />
      </main>
    </>
  );
}
