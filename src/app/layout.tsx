import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adhil Shanif — AI Integration Engineer",
  description:
    "I ship production Next.js apps with Claude, GPT, and Groq integrations. AI-powered web applications and automation systems for businesses.",
  keywords: [
    "AI Engineer",
    "Next.js Developer",
    "Claude API",
    "GPT Integration",
    "Groq",
    "Supabase",
    "Full Stack Developer",
    "Dubai",
  ],
  authors: [{ name: "Adhil Shanif" }],
  openGraph: {
    title: "Adhil Shanif — AI Integration Engineer",
    description:
      "I ship production Next.js apps with Claude, GPT, and Groq integrations.",
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
