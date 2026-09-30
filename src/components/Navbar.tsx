"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#client-work" },
  { label: "Projects", href: "#projects" },
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

  return (
    <nav id="navbar" className="absolute top-0 right-0 left-0 z-50 bg-transparent">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a
          href="#"
          className="inline-flex min-h-11 min-w-11 items-center text-lg font-medium tracking-tight text-foreground transition-opacity duration-150 hover:opacity-80 active:opacity-70"
        >
          AS
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (scrollToSection(link.href)) e.preventDefault();
              }}
              className="rounded-lg px-4 py-2 text-sm text-muted transition-colors duration-150 hover:text-foreground active:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          id="mobile-menu-toggle"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center text-muted transition-colors duration-150 hover:text-foreground active:opacity-70 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col px-5 py-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  setMobileOpen(false);
                  if (scrollToSection(link.href)) e.preventDefault();
                }}
                className="flex min-h-11 items-center px-3 text-base text-muted transition-colors duration-150 hover:text-foreground active:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
