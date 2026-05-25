import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ExperiencePath from "@/components/ExperiencePath";
import { EXPERIENCE_ENTRIES } from "@/content/portfolio";

afterEach(() => {
  cleanup();
});

describe("experience timeline content", () => {
  it("uses the resume-backed companies and date ranges", () => {
    expect(EXPERIENCE_ENTRIES.map((entry) => entry.company)).toEqual([
      "Pixel Scoop Studios",
      "GreenMonk Energy Drink",
      "Buddha-CEO Quantum Foundation",
    ]);

    expect(EXPERIENCE_ENTRIES.map((entry) => entry.duration)).toEqual([
      "2021 January - December",
      "2022 Jan - 2023 Feb",
      "2023 March - Present",
    ]);
  });

  it("keeps every timeline entry renderable with focus chips", () => {
    expect(EXPERIENCE_ENTRIES).toHaveLength(3);

    for (const entry of EXPERIENCE_ENTRIES) {
      expect(Array.isArray(entry.focus)).toBe(true);
      expect(entry.focus.length).toBeGreaterThan(0);
    }
  });

  it("renders the experience timeline without malformed project entries", () => {
    render(<ExperiencePath />);

    expect(screen.getAllByText("Pixel Scoop Studios").length).toBeGreaterThan(
      0
    );
    expect(screen.getAllByText("GreenMonk Energy Drink").length).toBeGreaterThan(
      0
    );
    expect(
      screen.getAllByText("Buddha-CEO Quantum Foundation").length
    ).toBeGreaterThan(0);
    expect(screen.queryByText("BeSuperMind Identity")).not.toBeInTheDocument();
  });

  it("renders the experience section as one connected line, not a separate chart", () => {
    render(<ExperiencePath />);

    expect(screen.getByTestId("experience-line")).toBeInTheDocument();
    expect(screen.getAllByTestId("experience-stop")).toHaveLength(3);
    expect(
      screen.queryByTestId("experience-cinematic-chart")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("experience-ship")).not.toBeInTheDocument();
  });

  it("adds an animated fill and pulse to make the line feel alive", () => {
    render(<ExperiencePath />);

    expect(screen.getByTestId("experience-line-fill")).toBeInTheDocument();
    expect(screen.getByTestId("experience-line-pulse")).toBeInTheDocument();
  });
});
