import { ImageResponse } from "next/og";
import { OgCard, ogAlt, ogSize } from "@/lib/ogCard";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<OgCard />, { ...size });
}
