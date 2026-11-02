export const SITE_URL = "https://adhilshanif.vercel.app";

export const EMAIL = "shanifadhil33@gmail.com";

export const UPWORK_URL =
  "https://www.upwork.com/freelancers/~01cdd13e31bc19479c";

export const LINKEDIN_URL =
  "https://www.linkedin.com/in/adhil-shanif-83a233358?utm_source=share_via&utm_content=profile&utm_medium=member_android";

export const WHATSAPP_URL = "https://wa.me/971506884500";

export const GITHUB_URL = "https://github.com/shanifadhil33-blip";

export const PAGE_TITLE =
  "Adhil Shanif | Forward Deployed AI Engineer";

export const PAGE_DESCRIPTION =
  "I find what's slowing your business down, and build AI that fixes it. Fixed scope. You own everything I build.";

export const ROLE = "Forward Deployed AI Engineer";

export function mailtoHref(subject: string): string {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}
