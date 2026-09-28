import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PAGE_DESCRIPTION, PAGE_TITLE, SITE_URL } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  keywords: [
    "Custom software engineer",
    "AI systems",
    "Internal tools",
    "SaaS",
    "Next.js",
    "Supabase",
    "Dubai",
  ],
  authors: [{ name: "Adhil Shanif" }],
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
    siteName: "Adhil Shanif",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
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
