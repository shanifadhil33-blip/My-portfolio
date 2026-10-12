"use client";
import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";

/** Always visible. The dot shows only for the signed in inbox owner when there is unread feedback. */
export default function InboxButton() {
  const [unread, setUnread] = useState(false);
  useEffect(() => {
    let alive = true;
    const check = () => fetch("/api/inbox/unread", { cache: "no-store" }).then(r => r.json()).then(d => alive && setUnread(!!d.unread)).catch(() => {});
    check();
    const onVisible = () => { if (!document.hidden) check(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { alive = false; document.removeEventListener("visibilitychange", onVisible); };
  }, []);
  return (
    <a href="/inbox" aria-label={unread ? "Inbox, new feedback" : "Inbox"} className="relative inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-muted transition-colors duration-150 hover:text-foreground active:text-foreground">
      <span className="relative"><Inbox size={18} aria-hidden />{unread && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" aria-hidden />}</span>
      <span className="hidden sm:inline">Inbox</span>
    </a>
  );
}
