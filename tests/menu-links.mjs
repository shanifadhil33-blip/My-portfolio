// Taps every phone menu link with touch at 390 wide and checks the page landed on its section.
// Also checks the desktop links. Usage: npm run test:menu [-- https://adhilshanif.vercel.app]
// Needs Chrome: set CHROME_PATH if it is not at /usr/bin/google-chrome.
import { chromium } from "playwright-core";
const base = process.argv[2] || "http://localhost:3001";
const links = [["Agencies", "#agencies"], ["Services", "#services"], ["Work", "#work"], ["How I work", "#how-i-work"], ["Capabilities", "#capabilities"], ["AI team", "#ai-team"], ["About", "#about"], ["Contact", "#contact"]];
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const failures = [];
const landed = (page, id) => page.evaluate((id) => {
  const top = document.querySelector(id).getBoundingClientRect().top;
  const atEnd = Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2;
  return { top: Math.round(top), ok: (top >= 0 && top <= 120) || (atEnd && top < innerHeight), y: Math.round(scrollY) };
}, id);
const phone = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
await phone.goto(base, { waitUntil: "networkidle" });
await phone.waitForTimeout(800);
for (const [name, id] of links) {
  await phone.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await phone.locator("#mobile-menu-toggle").tap();
  await phone.waitForFunction(() => document.getElementById("navbar")?.dataset.open === "true");
  await phone.waitForTimeout(400);
  await phone.locator("#mobile-menu").getByRole("link", { name, exact: true }).tap();
  await phone.waitForTimeout(1600);
  const r = await landed(phone, id);
  const open = await phone.evaluate(() => document.getElementById("navbar")?.dataset.open);
  const pinned = await phone.evaluate(() => getComputedStyle(document.body).position === "fixed");
  console.log(`phone ${name}: section top ${r.top}, scrollY ${r.y}, menu ${open}, body pinned ${pinned}`);
  if (!r.ok || open === "true" || pinned) failures.push(`phone ${name}`);
}
const desk = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await desk.goto(base, { waitUntil: "networkidle" });
await desk.waitForTimeout(800);
const navFits = await desk.locator("#navbar").evaluate((nav) => {
  const visible = [...nav.querySelectorAll('a[href^="#"]')].filter((link) => link.getBoundingClientRect().width > 0);
  const bounds = visible.map((link) => link.getBoundingClientRect());
  return bounds.every((rect, index) => {
    const range = document.createRange();
    range.selectNodeContents(visible[index]);
    return rect.left >= 0 && rect.right <= innerWidth && rect.top === bounds[0].top
      && (!index || (rect.left >= bounds[index - 1].right && range.getClientRects().length === 1));
  });
});
console.log(`desktop nav at 1440: fits on one row ${navFits}`);
if (!navFits) failures.push("desktop nav layout at 1440");
for (const [name, id] of links) {
  await desk.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await desk.locator("#navbar").getByRole("link", { name, exact: true }).first().click();
  await desk.waitForTimeout(1600);
  const r = await landed(desk, id);
  console.log(`desktop ${name}: section top ${r.top}`);
  if (!r.ok) failures.push(`desktop ${name}`);
}
await browser.close();
if (failures.length) { console.error("FAILED: " + failures.join(", ")); process.exit(1); }
console.log("All menu links land on their sections.");
