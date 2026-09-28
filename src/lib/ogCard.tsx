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
        backgroundColor: "#030014",
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          width: 72,
          height: 4,
          backgroundColor: "#6366f1",
          borderRadius: 999,
          marginBottom: 36,
        }}
      />
      <div
        style={{
          fontSize: 76,
          fontWeight: 700,
          color: "#f8fafc",
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
          color: "#818cf8",
          lineHeight: 1.3,
        }}
      >
        {ROLE}
      </div>
    </div>
  );
}
