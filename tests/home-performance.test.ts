import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("home page performance wiring", () => {
  it("keeps heavy global controllers out while using the lighter smooth scroll", () => {
    const pageSource = readFileSync(
      join(process.cwd(), "src", "app", "page.tsx"),
      "utf8"
    );
    const layoutSource = readFileSync(
      join(process.cwd(), "src", "app", "layout.tsx"),
      "utf8"
    );
    const topNavSource = readFileSync(
      join(process.cwd(), "src", "components", "TopNav.tsx"),
      "utf8"
    );
    const footerSource = readFileSync(
      join(process.cwd(), "src", "components", "Footer.tsx"),
      "utf8"
    );
    const workSource = readFileSync(
      join(process.cwd(), "src", "components", "VideoShowcase.tsx"),
      "utf8"
    );
    const smoothScrollSource = readFileSync(
      join(process.cwd(), "src", "components", "SmoothScroll.tsx"),
      "utf8"
    );

    expect(pageSource).not.toContain("<ScrollSnap");
    expect(pageSource).not.toContain("<CustomCursor");
    expect(layoutSource).toContain("<SmoothScroll");
    expect(smoothScrollSource).toContain('"(pointer: coarse)"');
    expect(smoothScrollSource).toContain("MAX_WHEEL_DELTA");
    expect(topNavSource).not.toContain("framer-motion");
    expect(footerSource).not.toContain("framer-motion");
    expect(workSource).not.toContain("framer-motion");
  });
});
