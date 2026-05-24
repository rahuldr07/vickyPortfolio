import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Hero from "@/components/Hero";

describe("Hero", () => {
  it("tilts the portrait without GSAP reset warnings", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<Hero />);

    const portraitWrap = screen.getByTestId("hero-portrait-wrap");
    vi.spyOn(portraitWrap, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 400,
      bottom: 500,
      width: 400,
      height: 500,
      toJSON: () => ({}),
    });

    fireEvent.mouseEnter(portraitWrap, { clientX: 200, clientY: 250 });
    fireEvent.mouseMove(portraitWrap, { clientX: 260, clientY: 300 });
    fireEvent.mouseLeave(portraitWrap);

    const gsapResetWarnings = warnSpy.mock.calls.filter((call) =>
      call.join(" ").includes("not eligible for reset")
    );

    expect(gsapResetWarnings).toHaveLength(0);
    warnSpy.mockRestore();
  });
});
