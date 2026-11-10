import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Paths that are never useful in search. robots.txt is a crawl hint, not access control:
// the inbox and APIs are protected by sign in and server checks, not by this file.
const PRIVATE = ["/api/", "/inbox"];

// Search indexes and user-requested fetches. Listed explicitly so each one is clearly allowed.
const SEARCH_AND_USER_AGENTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // fetches a page when a ChatGPT user asks for it
  "Claude-SearchBot", // Claude search index
  "Claude-User", // fetches a page when a Claude user asks for it
  "PerplexityBot",
  "Perplexity-User",
  "DuckDuckBot",
  "Applebot",
];

// Model-training crawlers. Separate from search: blocking these does not remove the site from
// ChatGPT, Claude or Google search. Set to false to opt out of training.
const ALLOW_AI_TRAINING = true;
const TRAINING_AGENTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  // Preview and development deployments must never be indexed.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      { userAgent: SEARCH_AND_USER_AGENTS, allow: "/", disallow: PRIVATE },
      ALLOW_AI_TRAINING
        ? { userAgent: TRAINING_AGENTS, allow: "/", disallow: PRIVATE }
        : { userAgent: TRAINING_AGENTS, disallow: "/" },
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
