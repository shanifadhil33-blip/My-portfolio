// Direction: clean agency editorial. Dark and light zones alternate, one sky accent, CSS 3D where it explains something.
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Agencies from "@/components/Agencies";
import WhatIBuild from "@/components/WhatIBuild";
import Work from "@/components/Work";
import HowIWork from "@/components/HowIWork";
import About from "@/components/About";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import { homeGraph } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={homeGraph()} />
      <Navbar />
      <main id="main" className="flex-1">
        <Hero />
        <Agencies />
        <WhatIBuild />
        <Work />
        <HowIWork />
        <About />
        <Contact />
      </main>
    </>
  );
}
