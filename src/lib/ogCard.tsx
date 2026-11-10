import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HEADLINE, ROLE } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogAlt = `Adhil Shanif, ${ROLE}: ${HEADLINE}`;

// Read at build time; the card is generated once as a static image.
const portrait = `data:image/jpeg;base64,${readFileSync(join(process.cwd(), "public/adhil-portrait.jpg")).toString("base64")}`;

export function OgCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#05070a",
        backgroundImage: "radial-gradient(circle at 85% 0%, rgba(14,116,144,0.45), rgba(5,7,10,0) 55%)",
        padding: "64px 72px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: 720 }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 24, color: "#38bdf8", letterSpacing: "0.12em" }}>
          ADHIL SHANIF
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 78,
            fontWeight: 700,
            color: "#eef2f6",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {HEADLINE}
        </div>
        <div style={{ marginTop: 32, fontSize: 30, color: "#93a0ae", lineHeight: 1.35 }}>
          {`${ROLE} · Custom software, APIs, integrations and AI systems`}
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain img */}
      <img
        src={portrait}
        alt=""
        width={300}
        height={375}
        style={{ borderRadius: 28, objectFit: "cover", border: "1px solid rgba(255,255,255,0.12)" }}
      />
    </div>
  );
}
