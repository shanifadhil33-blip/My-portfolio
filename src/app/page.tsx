// Direction: clean editorial. Dark and light zones alternate, one sky accent, CSS 3D where it explains something.
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatIBuild from "@/components/WhatIBuild";
import Work from "@/components/Work";
import HowIWork from "@/components/HowIWork";
import About from "@/components/About";
import Contact from "@/components/Contact";
import HashScroll from "@/components/HashScroll";
import JsonLd from "@/components/JsonLd";
import { homeGraph } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={homeGraph()} />
      <HashScroll />
      <Navbar />
      <main id="main" className="flex-1">
        <Hero />
        <Work />
        <HowIWork />
        <WhatIBuild />
        <About />
        <Contact />
      </main>
    </>
  );
}
