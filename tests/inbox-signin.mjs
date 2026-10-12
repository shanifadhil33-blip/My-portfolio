// Inbox sign in: sign in, sign out, sign in again. Every trip to Google must carry prompt=select_account,
// Sign out must clear every portfolio session cookie, and no request may touch another app's sign in.
// Usage: BASE=https://adhilshanif.vercel.app node tests/inbox-signin.mjs   (default http://localhost:3000)
import { chromium } from "playwright-core";
const BASE = process.env.BASE ?? "http://localhost:3000";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", args: ["--no-sandbox"] });
let fail = 0; const check = (ok, what) => { console.log(ok ? "PASS" : "FAIL", what); if (!ok) fail++; };
for (const [dev, opt] of [["phone", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }], ["desktop", { viewport: { width: 1280, height: 800 } }]]) {
  const c = await b.newContext(opt); const p = await c.newPage(); const foreign = [];
  p.on("request", r => { if (/groundwork|inbox-pass/.test(r.url())) foreign.push(r.url()); });
  const tap = async (start, label) => {
    let google = null; const on = r => { if (!google && /accounts\.google\.com/.test(r.url())) google = r.url(); }; p.on("request", on);
    await p.goto(BASE + start, { waitUntil: "load" }); await p.getByRole("button", { name: label }).click(); await p.waitForTimeout(3500); p.off("request", on);
    return google ? new URL(google).searchParams : null;
  };
  let g = await tap("/inbox", /Sign in with Google/);
  check(g?.get("prompt") === "select_account", `${dev}: 1 sign in goes to Google with the account picker`);
  check(!!g && new URL(g.get("redirect_uri")).origin === new URL(BASE).origin, `${dev}: Google returns to this site, not another app`);
  // pretend a session exists, then Sign out must clear it all
  const host = new URL(BASE).hostname, secure = BASE.startsWith("https");
  await c.addCookies([{ name: secure ? "__Secure-authjs.session-token" : "authjs.session-token", value: "x", domain: host, path: "/", secure }, { name: "inbox_session", value: "x", domain: host, path: "/" }]);
  await p.goto(BASE + "/inbox/signout", { waitUntil: "load" });
  const left = (await c.cookies(BASE)).filter(k => /authjs\.session-token|inbox_session/.test(k.name) && k.value);
  check(left.length === 0 && new URL(p.url()).pathname === "/", `${dev}: 2 sign out clears every session cookie and goes home`);
  g = await tap("/inbox", /Sign in with Google/);
  check(g?.get("prompt") === "select_account", `${dev}: 3 sign in again goes to Google with the account picker`);
  g = await tap("/inbox?denied=1", /Sign in with a different account/);
  check(g?.get("prompt") === "select_account", `${dev}: private page button opens the account picker`);
  check(foreign.length === 0, `${dev}: never touches another app's sign in (${foreign.length} requests)`);
  await c.close();
}
await b.close(); if (fail) { console.log(fail, "failed"); process.exit(1); } console.log("all passed");
