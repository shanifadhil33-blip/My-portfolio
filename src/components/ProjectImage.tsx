import Image from "next/image";

const SCREENSHOT_SIZE: Record<string, { width: number; height: number }> = {
  "/screenshots/reclaim-worklist.png": { width: 2880, height: 1800 },
  "/screenshots/reclaim-review.png": { width: 2880, height: 1800 },
  "/screenshots/reclaim-letter.png": { width: 2880, height: 1800 },
  "/screenshots/reclaim-history.png": { width: 2880, height: 1800 },
  "/screenshots/eob-reader-review.png": { width: 2880, height: 1800 },
  "/screenshots/eob-reader-dashboard.png": { width: 2880, height: 1800 },
  "/screenshots/eob-reader-export.png": { width: 2880, height: 1800 },
  "/screenshots/doctalk-home.png": { width: 1024, height: 525 },
  "/screenshots/doctalk-documents.png": { width: 1024, height: 665 },
  "/screenshots/doctalk-invoice.png": { width: 1024, height: 525 },
};

export const CARD_IMAGE_SIZES =
  "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(50vw - 36px), 360px";

export const MODAL_IMAGE_SIZES = "(max-width: 639px) calc(100vw - 40px), 624px";

export function screenshotSize(src: string): { width: number; height: number } {
  return SCREENSHOT_SIZE[src] ?? { width: 2880, height: 1800 };
}

export default function ProjectImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const { width, height } = screenshotSize(src);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      quality={90}
      priority={priority}
      className={className ?? "block h-auto w-full"}
    />
  );
}
