"use client";

import { useEffect } from "react";

/** After a client navigation to /#section, put that section in view. */
export default function HashScroll() {
  useEffect(() => {
    const go = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      if (document.body.style.overflow === "hidden") document.body.style.overflow = "";
      document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    };
    go();
    const timer = window.setTimeout(go, 50);
    window.addEventListener("hashchange", go);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", go);
    };
  }, []);
  return null;
}
