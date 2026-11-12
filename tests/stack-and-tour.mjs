// Run against a short-lived production preview: node tests/stack-and-tour.mjs [base URL].
// QA_BROWSER=webkit selects WebKit. Chromium also checks real touch drags through CDP.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, webkit } from "playwright-core";

const engine = process.env.QA_BROWSER ?? "chromium";
const artifacts = process.env.QA_ARTIFACTS;
if (artifacts) await mkdir(artifacts, { recursive: true });
const browser = await (engine === "webkit" ? webkit.launch() : chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  args: ["--no-sandbox"],
}));
const steps = [
  ["Agents that own the job", "A coordinator sends the work to the right agent."],
  ["Work in the real tools", "Email, the CRM, accounting, and the company files."],
  ["Routine work just runs", "A discount above the limit waits for a person."],
  ["Cloud, or your server", "The data can stay inside the company."],
];
const ids = ["deploy", "data", "integrations", "backend", "ai", "frontend", "top"];
const center = async (locator) => {
  const r = await locator.boundingBox();
  assert(r);
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
};

try {
  for (const width of [390, 1440]) {
    const touch = width === 390;
    const context = await browser.newContext({
      viewport: { width, height: touch ? 844 : 1000 },
      isMobile: touch, hasTouch: touch, deviceScaleFactor: touch ? 3 : 1,
      ...(artifacts ? { recordVideo: { dir: artifacts, size: { width, height: touch ? 844 : 1000 } } } : {}),
    });
    try {
      const page = await context.newPage();
      page.setDefaultTimeout(6000);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(process.argv[2] ?? "http://localhost:3137", { waitUntil: "networkidle" });
      const scene = page.locator(".slab-scene");
      const reset = async () => {
        await page.getByRole("button", { name: "Reset", exact: true }).click();
        await page.mouse.move(2, 2);
        await scene.scrollIntoViewIfNeeded();
        await page.waitForTimeout(850);
      };
      const label = (id) => page.locator(`[data-layer="${id}"] .slab-label`);
      const dialog = page.getByRole("dialog");
      const shifts = () => page.locator(".slab-shift").evaluateAll((nodes) => nodes.map((node) =>
        new DOMMatrixReadOnly(getComputedStyle(node).transform).m41,
      ));
      const close = async () => {
        await page.getByRole("button", { name: "Close card" }).click();
        await dialog.waitFor({ state: "detached" });
        await page.waitForTimeout(800);
      };
      await reset();
      for (const id of ids) {
        // Use screen coordinates so neighbouring faces participate in real hit testing.
        const p = await center(label(id));
        if (touch) await page.touchscreen.tap(p.x, p.y);
        else await page.mouse.click(p.x, p.y);
        await dialog.waitFor();
        assert.equal(await dialog.getAttribute("aria-labelledby"), `layer-card-${id}`);
        assert.equal(await page.locator(`[data-layer="${id}"]`).getAttribute("data-out"), "true");
        assert.equal(await page.getByRole("radio", { name: /Behind your brand/ }).getAttribute("aria-checked"), "true");
        await close();
      }
      console.log(`${engine} ${width}: every slab opens its matching card without changing the mode`);

      const cdp = touch && engine === "chromium" ? await context.newCDPSession(page) : null;
      const sendTouch = (type, x, y) => cdp.send("Input.dispatchTouchEvent", {
        type, touchPoints: type === "touchEnd" || type === "touchCancel" ? [] : [{ x, y, id: 1 }],
      });
      const down = async (p) => {
        if (cdp) await sendTouch("touchStart", p.x, p.y);
        else { await page.mouse.move(p.x, p.y); await page.mouse.down(); }
      };
      const move = async (p) => {
        if (cdp) await sendTouch("touchMove", p.x, p.y);
        else await page.mouse.move(p.x, p.y);
      };
      const up = async () => {
        if (cdp) await sendTouch("touchEnd");
        else await page.mouse.up();
      };
      // Keep the public stack's along-axis projection at the Reset pose.
      const along = (p, distance) => ({
        x: p.x + distance * Math.cos(-38 * Math.PI / 180),
        y: p.y + distance * Math.sin(-38 * Math.PI / 180) * Math.cos(58 * Math.PI / 180),
      });
      for (const id of ids) {
        await reset();
        const p = await center(label(id));
        const beforeY = await page.evaluate(() => scrollY);
        await page.evaluate(() => {
          window.addEventListener("pointerdown", (event) => {
            const scene = document.querySelector(".slab-scene");
            scene.dataset.downPrevented = String(event.defaultPrevented);
            scene.dataset.downCaptured = String(scene.hasPointerCapture(event.pointerId));
          }, { once: true });
        });
        await down(p);
        assert.equal(await scene.getAttribute("data-down-prevented"), "true", "layer pointerdown prevents native handling");
        assert.equal(await scene.getAttribute("data-down-captured"), "true", "layer pointerdown immediately captures the pointer");
        // The fallback must cancel native touch panning only while holding a slab.
        assert(await scene.evaluate((node) => !node.dispatchEvent(new Event("touchmove", { bubbles: true, cancelable: true }))));
        for (const distance of [12, 45, 100, 160, 340]) {
          await move(along(p, distance));
          await page.waitForTimeout(60);
          const offsets = await shifts();
          assert(offsets[ids.indexOf(id)] > 0, `${id} should slide`);
          assert(offsets.every((x, i) => i === ids.indexOf(id) || Math.abs(x) < 0.01), "only the grabbed slab slides");
          const fits = await page.locator(`[data-layer="${id}"] .slab-shift`).evaluate((node) => {
            const scene = node.closest(".slab-scene").getBoundingClientRect();
            return [...node.querySelectorAll(".slab-top, .slab-side, .slab-label")].every((part) => {
              const r = part.getBoundingClientRect();
              return r.left >= Math.max(7.5, scene.left + 7.5) && r.right <= Math.min(innerWidth - 7.5, scene.right - 7.5)
                && r.top >= Math.max(7.5, scene.top + 7.5) && r.bottom <= Math.min(innerHeight - 7.5, scene.bottom - 7.5);
            });
          });
          assert(fits, `${id} and its label stay inside the scene and viewport`);
        }
        const room = (await shifts())[ids.indexOf(id)];
        assert(room > 12, `${id} has room to exercise the release threshold`);
        await move(along(p, room * 0.25));
        assert.equal(await dialog.count(), 0, "a drag only opens on release");
        assert.equal(await page.evaluate(() => scrollY), beforeY, "grabbing a layer must not scroll");
        await up();
        await page.waitForTimeout(600);
        assert.equal(await dialog.count(), 0, "a drag below 40% must not open a card");
        assert((await shifts()).every((x) => Math.abs(x) < 0.01), "a short drag snaps all slabs back");

        await reset();
        const start = await center(label(id));
        await down(start);
        await move(along(start, room * 0.5));
        const pulled = (await shifts())[ids.indexOf(id)];
        assert(pulled >= room * 0.4, "the long drag passes the clamp threshold");
        assert.equal(await dialog.count(), 0, "a long drag waits for release");
        await up();
        await dialog.waitFor();
        assert.equal(await dialog.getAttribute("aria-labelledby"), `layer-card-${id}`);
        assert.equal(await page.locator(`[data-layer="${id}"]`).getAttribute("data-out"), "true");
        assert((await shifts())[ids.indexOf(id)] >= pulled - 0.5, "fly-out starts from the drawn pose without snapping closed");
        assert.equal(await page.getByRole("radio", { name: /Behind your brand/ }).getAttribute("aria-checked"), "true");
        await close();
        const returned = await shifts();
        assert(returned.every((x) => Math.abs(x) < 0.01), `closing ${id} returns the drawn slab: ${returned}`);
      }
      console.log(`${engine} ${width}: ${cdp ? "touch" : "mouse"} drags clamp, short drags snap, long drags open the matching card`);

      await reset();
      const p = await center(label("backend"));
      await down(p);
      await move({ x: p.x - 80, y: p.y - 100 });
      const turned = await page.locator(".slab-stack").getAttribute("style");
      await up();
      assert.equal(await dialog.count(), 0, "rotation does not open a card");
      assert(turned.includes("rotateZ(-2deg)"), "left drag increases spin by -dx * 0.45");
      assert(turned.includes("rotateX(98deg)"), "tilt keeps its existing direction");
      await reset();
      assert.notEqual(await page.locator(".slab-stack").getAttribute("style"), turned, "Reset restores rotation");
      // Empty padding permits a rightward free rotate rather than a slab pull.
      const bounds = await scene.boundingBox();
      const emptyRight = { x: bounds.x + 8, y: bounds.y + 20 };
      await down(emptyRight);
      await move({ x: emptyRight.x + 80, y: emptyRight.y });
      await up();
      const turnedRight = await page.locator(".slab-stack").getAttribute("style");
      assert(turnedRight.includes("rotateZ(-74deg)"), "right drag decreases spin by dx * 0.45, matching the private site");
      assert(turnedRight.includes("rotateX(58deg)"));
      assert.equal(await dialog.count(), 0, "free rotate to the right does not open a card");
      await reset();
      await down(await center(label("backend")));
      const held = await center(label("backend"));
      await move({ x: held.x + 60, y: held.y - 25 });
      await page.getByRole("button", { name: "Reset", exact: true }).evaluate((node) => node.click());
      await up();
      await page.waitForTimeout(850);
      assert((await shifts()).every((x) => Math.abs(x) < 0.01), "Reset snaps back an active drag");
      assert.equal(await dialog.count(), 0);
      assert(await scene.evaluate((node) => node.dispatchEvent(new Event("touchmove", { bubbles: true, cancelable: true }))), "empty-space touch is not prevented");
      if (cdp) {
        const r = await scene.boundingBox();
        const empty = { x: r.x + 8, y: r.y + 150 };
        const before = await page.evaluate(() => scrollY);
        await down(empty);
        for (let dy = 10; dy <= 100; dy += 10) await move({ x: empty.x, y: empty.y - dy });
        await up();
        await page.waitForTimeout(350);
        assert(await page.evaluate(() => scrollY) > before + 40, "vertical swipe in padding scrolls the page");
      }
      await reset();
      await page.getByRole("radio", { name: /Refer it to me/ }).click();
      await page.locator('[aria-label="Open a layer"]').getByRole("button", { name: "Backend & security", exact: true }).click();
      await dialog.waitFor();
      assert.equal(await page.getByRole("radio", { name: /Refer it to me/ }).getAttribute("aria-checked"), "true");
      await close();
      if (artifacts) await page.screenshot({ path: `${artifacts}/${engine}-${width}-stack.png` });
      console.log(`${engine} ${width}: rotation, Reset, chips, mode independence and empty-space touch policy pass`);

      for (const reducedMotion of ["no-preference", "reduce"]) {
        await page.emulateMedia({ reducedMotion });
        const video = page.locator('#ai-team video');
        assert.deepEqual(await video.evaluate((node) => ({
          controls: node.controls, inline: node.playsInline, preload: node.preload, autoplay: node.autoplay,
          poster: node.getAttribute("poster"), source: node.querySelector("source").getAttribute("src"),
        })), {
          controls: true, inline: true, preload: "metadata", autoplay: false,
          poster: "/ai-team/forward-deployed-poster.png", source: "/ai-team/forward-deployed.mp4",
        });
        assert.equal(await page.locator('#ai-team [aria-roledescription], #ai-team .aid-canvas, #ai-team [data-carousel-dot]').count(), 0);
        const headings = page.locator("#ai-team h3");
        assert.deepEqual(await headings.allTextContents(), ["Forward deployed engineering, explained", ...steps.map(([title]) => title)]);
        for (const [title, line] of steps) {
          const heading = page.getByRole("heading", { name: title, exact: true });
          assert.equal(await heading.evaluate((node) => node.nextElementSibling.textContent), line);
          assert(await heading.evaluate((node) => node.getBoundingClientRect().top > document.querySelector("#ai-team video").getBoundingClientRect().bottom));
        }
        await video.scrollIntoViewIfNeeded();
        if (artifacts) await page.screenshot({ path: `${artifacts}/${engine}-${width}-tour-${reducedMotion}.png` });
      }
      assert.deepEqual(errors, [], "no browser runtime errors");
      console.log(`${engine} ${width}: plain video and text tour in both motion preferences`);
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
