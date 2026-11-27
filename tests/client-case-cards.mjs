// Glass case cards: open, close, keyboard, focus, and the older project popups.
// node tests/client-case-cards.mjs [base URL]
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://127.0.0.1:3011";
const artifacts = process.env.QA_ARTIFACTS ?? "/opt/cursor/artifacts";
await mkdir(artifacts, { recursive: true });

const widths = [360, 375, 390, 414, 768, 820, 1024, 1280, 1366, 1440, 1920];
const cards = [
  { id: "client-case-recommendation-engine", title: "Recommendation flow with cited AI explanations" },
  { id: "client-case-vision-screening", title: "Vision screening at home, in the browser" },
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

async function layout(page) {
  return page.evaluate(() => {
    const view = document.documentElement.clientWidth;
    const clip = [];
    const root = document.body;
    for (const el of root.querySelectorAll("h1, h2, h3, h4, p, li, a, button, figcaption")) {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      if (rect.left < -1 || rect.right > view + 1) {
        clip.push(`outside: ${el.textContent.trim().slice(0, 70)}`);
      }
    }
    const dialog = document.getElementById("client-case-dialog");
    const dialogBox = dialog
      ? (() => {
          const rect = dialog.getBoundingClientRect();
          return { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, height: rect.height };
        })()
      : null;
    return {
      overflow: document.documentElement.scrollWidth - view,
      clip,
      dialogBox,
      view,
      bodyLocked: document.body.style.overflow === "hidden",
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

    const closed = await layout(page);
    assert.ok(closed.overflow <= 1, `${width} closed overflow ${closed.overflow}`);
    assert.deepEqual(closed.clip, [], `${width} closed clip ${closed.clip.join(" | ")}`);
    assert.equal(await page.getByRole("heading", { name: "Highlights" }).count(), 0);

    if (width === 390 || width === 1440) {
      await grid.screenshot({ path: `${artifacts}/glass_cards_${width}.png` });
    }

    for (const card of cards) {
      const toggle = page.locator(`#${card.id} .client-case-toggle`);
      await toggle.scrollIntoViewIfNeeded();
      const box = await toggle.boundingBox();
      assert.ok(box && box.height >= 44, `${card.id} card target`);
      await page.mouse.click(box.x + 24, box.y + 28);
      const dialog = page.locator("#client-case-dialog");
      await dialog.waitFor({ state: "visible" });
      assert.equal(await toggle.getAttribute("aria-expanded"), "true");
      await page.waitForTimeout(280);
      const opened = await layout(page);
      assert.ok(opened.overflow <= 1, `${width} open overflow ${opened.overflow}`);
      assert.deepEqual(opened.clip, [], `${width} open clip ${opened.clip.join(" | ")}`);
      assert.equal(opened.bodyLocked, true, `${width} page still scrolls`);
      assert.ok(opened.dialogBox);
      assert.ok(opened.dialogBox.left >= -1 && opened.dialogBox.right <= opened.view + 1, `${width} panel overflow`);
      if (width <= 414) {
        assert.ok(opened.dialogBox.height > heightFor(width) * 0.8, `${width} panel is not a near full sheet`);
      }
      const link = dialog.getByRole("link", { name: "Read the full case study" });
      assert.equal(await link.getAttribute("href"), card.id.includes("vision")
        ? "/work/at-home-vision-screening"
        : "/work/multi-site-recommendation-platform");
      if (width >= 768) {
        const tabs = dialog.getByRole("tab");
        assert.equal(await tabs.count(), 6);
        await tabs.nth(2).click();
        assert.equal(await tabs.nth(2).getAttribute("aria-selected"), "true");
      } else {
        assert.equal(await dialog.getByRole("tab").count(), 0);
        assert.equal(await dialog.getByRole("heading", { name: "The ask" }).count(), 1);
      }
      await page.locator("#client-case-dialog button[aria-label='Close']").click();
      await dialog.waitFor({ state: "hidden" });
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    }

    if (width === 1440) {
      const toggle = page.locator("#client-case-recommendation-engine .client-case-toggle");
      await toggle.focus();
      await page.keyboard.press("Enter");
      const dialog = page.locator("#client-case-dialog");
      await dialog.waitFor();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${artifacts}/glass_panel_${width}.png` });
      const inside = await page.evaluate(() => {
        const root = document.getElementById("client-case-dialog");
        return Boolean(root && root.contains(document.activeElement));
      });
      assert.equal(inside, true, "focus did not move into the panel");
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
      await page.waitForTimeout(40);
      const back = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
      assert.equal(back, "Open Recommendation flow with cited AI explanations");

      await toggle.click();
      await dialog.waitFor();
      await page.mouse.click(12, 12);
      await dialog.waitFor({ state: "hidden" });
    }

    if (width === 390) {
      const toggle = page.locator("#client-case-vision-screening .client-case-toggle");
      await toggle.scrollIntoViewIfNeeded();
      await toggle.click();
      const dialog = page.locator("#client-case-dialog");
      await dialog.waitFor();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${artifacts}/glass_panel_${width}.png` });
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
    }

    if (width === 390 || width === 1440) {
      const popups = [
        ["#project-card-groundwork .project-card-trigger", "Groundwork"],
        ["#project-card-nazir .project-card-trigger", "Nazir"],
        ["#project-card-recommendation-platform", "Multi-tenant recommendation platform"],
      ];
      for (const [opener, titleText] of popups) {
        await page.locator(opener).click();
        const modal = page.locator("#project-modal-content");
        await modal.waitFor({ state: "visible" });
        assert.equal((await page.locator("#project-modal-title").innerText()).trim(), titleText);
        await page.locator("#project-modal-close").click();
        await modal.waitFor({ state: "detached" });
      }
      console.log(`${width}: Groundwork, Nazir and the earlier client project still open and close`);
    }

    assert.deepEqual(errors, [], `${width} console errors: ${errors.join(" | ")}`);
    console.log(`${width}: glass cards open and close without overflow`);
    await context.close();
  }

  const reduced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(base, { waitUntil: "networkidle" });
  await reducedPage.locator("#client-case-recommendation-engine .client-case-toggle").click();
  await reducedPage.locator("#client-case-dialog").waitFor();
  await reducedPage.waitForTimeout(40);
  const opacity = await reducedPage.locator("#client-case-dialog").evaluate((el) => getComputedStyle(el).opacity);
  assert.equal(opacity, "1");
  console.log("reduced motion: panel is shown without waiting on the scale animation");
  await reduced.close();
} finally {
  await browser.close();
}
