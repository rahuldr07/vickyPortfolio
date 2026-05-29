import { ImageResponse } from "next/og";
import { SITE_META } from "@/content/portfolio";

export const alt = `${SITE_META.title} social preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#0b0b0f",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, Helvetica, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: 72,
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(217, 70, 239, 0.58), rgba(34, 211, 238, 0.28), rgba(245, 158, 11, 0.2))",
            borderRadius: 999,
            filter: "blur(10px)",
            height: 420,
            position: "absolute",
            right: -110,
            top: -100,
            width: 420,
          }}
        />
        <div
          style={{
            border: "1px solid rgba(248, 250, 252, 0.16)",
            display: "flex",
            height: "100%",
            justifyContent: "space-between",
            padding: 48,
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              maxWidth: 820,
            }}
          >
            <div
              style={{
                color: "#22d3ee",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              Cinematic Visual Portfolio
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 26,
              }}
            >
              <div
                style={{
                  fontSize: 88,
                  fontWeight: 900,
                  letterSpacing: 0,
                  lineHeight: 0.95,
                }}
              >
                Geetha Krishna
              </div>
              <div
                style={{
                  color: "#cbd5e1",
                  fontSize: 34,
                  fontWeight: 500,
                  lineHeight: 1.25,
                }}
              >
                Senior Graphic Designer focused on branding, cinematic visuals,
                and video editing.
              </div>
            </div>
            <div
              style={{
                color: "#f59e0b",
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                gap: 28,
              }}
            >
              <span>Brand Identity</span>
              <span>Campaign Design</span>
              <span>Motion Edits</span>
            </div>
          </div>
          <div
            style={{
              alignItems: "center",
              border: "1px solid rgba(248, 250, 252, 0.18)",
              color: "#f8fafc",
              display: "flex",
              fontSize: 58,
              fontWeight: 900,
              height: 190,
              justifyContent: "center",
              letterSpacing: 0,
              marginTop: "auto",
              width: 190,
            }}
          >
            GK
          </div>
        </div>
      </div>
    ),
    size,
  );
}
