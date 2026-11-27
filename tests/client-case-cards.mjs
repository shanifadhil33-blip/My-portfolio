// Checks the two client case cards at phone, tablet and laptop widths.
// node tests/client-case-cards.mjs [base URL]
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://127.0.0.1:3011";
const artifacts = process.env.QA_ARTIFACTS ?? "/opt/cursor/artifacts";
await mkdir(artifacts, { recursive: true });

const studies = readFileSync(new URL("../src/data/clientWork.ts", import.meta.url), "utf8");
const caseCopy = studies.slice(studies.indexOf("export const clientCaseStudies"));
const sectionBlocks = [...caseCopy.matchAll(/sections: \[([\s\S]*?)\n    \],/g)].map((match) => match[1]);
assert.equal(sectionBlocks.length, 2, "expected the two new case writeups");
const sectionText = sectionBlocks.join("\n");
const count = (text, pattern) => (text.match(pattern) || []).length;
const em = count(sectionText, /\u2014/g);
const en = count(sectionText, /\u2013/g);
const spaced = count(sectionText, /\s-\s/g);
const hyphens = count(sectionText, /-/g);
console.log(`dash scan (new writeups): em=${em} en=${en} spaced=${spaced} hyphen=${hyphens}`);
assert.equal(em, 0);
assert.equal(en, 0);
assert.equal(spaced, 0);
assert.equal(hyphens, 0);
assert.equal(count(caseCopy, /\u2014/g), 0);
assert.equal(count(caseCopy, /\u2013/g), 0);
assert.equal(count(caseCopy, /\s-\s/g), 0);
for (const word of ["Vercel", "Supabase", "OpenAI", "Sentry", "Cloudflare", "escrow", "coding agent"]) {
  assert.equal(sectionText.includes(word), false, word);
}
assert.equal(/[$£€]/.test(sectionText), false);

const widths = [360, 375, 390, 414, 768, 820, 1024, 1280, 1366, 1440, 1920];
const cards = [
  {
    id: "client-case-recommendation-engine",
    title: "Recommendation flow with cited AI explanations",
  },
  {
    id: "client-case-vision-screening",
    title: "Vision screening at home, in the browser",
  },
];
const rowIds = [
  "project-card-recommendation-platform",
  "client-case-recommendation-engine",
  "client-case-vision-screening",
];

function heightFor(width) {
  if (width <= 414) return 844;
  if (width < 1280) return 1024;
  return 900;
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  args: ["--no-sandbox"],
});

async function readLayout(page) {
  return page.evaluate((ids) => {
    const view = document.documentElement.clientWidth;
    const boxes = ids.map((id) => {
      const el = document.getElementById(id);
      const rect = el.getBoundingClientRect();
      return {
        id,
        top: Math.round(rect.top + window.scrollY),
        height: Math.round(rect.height),
        left: Math.round(rect.left),
        right: Math.round(rect.right + window.scrollX),
      };
    });
    const clip = [];
    for (const card of document.querySelectorAll(".client-case-card")) {
      const open = card.getAttribute("data-open") === "true";
      const reveal = card.querySelector(".client-case-reveal-inner");
      if (!open && reveal.getBoundingClientRect().height > 1) {
        clip.push(`${card.id} collapsed panel still has height`);
      }
      if (open && reveal.scrollHeight > reveal.clientHeight + 2) {
        clip.push(`${card.id} expanded panel clips content ${reveal.scrollHeight} > ${reveal.clientHeight}`);
      }
      for (const el of card.querySelectorAll("h3, h4, p, li")) {
        if (!open && el.closest(".client-case-reveal")) continue;
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const rect = el.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) continue;
        const cardRect = card.getBoundingClientRect();
        if (rect.left < cardRect.left - 1 || rect.right > cardRect.right + 1) {
          clip.push(`${card.id} text outside card: ${el.textContent.trim().slice(0, 48)}`);
        }
        if (el.scrollWidth > el.clientWidth + 2) {
          clip.push(`${card.id} text overflow: ${el.textContent.trim().slice(0, 48)}`);
        }
      }
    }
    const align = getComputedStyle(document.querySelector(".client-project-grid")).alignItems;
    return {
      overflow: document.documentElement.scrollWidth - view,
      align,
      boxes,
      clip,
    };
  }, rowIds);
}

