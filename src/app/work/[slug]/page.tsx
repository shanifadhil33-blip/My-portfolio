import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyView from "@/components/CaseStudyView";
import { caseStudies, caseStudyBySlug } from "@/data/caseStudies";
import { shareMeta } from "@/lib/site";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.sentence,
    alternates: { canonical: `/work/${study.slug}` },
    ...shareMeta(study.title, study.sentence, `/work/${study.slug}`),
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) notFound();
  return <CaseStudyView study={study} />;
}
