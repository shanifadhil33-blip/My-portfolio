export const SITE_URL = "https://adhilshanif.vercel.app";

export const EMAIL = "shanifadhil6@gmail.com";

export const UPWORK_URL =
  "https://www.upwork.com/freelancers/~01cdd13e31bc19479c";

export const LINKEDIN_URL =
  "https://www.linkedin.com/in/adhil-shanif-83a233358?utm_source=share_via&utm_content=profile&utm_medium=member_android";

export const GITHUB_URL = "https://github.com/shanifadhil33-blip";

export const PAGE_TITLE =
  "Adhil Shanif | Custom Software & AI Systems Engineer";

export const PAGE_DESCRIPTION =
  "I build internal tools, SaaS platforms and AI systems end to end, and hand them over working. Based in Dubai.";

export const ROLE = "Custom Software & AI Systems Engineer";

export function mailtoHref(subject: string): string {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}
