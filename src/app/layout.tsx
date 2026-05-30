import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adhil Shanif — Full-Stack AI Engineer",
  description:
    "I build production AI systems end-to-end — LLM apps, autonomous agents, full-stack SaaS, and automation pipelines.",
  keywords: [
    "Full-Stack AI Engineer",
    "LLM Applications",
    "Autonomous Agents",
    "Next.js Developer",
    "OpenAI API",
    "Supabase",
    "AI SaaS",
    "Dubai",
  ],
  authors: [{ name: "Adhil Shanif" }],
  openGraph: {
    title: "Adhil Shanif — Full-Stack AI Engineer",
    description:
      "I build production AI systems end-to-end — LLM apps, autonomous agents, full-stack SaaS, and automation pipelines.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
