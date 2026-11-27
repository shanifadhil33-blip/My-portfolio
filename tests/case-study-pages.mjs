// Full case study pages, plus the links from the expandable cards.
// node tests/case-study-pages.mjs [base URL]
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://127.0.0.1:3011";
const artifacts = process.env.QA_ARTIFACTS ?? "/opt/cursor/artifacts";
await mkdir(artifacts, { recursive: true });

const copy = readFileSync(new URL("../src/data/caseStudies.ts", import.meta.url), "utf8");
const strings = [...copy.matchAll(/"((?:\\.|[^"\\])*)"/g)].map((match) => match[1]);
const slugs = new Set(["multi-site-recommendation-platform", "at-home-vision-screening"]);
const visible = strings.filter((value) => !slugs.has(value));
const count = (text, pattern) => (text.match(pattern) || []).length;
const joined = visible.join("\n");
const em = count(joined, /\u2014/g);
const en = count(joined, /\u2013/g);
const hyphens = count(joined, /-/g);
const spaced = count(joined, /\s-\s/g);
console.log(`dash scan (case study copy): em=${em} en=${en} spaced=${spaced} hyphen=${hyphens}`);
assert.equal(em, 0);
assert.equal(en, 0);
assert.equal(spaced, 0);
assert.equal(hyphens, 0);
for (const word of ["Vercel", "Supabase", "OpenAI", "Sentry", "Cloudflare", "Canada", "Canadian", "bonus"]) {
  assert.equal(joined.includes(word), false, word);
}
assert.equal(/\bUK\b/.test(joined), false);
assert.equal(/[$£€]/.test(joined), false);

const pages = [
  {
    slug: "multi-site-recommendation-platform",
    title: "One platform behind many recommendation sites",
    card: "client-case-recommendation-engine",
    shot: "reco",
  },
  {
    slug: "at-home-vision-screening",
    title: "Vision screening at home, in the browser",
    card: "client-case-vision-screening",
    shot: "vision",
  },
];
const widths = [360, 375, 390, 414, 768, 820, 1024, 1280, 1366, 1440, 1920];

function heightFor(width) {
  if (width <= 414) return 844;
  if (width < 1280) return 1024;
  return 900;
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  args: ["--no-sandbox"],
});

async function readPage(page) {
  return page.evaluate(() => {
    const view = document.documentElement.clientWidth;
    const clip = [];
    const root = document.querySelector("main");
    for (const el of root.querySelectorAll("h1, h2, h3, p, li, dt, dd, figcaption, a, span")) {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      if (rect.left < -1 || rect.right > view + 1) {
        clip.push(`outside: ${el.textContent.trim().slice(0, 60)}`);
      }
      if (el.scrollWidth > el.clientWidth + 2 && style.overflowX !== "visible") {
        clip.push(`overflow: ${el.textContent.trim().slice(0, 60)}`);
      }
    }
    const diagrams = [...root.querySelectorAll("figure")].map((figure) => {
      const caption = figure.querySelector("figcaption")?.textContent ?? "";
      const boxes = [...figure.querySelectorAll("li > div.rounded-2xl")].map((box) => {
        const rect = box.getBoundingClientRect();
        const title = box.querySelector("p");
        const size = title ? Number.parseFloat(getComputedStyle(title).fontSize) : 0;
        return {
          right: rect.right,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          size,
          text: title?.textContent ?? "",
        };
      });
      return { caption, boxes };
    });
    return {
      overflow: document.documentElement.scrollWidth - view,
      clip,
      diagrams,
      view,
    };
  });
}

try {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: heightFor(width) },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    for (const item of pages) {
      await page.goto(`${base}/work/${item.slug}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      assert.equal((await page.locator("h1").innerText()).trim(), item.title);
      const layout = await readPage(page);
      assert.ok(layout.overflow <= 1, `${width} ${item.slug} overflow ${layout.overflow}`);
      assert.deepEqual(layout.clip, [], `${width} ${item.slug} clip ${layout.clip.join(" | ")}`);
      assert.ok(layout.diagrams.length >= 2, `${item.slug} diagrams`);
      for (const diagram of layout.diagrams) {
        assert.match(diagram.caption, /^Diagram/);
        assert.ok(diagram.boxes.length >= 4, `${item.slug} diagram boxes`);
        for (const box of diagram.boxes) {
          assert.ok(box.left >= -1 && box.right <= layout.view + 1, `${width} diagram box outside ${box.text}`);
          assert.ok(box.width >= 120, `${width} diagram box too narrow ${box.text}`);
          assert.ok(box.height >= 44, `${width} diagram box too short ${box.text}`);
          assert.ok(box.size >= 13, `${width} diagram type too small ${box.size}`);
        }
      }
      const rendered = await page.locator("main").innerText();
      assert.equal(count(rendered, /\u2014/g), 0);
      assert.equal(count(rendered, /\u2013/g), 0);
      assert.equal(count(rendered, /-/g), 0, `${item.slug} rendered hyphen`);

      if (width === 390 || width === 1440) {
        await page.locator("header").screenshot({ path: `${artifacts}/work_top_${item.shot}_${width}.png` });
        const architecture = page.locator("#architecture");
        await architecture.scrollIntoViewIfNeeded();
        await architecture.screenshot({ path: `${artifacts}/case_${item.shot}_architecture_${width}.png` });
      }
    }

    if (width === 390 || width === 1440) {
      await page.goto(base, { waitUntil: "networkidle" });
      for (const item of pages) {
        const card = page.locator(`#${item.card}`);
        await card.scrollIntoViewIfNeeded();
        await card.locator(".client-case-toggle").click();
        const link = page.getByRole("dialog").getByRole("link", { name: "Read the full case study" });
        await link.click();
        await page.waitForURL(`**${item.slug}`);
        assert.equal((await page.locator("h1").innerText()).trim(), item.title);
        await page.getByRole("link", { name: "Client projects" }).first().click();
        await page.waitForURL(new RegExp(`#${item.card}`));
        await page.waitForFunction((id) => {
          const el = document.getElementById(id);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        }, item.card);
      }
      console.log(`${width}: card links open the pages and back returns to the cards`);
    }

    assert.deepEqual(errors, [], `${width} console errors: ${errors.join(" | ")}`);
    console.log(`${width}: both case study pages fit, diagrams readable, no console errors`);
    await context.close();
  }
} finally {
  await browser.close();
}
