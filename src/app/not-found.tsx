import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const link: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "13px 22px",
  borderRadius: 12,
  fontWeight: 600,
  fontSize: 15,
  textDecoration: "none",
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeContent: "center",
        gap: 20,
        padding: "48px 20px",
        background: "#0c0b0c",
        color: "#f4f2f6",
        textAlign: "center",
      }}
    >
      <p style={{ margin: 0, color: "rgba(244,242,246,.66)", fontSize: 15 }}>404</p>
      <h1 style={{ margin: 0, fontSize: "clamp(36px,6vw,64px)", fontWeight: 600, letterSpacing: "-0.04em" }}>
        This page moved or never existed.
      </h1>
      <p style={{ margin: 0, color: "rgba(244,242,246,.72)", maxWidth: 520, justifySelf: "center", lineHeight: 1.55 }}>
        Geetha Krishna is a freelance graphic designer and video editor in Bengaluru. The work and contact details are one click away.
      </p>
      <nav style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }} aria-label="Helpful links">
        <a href="/work" style={{ ...link, background: "#f4f2f6", color: "#0c0b0c" }}>
          See the work
        </a>
        {/* "/" is static HTML served via a rewrite; <Link> would client-render the legacy React page instead. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" style={{ ...link, border: "1px solid rgba(244,242,246,.3)", color: "#f4f2f6" }}>
          Home
        </a>
        <a
          href="mailto:geethakrishna.designer@gmail.com?subject=Project%20enquiry"
          style={{ ...link, border: "1px solid rgba(244,242,246,.3)", color: "#f4f2f6" }}
        >
          Email Geetha
        </a>
      </nav>
    </main>
  );
}
