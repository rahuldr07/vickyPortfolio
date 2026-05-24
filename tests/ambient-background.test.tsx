import { render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import AmbientBackground, {
  AMBIENT_PARTICLE_COUNT,
} from "@/components/AmbientBackground";

describe("AmbientBackground", () => {
  it("keeps animated dust below the performance budget", async () => {
    expect(AMBIENT_PARTICLE_COUNT).toBeLessThanOrEqual(24);

    render(<AmbientBackground />);

    await waitFor(() => {
      expect(screen.getAllByTestId("ambient-dust")).toHaveLength(
        AMBIENT_PARTICLE_COUNT
      );
    });
  });

  it("does not animate the full-screen ambient overlay", () => {
    const css = readFileSync(
      join(process.cwd(), "src", "app", "globals.css"),
      "utf8"
    );
    const sharedOverlayBlock =
      css.match(
        /\.ambient-overlay::before,\s*\.ambient-overlay::after\s*\{[\s\S]*?\}/
      )?.[0] ?? "";
    const afterOverlayBlock =
      css.match(/\.ambient-overlay::after\s*\{[\s\S]*?\}/)?.[0] ?? "";

    expect(sharedOverlayBlock).not.toHaveLength(0);
    expect(afterOverlayBlock).not.toHaveLength(0);
    expect(sharedOverlayBlock).not.toContain("animation:");
    expect(afterOverlayBlock).not.toContain("animation:");
    expect(css).not.toContain("@keyframes ambientDrift");
    expect(css).not.toContain("@keyframes ambientFloat");
  });
});
