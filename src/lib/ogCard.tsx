import { ROLE } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogAlt = "Adhil Shanif | Custom Software & AI Systems Engineer";

export function OgCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#0b0b0c",
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          width: 72,
          height: 4,
          backgroundColor: "#c4b59a",
          borderRadius: 999,
          marginBottom: 36,
        }}
      />
      <div
        style={{
          fontSize: 76,
          fontWeight: 700,
          color: "#ededed",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
        }}
      >
        Adhil Shanif
      </div>
      <div
        style={{
          marginTop: 28,
          fontSize: 34,
          fontWeight: 600,
          color: "#c4b59a",
          lineHeight: 1.3,
        }}
      >
        {ROLE}
      </div>
    </div>
  );
}
