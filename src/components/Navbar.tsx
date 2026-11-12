"use client";

import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Agencies", href: "#agencies" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "How I work", href: "#how-i-work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "AI team", href: "#ai-team" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function scrollToSection(href: string) {
  const target = document.querySelector(href);
  if (!target) return false;
  target.scrollIntoView({ behavior: "smooth" });
  window.history.pushState(null, "", href);
  return true;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // A link tapped in the phone menu waits here until the menu has closed and the page is unpinned.
  const pending = useRef<string | null>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      const nav = document.getElementById("navbar");
      if (nav && event.target instanceof Node && !nav.contains(event.target)) {
        setMobileOpen(false);
      }
    };
    // Lock page scroll while the menu is open, without moving the page.
    // iOS ignores overflow on html for touch, so pin the body in place and restore the spot on close.
    const body = document.body, y = window.scrollY, prev = body.style.cssText;
    body.style.cssText += `;position:fixed;top:-${y}px;left:0;right:0;overflow:hidden`;
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      body.style.cssText = prev;
      // Put the page back where it was at once, then glide to the tapped section.
      window.scrollTo({ top: y, behavior: "instant" });
      const href = pending.current;
      pending.current = null;
      if (href) requestAnimationFrame(() => scrollToSection(href));
    };
  }, [mobileOpen]);

  return (
    <nav id="navbar" aria-label="Main" data-open={mobileOpen} className="nav-bar absolute top-0 right-0 left-0 z-50">
      <div className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a
          href="#"
          aria-label="Adhil Shanif, back to top"
          className="inline-flex min-h-11 min-w-11 items-center gap-2.5 text-base font-semibold tracking-tight text-foreground transition-opacity duration-150 hover:opacity-80 active:opacity-70"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground font-mono text-xs text-background" aria-hidden>AS</span>
          <span className="hidden sm:inline">Adhil Shanif</span>
        </a>

        <div className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (scrollToSection(link.href)) e.preventDefault();
              }}
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-muted transition-colors duration-150 hover:text-foreground active:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
        <button
          id="mobile-menu-toggle"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center text-muted transition-colors duration-150 hover:text-foreground active:opacity-70 lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span className="burger" aria-hidden="true"><span /><span /><span /></span>
        </button>
        </div>
      </div>

      {/* Always mounted so it can grow down from under the bar and back. */}
      <div id="mobile-menu" className="mobile-panel lg:hidden" aria-hidden={!mobileOpen} inert={!mobileOpen}>
          <div className="menu-rows">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (!document.querySelector(link.href)) { setMobileOpen(false); return; }
                  e.preventDefault();
                  pending.current = link.href;
                  setMobileOpen(false);
                }}
                className="menu-row"
                onPointerDown={(e) => e.currentTarget.setAttribute("data-pressed", "")}
                onPointerUp={(e) => e.currentTarget.removeAttribute("data-pressed")}
                onPointerLeave={(e) => e.currentTarget.removeAttribute("data-pressed")}
                onPointerCancel={(e) => e.currentTarget.removeAttribute("data-pressed")}
              >
                {link.label}
              </a>
            ))}
          </div>
      </div>
    </nav>
  );
}