async function settle(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const nodes = [...document.querySelectorAll(".client-case-reveal, .client-case-chevron")];
    const animations = nodes.flatMap((node) => node.getAnimations());
    await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}

try {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: heightFor(width) },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const grid = page.locator(".client-project-grid");
    await grid.scrollIntoViewIfNeeded();

    const collapsed = await readLayout(page);
    assert.ok(collapsed.overflow <= 1, `${width} collapsed page overflow ${collapsed.overflow}`);
    assert.equal(collapsed.align, "start", `${width} grid align-items`);
    assert.deepEqual(collapsed.clip, [], `${width} collapsed clip ${collapsed.clip.join(" | ")}`);

    for (const card of cards) {
      const toggle = page.locator(`#${card.id} .client-case-toggle`);
      const box = await toggle.boundingBox();
      assert.ok(box && box.height >= 44, `${card.id} toggle target`);
      const action = page.locator(`#${card.id} .client-case-action`);
      const actionBox = await action.boundingBox();
      assert.ok(actionBox && actionBox.height >= 44, `${card.id} action row`);
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    }

    if (width === 390 || width === 1440) {
      await grid.screenshot({ path: `${artifacts}/client_cases_collapsed_${width}.png` });
    }

    const engine = page.locator("#client-case-recommendation-engine .client-case-toggle");
    const title = page.locator("#client-case-recommendation-engine-title");
    await title.scrollIntoViewIfNeeded();
    const titleBox = await title.boundingBox();
    assert.ok(titleBox && titleBox.y >= 0 && titleBox.y < heightFor(width), `${width} title not in view`);
    await page.mouse.click(titleBox.x + Math.min(24, titleBox.width / 2), titleBox.y + titleBox.height / 2);
    if (width === 1440) {
      await page.waitForTimeout(40);
      const mid = await page.locator("#client-case-recommendation-engine .client-case-reveal-inner").evaluate((el) => el.getBoundingClientRect().height);
      await settle(page);
      const end = await page.locator("#client-case-recommendation-engine .client-case-reveal-inner").evaluate((el) => el.getBoundingClientRect().height);
      assert.ok(end > 200, "expanded panel is short");
      assert.ok(mid < end - 30, `height animation did not run (${mid} -> ${end})`);
      const timing = await page.locator("#client-case-recommendation-engine .client-case-reveal").evaluate((el) => {
        const style = getComputedStyle(el);
        return { property: style.transitionProperty, duration: style.transitionDuration };
      });
      assert.match(timing.property, /grid-template-rows/);
      assert.equal(timing.duration, "0.22s");
    } else {
      await settle(page);
    }
    assert.equal(await engine.getAttribute("aria-expanded"), "true");

    const opened = await readLayout(page);
    assert.ok(opened.overflow <= 1, `${width} expanded page overflow ${opened.overflow}`);
    assert.deepEqual(opened.clip, [], `${width} expanded clip ${opened.clip.join(" | ")}`);
    const beforeEngine = collapsed.boxes.find((box) => box.id === "client-case-recommendation-engine");
    for (const before of collapsed.boxes) {
      if (before.id === "client-case-recommendation-engine") continue;
      const after = opened.boxes.find((box) => box.id === before.id);
      assert.ok(Math.abs(after.height - before.height) <= 1, `${width} ${before.id} height changed ${before.height} -> ${after.height}`);
      if (Math.abs(before.top - beforeEngine.top) < 8) {
        assert.ok(Math.abs(after.top - before.top) <= 1, `${width} ${before.id} row shifted`);
      }
    }

    const showLess = page.locator("#client-case-recommendation-engine .client-case-show-less");
    const showBox = await showLess.boundingBox();
    assert.ok(showBox && showBox.height >= 44, "show less target");

    await page.locator("#client-case-vision-screening .client-case-toggle").click();
    await settle(page);
    assert.equal(await engine.getAttribute("aria-expanded"), "true", "first card stayed open");
    assert.equal(
      await page.locator("#client-case-vision-screening .client-case-toggle").getAttribute("aria-expanded"),
      "true",
    );
    const both = await readLayout(page);
    assert.ok(both.overflow <= 1, `${width} both open overflow ${both.overflow}`);
    assert.deepEqual(both.clip, [], `${width} both open clip ${both.clip.join(" | ")}`);

    if (width === 390 || width === 1440) {
      await grid.screenshot({ path: `${artifacts}/client_cases_expanded_${width}.png` });
    }

    await showLess.click();
    await settle(page);
    assert.equal(await engine.getAttribute("aria-expanded"), "false", "Show less closes");
    await page.locator("#client-case-vision-screening .client-case-show-less").click();
    await settle(page);
    assert.equal(
      await page.locator("#client-case-vision-screening .client-case-toggle").getAttribute("aria-expanded"),
      "false",
    );

    if (width === 1440) {
      await engine.focus();
      await page.keyboard.press("Enter");
      await settle(page);
      assert.equal(await engine.getAttribute("aria-expanded"), "true", "Enter opens");
      await page.keyboard.press("Space");
      await settle(page);
      assert.equal(await engine.getAttribute("aria-expanded"), "false", "Space closes");
      await page.keyboard.press("Space");
      await settle(page);
      assert.equal(await engine.getAttribute("aria-expanded"), "true", "Space opens");
      await page.keyboard.press("Enter");
      await settle(page);
      assert.equal(await engine.getAttribute("aria-expanded"), "false", "Enter closes");
    }

    if (width === 390 || width === 1440) {
      const popups = [
        ["#project-card-groundwork .project-card-trigger", "Groundwork"],
        ["#project-card-nazir .project-card-trigger", "Nazir"],
        ["#project-card-recommendation-platform", "Multi-tenant recommendation platform"],
      ];
      for (const [opener, titleText] of popups) {
        await page.locator(opener).click();
        const dialog = page.locator("#project-modal-content");
        await dialog.waitFor({ state: "visible" });
        assert.equal((await page.locator("#project-modal-title").innerText()).trim(), titleText);
        await page.locator("#project-modal-close").click();
        await dialog.waitFor({ state: "detached" });
      }
      console.log(`${width}: Groundwork, Nazir and the earlier client project still open and close`);
    }

    assert.deepEqual(errors, [], `${width} console errors: ${errors.join(" | ")}`);
    console.log(`${width}: collapsed and expanded fit, no clip, neighbour cards keep their height`);
    await context.close();
  }

  const reduced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(base, { waitUntil: "networkidle" });
  const reveal = reducedPage.locator("#client-case-recommendation-engine .client-case-reveal");
  const reducedTiming = await reveal.evaluate((el) => getComputedStyle(el).transitionDuration);
  const seconds = reducedTiming.endsWith("ms") ? Number.parseFloat(reducedTiming) / 1000 : Number.parseFloat(reducedTiming);
  assert.ok(seconds < 0.05, reducedTiming);
  await reducedPage.locator("#client-case-recommendation-engine .client-case-toggle").click();
  await reducedPage.waitForTimeout(30);
  const soon = await reducedPage.locator("#client-case-recommendation-engine .client-case-reveal-inner").evaluate((el) => el.getBoundingClientRect().height);
  await reducedPage.waitForTimeout(300);
  const later = await reducedPage.locator("#client-case-recommendation-engine .client-case-reveal-inner").evaluate((el) => el.getBoundingClientRect().height);
  assert.ok(Math.abs(soon - later) <= 2, `reduced motion still animated ${soon} -> ${later}`);
  assert.ok(later > 200);
  console.log("reduced motion: panel opens without a height animation");
  await reduced.close();
} finally {
  await browser.close();
}
