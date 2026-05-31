"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      id="navbar"
      className="absolute top-0 left-0 right-0 z-50 bg-transparent"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="relative text-foreground font-bold text-lg tracking-tight hover:opacity-80 transition-opacity duration-300"
        >
          AS
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                const target = document.querySelector(link.href);
                if (target) {
                  e.preventDefault();
                  target.scrollIntoView({ behavior: "smooth" });
                  window.history.pushState(null, "", link.href);
                }
              }}
              className="relative px-4 py-2 text-sm text-muted hover:text-foreground transition-colors duration-300 rounded-lg hover:bg-white/[0.03]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-muted hover:text-foreground transition-colors p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="md:hidden overflow-hidden glass border-t border-white/[0.06]"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    setMobileOpen(false);
                    const target = document.querySelector(link.href);
                    if (target) {
                      e.preventDefault();
                      setTimeout(() => {
                        target.scrollIntoView({ behavior: "smooth" });
                        window.history.pushState(null, "", link.href);
                      }, 100); // Give time for mobile menu to start closing
                    }
                  }}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-sm text-muted hover:text-foreground transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/[0.03]"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
