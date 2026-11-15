import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { audiences } from "@/data/services";
import FlipCard from "./FlipCard";
import BuildGrid from "./BuildGrid";
import { PillLink, SectionHead } from "./ui";

export default function WhatIBuild() {
  return (
    <section id="services" aria-labelledby="services-title" className="zone-dark glow glow-left relative px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          id="services-title"
          n="02"
          label="What I build"
          title="One area or the whole build."
          lead="I build web apps, backend systems, APIs, integrations and AI features. A project can cover one area or several connected parts of a product."
        />

        <div className="mt-14 md:mt-16">
          <BuildGrid />
        </div>
        <div className="mt-8">
          <PillLink href="/brief">Send a brief</PillLink>
        </div>

        <h3 className="mt-24 text-2xl font-semibold tracking-tight text-foreground md:mt-28">Who I work with</h3>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {audiences.map((audience, i) => (
            <FlipCard key={audience.id} audience={audience} index={i} />
          ))}
        </div>

        <Link
          href="/services"
          className="mt-10 inline-flex min-h-11 items-center gap-2 text-base text-accent underline-offset-4 hover:underline"
        >
          See what each project stage includes <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
