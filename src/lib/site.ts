// One canonical origin. If a custom domain is added later, change it here only:
// canonicals, sitemap, robots, JSON-LD and Open Graph all read from this value.
export const SITE_URL = "https://adhilshanif.vercel.app";

export const SITE_NAME = "Adhil Shanif";

export const EMAIL = "shanifadhil33@gmail.com";

export const UPWORK_URL =
  "https://www.upwork.com/freelancers/~01cdd13e31bc19479c";

export const LINKEDIN_URL = "https://www.linkedin.com/in/adhil-shanif-83a233358";

export const WHATSAPP_URL = "https://wa.me/971504874729";

export const GITHUB_URL = "https://github.com/shanifadhil33-blip";

export const ROLE = "Software Delivery Partner";

export const HEADLINE = "Your client needs software. I own the build.";

export const SUBHEADLINE =
  "For agencies and consultants who sell software but don't have the engineers to deliver it. I take full technical responsibility, from scope to a deployed, tested product, under your brand, with written updates. AI coding agents let me deliver in weeks, not months.";

export const PAGE_TITLE = "Adhil Shanif | Software Delivery Partner";

export const PAGE_DESCRIPTION =
  "Software delivery partner in Dubai for agencies and consultants, and for founders and businesses. I own the build from scope to a deployed, tested product.";

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
