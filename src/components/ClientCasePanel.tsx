"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import type { ClientCaseSection, ClientCaseStudy } from "@/data/clientWork";
import { bindSheetGesture, isNarrowSheet, prefersReducedMotion } from "./sheetDismiss";

const PANEL_MS = 250;
const ENTER_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, summary, [tabindex]:not([tabindex="-1"])';

function focusableIn(root: ParentNode | null): HTMLElement[] {
  if (!root) return [];
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1 && element.getClientRects().length > 0,
  );
}

function SectionCopy({ section }: { section: ClientCaseSection }) {
  return (
    <div className="min-w-0">
      {section.paragraphs?.map((paragraph, index) => (
        <p
          key={paragraph}
          className={`text-pretty text-sm leading-relaxed text-foreground${index === 0 ? "" : " mt-2"}`}
        >
          {paragraph}
        </p>
      ))}
      {section.bullets ? (
        <ul className={`list-disc space-y-2 pl-4 ${section.paragraphs?.length ? "mt-2" : ""}`}>
          {section.bullets.map((bullet) => (
            <li key={bullet} className="text-pretty text-sm leading-relaxed text-foreground">
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function ClientCasePanel({
  study,
  origin,
  onClose,
}: {
  study: ClientCaseStudy;
  origin: DOMRect | null;
  onClose: () => void;
}) {
  const [tab, setTab] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const titleId = `client-case-dialog-title-${study.id}`;
  const panelBodyId = `client-case-dialog-body-${study.id}`;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const finish = useCallback(() => {
    onCloseRef.current();
  }, []);

  const requestClose = useCallback((slide = false) => {
    if (closingRef.current) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop || prefersReducedMotion()) {
      closingRef.current = true;
      finish();
      return;
    }
    closingRef.current = true;
    const narrow = slide || isNarrowSheet();
    if (narrow) {
      const distance = Math.round(panel.getBoundingClientRect().height) + 32;
      panel.style.transition = `transform ${PANEL_MS}ms cubic-bezier(0.4, 0, 1, 1)`;
      backdrop.style.transition = `opacity ${PANEL_MS}ms ease`;
      panel.style.transform = `translate3d(0, ${distance}px, 0)`;
    } else {
      panel.style.transition = `transform ${PANEL_MS}ms cubic-bezier(0.4, 0, 1, 1), opacity ${PANEL_MS}ms ease`;
      backdrop.style.transition = `opacity ${PANEL_MS}ms ease`;
      panel.style.transform = "scale(0.96)";
      panel.style.opacity = "0";
    }
    backdrop.style.opacity = "0";
    window.setTimeout(finish, PANEL_MS);
  }, [finish]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;
    const reduce = prefersReducedMotion();
    const panelRect = panel.getBoundingClientRect();
    backdrop.style.opacity = reduce ? "1" : "0";
    if (reduce || !origin || panelRect.width < 1) {
      panel.style.opacity = "1";
      return;
    }
    const dx = origin.left + origin.width / 2 - (panelRect.left + panelRect.width / 2);
    const dy = origin.top + origin.height / 2 - (panelRect.top + panelRect.height / 2);
    const scale = Math.min(0.92, Math.max(0.2, origin.width / panelRect.width));
    panel.style.transition = "none";
    backdrop.style.transition = "none";
    panel.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    panel.style.opacity = "0";
    requestAnimationFrame(() => {
      if (closingRef.current) return;
      panel.style.transition = `transform ${PANEL_MS}ms ${ENTER_EASE}, opacity ${PANEL_MS}ms ease-out`;
      backdrop.style.transition = `opacity ${PANEL_MS}ms ease-out`;
      panel.style.transform = "none";
      panel.style.opacity = "1";
      backdrop.style.opacity = "1";
    });
  }, [origin]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const scroller = scrollerRef.current;
    if (!panel || !backdrop || !scroller) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (!isNarrowSheet() && !coarse) return;
    const gesture = bindSheetGesture(panel, backdrop, scroller, () => requestClose(true));
    return () => gesture.destroy();
  }, [requestClose]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose(false);
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusableIn(panelRef.current);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [requestClose]);

  const active = study.sections[tab] ?? study.sections[0];

  const overlay = (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <div
        ref={backdropRef}
        className="absolute inset-0 cursor-pointer bg-black/45"
        onClick={() => requestClose(false)}
        aria-label="Close"
      />
      <div
        ref={panelRef}
        id="client-case-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="case-glass zone-dark relative flex h-[calc(100dvh-0.5rem)] w-full max-w-full flex-col overflow-hidden rounded-t-3xl focus:outline-none focus-visible:outline-none sm:h-auto sm:max-h-[min(40rem,calc(100dvh-3rem))] sm:w-[min(40rem,100%)] sm:rounded-3xl"
      >
        <div className="sheet-handle" data-sheet-grab="" aria-hidden="true">
          <span className="h-1 w-9 rounded-full bg-foreground/30" />
        </div>
        <header data-sheet-header="" className="flex shrink-0 items-start gap-3 border-b border-foreground/10 px-5 py-3 sm:px-6">
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-pretty text-sm text-muted">{study.client}</p>
            <h2 id={titleId} className="mt-1 text-balance text-lg font-medium text-foreground">
              {study.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => requestClose(false)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors duration-150 hover:border-foreground/40"
            aria-label="Close"
          >
            <X size={16} aria-hidden />
          </button>
        </header>
        <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
          <div role="tablist" aria-label="Project details" className="mb-4 hidden flex-wrap gap-2 sm:flex">
            {study.sections.map((section, index) => (
              <button
                key={section.label}
                type="button"
                role="tab"
                id={`case-tab-${study.id}-${index}`}
                aria-selected={index === tab}
                aria-controls={panelBodyId}
                className={`inline-flex min-h-11 items-center rounded-full border px-3 text-left text-sm transition-colors duration-150 ${
                  index === tab
                    ? "border-foreground/50 text-foreground"
                    : "border-foreground/15 text-muted hover:border-foreground/30 hover:text-foreground"
                }`}
                onClick={() => setTab(index)}
              >
                {section.label}
              </button>
            ))}
          </div>
          <div className="space-y-5 sm:hidden">
            {study.sections.map((section) => (
              <section key={section.label} className="min-w-0">
                <h3 className="mb-2 text-sm font-medium text-muted">{section.label}</h3>
                <SectionCopy section={section} />
              </section>
            ))}
          </div>
          {active ? (
            <div
              id={panelBodyId}
              role="tabpanel"
              aria-labelledby={`case-tab-${study.id}-${tab}`}
              className="hidden min-w-0 sm:block"
            >
              <SectionCopy section={active} />
            </div>
          ) : null}
          <Link
            href={study.page}
            onClick={() => {
              document.body.style.overflow = "";
            }}
            className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4"
          >
            Read the full case study
          </Link>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
