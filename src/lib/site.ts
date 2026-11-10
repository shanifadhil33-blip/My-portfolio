// One canonical origin. If a custom domain is added later, change it here only:
// canonicals, sitemap, robots, JSON-LD and Open Graph all read from this value.
export const SITE_URL = "https://adhilshanif.vercel.app";

export const SITE_NAME = "Adhil Shanif";

export const EMAIL = "shanifadhil33@gmail.com";

export const UPWORK_URL =
  "https://www.upwork.com/freelancers/~01cdd13e31bc19479c";

export const LINKEDIN_URL = "https://www.linkedin.com/in/adhil-shanif-83a233358";

export const WHATSAPP_URL = "https://wa.me/971506884500";

export const GITHUB_URL = "https://github.com/shanifadhil33-blip";

export const ROLE = "Independent Software Engineer";

export const HEADLINE = "The engineer behind the build.";

export const SUBHEADLINE =
  "Independent software engineer for agencies, founders and businesses — from a single backend task to complete, production-ready products.";

export const PAGE_TITLE = "Adhil Shanif — Software Engineer & Technical Delivery Partner";

export const PAGE_DESCRIPTION =
  "Independent software engineer in Dubai building custom software, backends, APIs, integrations and AI systems for agencies, founders and businesses.";

export function mailtoHref(subject: string): string {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}

const SHARE_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: `Adhil Shanif, ${ROLE}` };

/** Per-page Open Graph and Twitter fields, so every page shares its own URL and the site image. */
export function shareMeta(title: string, description: string, path: string) {
  const full = `${title} | ${SITE_NAME}`;
  return {
    openGraph: { title: full, description, url: path, type: "website" as const, siteName: SITE_NAME, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image" as const, title: full, description, images: [SHARE_IMAGE.url] },
  };
}
