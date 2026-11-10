import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { baseGraph } from "@/lib/schema";
import { PAGE_DESCRIPTION, PAGE_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Verification tokens come from Vercel environment variables, never from the code.
// Set GOOGLE_SITE_VERIFICATION and/or BING_SITE_VERIFICATION, then redeploy.
const verification: Metadata["verification"] = {
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
  ...(process.env.BING_SITE_VERIFICATION
    ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
    : {}),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: PAGE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: PAGE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Adhil Shanif", url: SITE_URL }],
  creator: "Adhil Shanif",
  // Canonicals are set per page. A layout-level canonical would leak into every child route.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: SITE_URL,
    type: "profile",
    siteName: SITE_NAME,
    locale: "en_US",
    firstName: "Adhil",
    lastName: "Shanif",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  ...(Object.keys(verification).length ? { verification } : {}),
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <JsonLd data={baseGraph()} />
        {children}
      </body>
    </html>
  );
}
