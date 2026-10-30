"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectVideo as ProjectVideoData } from "@/data/projects";

function supportsLazyMedia(): boolean {
  return (
    typeof HTMLMediaElement !== "undefined" &&
    Object.hasOwn(HTMLMediaElement.prototype, "loading")
  );
}

export default function ProjectVideo({ video }: { video: ProjectVideoData }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(supportsLazyMedia);
  const portrait = video.height > video.width;

  const bind = useCallback((node: HTMLVideoElement | null) => {
    ref.current = node;
    if (!node) return;
    node.muted = true;
    node.setAttribute("loading", "lazy");
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node || active) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    if (!active || supportsLazyMedia()) return;
    const node = ref.current;
    if (!node) return;
    node.preload = "metadata";
    node.load();
  }, [active]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <video
        ref={bind}
        controls
        muted
        playsInline
        preload="metadata"
        poster={video.poster}
        width={video.width}
        height={video.height}
        aria-label={video.alt}
        className="mx-auto block h-auto object-contain"
        style={
          portrait
            ? {
                aspectRatio: `${video.width} / ${video.height}`,
                width: `min(100%, calc(70dvh * ${video.width} / ${video.height}))`,
              }
            : {
                aspectRatio: `${video.width} / ${video.height}`,
                width: "100%",
              }
        }
      >
        {active ? <source src={video.src} type="video/mp4" /> : null}
      </video>
    </div>
  );
}
