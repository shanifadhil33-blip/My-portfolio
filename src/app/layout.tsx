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

// Search Console ownership token. It is public by design (it is printed in the page head).
// The same property is also verified by public/googleaed0761f28171045.html.
const GOOGLE_SITE_VERIFICATION = "Afdg9xFnyZ4Wcve0jGvVDc_uk_DAqlsZCa0CJqxu_tc";

// A Bing token can be added later through the BING_SITE_VERIFICATION environment variable.
const verification: Metadata["verification"] = {
  google: process.env.GOOGLE_SITE_VERIFICATION || GOOGLE_SITE_VERIFICATION,
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
  verification,
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
