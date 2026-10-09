export const SHEET_MS = 220;

const CLOSE_EASE = "cubic-bezier(0.4, 0, 1, 1)";
const SPRING_EASE = "cubic-bezier(0.22, 1.2, 0.36, 1)";

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isNarrowSheet(): boolean {
  return window.matchMedia("(max-width: 639px)").matches;
}

function motion(reduce: boolean, easing: string): string {
  if (reduce) return "none";
  return `transform ${SHEET_MS}ms ${easing}, opacity ${SHEET_MS}ms ease-out`;
}

export function playSheetEnter(
  sheet: HTMLElement,
  backdrop: HTMLElement,
  stillCurrent: () => boolean,
): void {
  const reduce = prefersReducedMotion();
  const narrow = isNarrowSheet();
  sheet.style.transition = "none";
  backdrop.style.transition = "none";
  if (reduce) {
    sheet.style.transform = "translate3d(0, 0, 0)";
    sheet.style.opacity = "1";
    backdrop.style.opacity = "1";
    return;
  }
  sheet.style.opacity = "1";
  sheet.style.transform = narrow ? "translate3d(0, 100%, 0)" : "translate3d(0, 8px, 0)";
  if (!narrow) sheet.style.opacity = "0";
  backdrop.style.opacity = "0";
  requestAnimationFrame(() => {
    if (!stillCurrent()) return;
    sheet.style.transition = motion(false, SPRING_EASE);
    backdrop.style.transition = `opacity ${SHEET_MS}ms ease-out`;
    sheet.style.transform = "translate3d(0, 0, 0)";
    sheet.style.opacity = "1";
    backdrop.style.opacity = "1";
  });
}

export function playSheetExit(
  sheet: HTMLElement,
  backdrop: HTMLElement,
  slide: boolean,
): void {
  const reduce = prefersReducedMotion();
  const distance = Math.round(sheet.getBoundingClientRect().height) + 32;
  sheet.style.transition = motion(reduce, CLOSE_EASE);
  backdrop.style.transition = reduce ? "none" : `opacity ${SHEET_MS}ms ease-out`;
  if (slide || isNarrowSheet()) {
    sheet.style.transform = `translate3d(0, ${distance}px, 0)`;
    sheet.style.opacity = "1";
  } else {
    sheet.style.transform = "translate3d(0, 8px, 0)";
    sheet.style.opacity = "0";
  }
  backdrop.style.opacity = "0";
}

const INTERACTIVE = "button, a, input, textarea, select, summary, label";

export function canStartSheetDrag(target: EventTarget | null, scroller: HTMLElement | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest(INTERACTIVE)) return false;
  if (target.closest("[data-sheet-grab], [data-sheet-header]")) return true;
  return Boolean(scroller && scroller.contains(target) && scroller.scrollTop <= 0);
}

export type SheetGesture = {
  destroy: () => void;
};

export function bindSheetGesture(
  sheet: HTMLElement,
  backdrop: HTMLElement,
  scroller: HTMLElement,
  onDismiss: (slide: boolean) => void,
): SheetGesture {
  let tracking = false;
  let dragging = false;
  let startY = 0;
  let startX = 0;
  let lastY = 0;
  let lastT = 0;
  let velocity = 0;
  let height = 1;
  let offset = 0;

  const apply = (next: number) => {
    offset = Math.max(0, next);
    sheet.style.transform = `translate3d(0, ${offset}px, 0)`;
    backdrop.style.opacity = String(Math.max(0, 1 - offset / height));
  };

  const springBack = () => {
    const reduce = prefersReducedMotion();
    sheet.style.transition = motion(reduce, SPRING_EASE);
    backdrop.style.transition = reduce ? "none" : `opacity ${SHEET_MS}ms ease-out`;
    sheet.style.transform = "translate3d(0, 0, 0)";
    backdrop.style.opacity = "1";
  };

  const onStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;
    if (!canStartSheetDrag(event.target, scroller)) {
      tracking = false;
      return;
    }
    const touch = event.touches[0];
    if (!touch) return;
    tracking = true;
    dragging = false;
    startY = touch.clientY;
    startX = touch.clientX;
    lastY = touch.clientY;
    lastT = performance.now();
    velocity = 0;
    height = sheet.getBoundingClientRect().height || 1;
  };

  const onMove = (event: TouchEvent) => {
    if (!tracking || event.touches.length !== 1) return;
    const touch = event.touches[0];
    if (!touch) return;
    const dy = touch.clientY - startY;
    const dx = touch.clientX - startX;
    const now = performance.now();
    if (now > lastT) velocity = (touch.clientY - lastY) / (now - lastT);
    lastY = touch.clientY;
    lastT = now;

    if (!dragging) {
      if (dy > 8 && Math.abs(dy) > Math.abs(dx)) {
        dragging = true;
        sheet.style.transition = "none";
        backdrop.style.transition = "none";
      } else if (dy < -8 || Math.abs(dx) > 12) {
        tracking = false;
        return;
      } else {
        return;
      }
    }

    event.preventDefault();
    apply(dy);
  };

  const finish = () => {
    if (!tracking && !dragging) return;
    const wasDragging = dragging;
    tracking = false;
    dragging = false;
    if (!wasDragging) return;
    const flicked = offset > 24 && velocity > 0.8;
    const pulled = offset > 120 && velocity > -0.3;
    if (flicked || pulled) onDismiss(true);
    else springBack();
  };

  const onEnd = () => finish();
  const onCancel = () => {
    if (dragging) springBack();
    tracking = false;
    dragging = false;
  };

  sheet.addEventListener("touchstart", onStart, { passive: true });
  sheet.addEventListener("touchmove", onMove, { passive: false });
  sheet.addEventListener("touchend", onEnd);
  sheet.addEventListener("touchcancel", onCancel);

  return {
    destroy: () => {
      sheet.removeEventListener("touchstart", onStart);
      sheet.removeEventListener("touchmove", onMove);
      sheet.removeEventListener("touchend", onEnd);
      sheet.removeEventListener("touchcancel", onCancel);
    },
  };
}
