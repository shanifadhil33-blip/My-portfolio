# Search and AI-search visibility

How this site is set up to be found by search engines and AI assistants, what still needs an account owner, and how to measure it honestly. Nothing here guarantees indexing, rankings or AI citations: those are decided by each platform.

## What the code does

| Area | Where | Notes |
| --- | --- | --- |
| Canonical origin | `src/lib/site.ts` → `SITE_URL` | Change it in one place if a custom domain is added. Then add the new domain in Vercel, redirect the old `vercel.app` domain to it, and update Search Console. |
| Titles, descriptions, canonicals | Each `page.tsx` `metadata`, plus the template in `src/app/layout.tsx` | No layout-level canonical, so a child page can never inherit the homepage canonical. |
| Open Graph / Twitter | `shareMeta()` in `src/lib/site.ts`, image from `src/app/opengraph-image.tsx` | |
| robots.txt | `src/app/robots.ts` | Search crawlers and user-request fetchers are allowed. Training crawlers follow `ALLOW_AI_TRAINING`. `/api/` and `/inbox` are not crawled. Preview builds (`VERCEL_ENV=preview`) disallow everything. |
| sitemap.xml | `src/app/sitemap.ts` | Only indexable canonical pages. `lastModified` uses real content dates: update `UPDATED` when you change a page. |
| Structured data | `src/lib/schema.ts` | Person, WebSite, ProfilePage, ItemList of projects (home); WebPage, Service, BreadcrumbList (`/services`). No ratings or business claims. |
| Verification | `src/app/layout.tsx` | Reads `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` from Vercel environment variables. |

### Crawlers

- **Search indexes:** Googlebot, Bingbot, OAI-SearchBot (ChatGPT search), Claude-SearchBot, PerplexityBot, DuckDuckBot, Applebot.
- **User-requested fetches:** ChatGPT-User, Claude-User, Perplexity-User. These run when a person asks an assistant to open a page; they are not indexing.
- **Training:** GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot. Allowing or blocking these does not change whether the site appears in ChatGPT, Claude or Google search. To opt out of training, set `ALLOW_AI_TRAINING = false`.

References: [OpenAI crawlers](https://developers.openai.com/api/docs/bots) · [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) · [Google AI features and your site](https://developers.google.com/search/docs/appearance/ai-features)

### Deliberately not done

- **No `llms.txt`.** No major search engine documents using it for ranking or citation.
- **No IndexNow.** The site has a handful of pages that change rarely. Bing Webmaster Tools reads the sitemap, which is enough. Reconsider if the site grows to many frequently updated pages.
- **No analytics added.** The privacy page promises no tracking cookies. Vercel Web Analytics is cookieless and free on Hobby if you want visit and referrer data; enabling it needs a privacy page update.
- **No FAQ blocks, hidden text or location pages.**

## Account-owner steps

1. **Google Search Console** — https://search.google.com/search-console
   - Add a *URL prefix* property for `https://adhilshanif.vercel.app/` (a Domain property is not possible on a `vercel.app` subdomain).
   - Choose *HTML tag*, copy only the `content` value, add it in Vercel → Project → Settings → Environment Variables as `GOOGLE_SITE_VERIFICATION` (Production), redeploy, then click *Verify*.
   - *Sitemaps* → submit `sitemap.xml`.
   - *URL Inspection* → inspect `/` and `/services`, then *Request indexing*.
   - Afterwards check *Pages* (indexing), *Performance* (queries, clicks, impressions) and any AI features or generative AI reporting the property shows.
2. **Bing Webmaster Tools** — https://www.bing.com/webmasters
   - Easiest: *Import from Google Search Console* once Google is verified.
   - Otherwise choose *Meta tag*, put the `content` value in `BING_SITE_VERIFICATION`, redeploy and verify. Submit `https://adhilshanif.vercel.app/sitemap.xml`.
   - Bing's index also feeds Copilot and some other assistants.
3. **Check structured data** after deploying:
   - https://search.google.com/test/rich-results (enter the live URL)
   - https://validator.schema.org/

## Measuring

| What | Where |
| --- | --- |
| Impressions, clicks, non-branded queries | Search Console → Performance (filter out queries containing "adhil") |
| Indexed pages | Search Console → Pages; Bing → Search Performance / URL Inspection |
| AI-search referrals | Visitors from ChatGPT often arrive with `utm_source=chatgpt.com`; Perplexity, Copilot and Gemini show as referrers. You need analytics (see above) to see these. |
| Crawler visits | Vercel → Project → Logs, filter by user agent (e.g. `OAI-SearchBot`, `Claude-SearchBot`). A crawler visit is not a human visit. |
| Enquiries | Count briefs by source: ask "How did you find me?" in replies. |

Many AI answers never produce a click, so referral numbers undercount visibility.

### Manual AI-answer check (monthly)

Ask each platform the same buyer-style questions in a fresh, logged-out session. Record what you see. One answer is a snapshot, not a ranking.

Example questions:
- "Freelance engineer who can take over backend work for my agency's client project"
- "Independent developer in Dubai who builds multi-tenant SaaS with Supabase"
- "Who can build an AI document extraction tool with human review?"
- "Adhil Shanif software engineer" (branded, checks accuracy)

| Date | Platform | Query | Site shown? | Cited URL | Accurate? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| | ChatGPT search | | | | | |
| | Claude | | | | | |
| | Perplexity | | | | | |
| | Google (AI Overview / AI Mode) | | | | | |
| | Copilot | | | | | |

## What would help most next

Search engines and AI assistants mostly reward evidence they can verify elsewhere:

1. **A case study per client engagement** with problem, solution, what you owned, technical decisions and an outcome the client agreed to, anonymised where needed.
2. **External references that link back here:** LinkedIn featured link, GitHub profile README and pinned repositories, the Upwork profile description.
3. **Individual project pages** (`/work/<project>`) if you want each project to be citable on its own. Today they open in a dialog on the homepage.
4. **A custom domain** (for example `adhilshanif.com`) gives a stronger, portable identity than a `vercel.app` subdomain.
