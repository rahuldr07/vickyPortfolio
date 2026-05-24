import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import VideoShowcase from "@/components/VideoShowcase";

describe("VideoShowcase", () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
  });

  it("switches categories and opens a project dossier modal", () => {
    render(<VideoShowcase />);

    const cinematicFilter = screen.getByRole("button", {
      name: /^Cinematic\[2\]$/i,
    });
    fireEvent.click(cinematicFilter);

    expect(cinematicFilter).toHaveAttribute("aria-pressed", "true");

    const projectCard = screen.getByRole("button", {
      name: /Cinematic Conversion Reel/i,
    });
    fireEvent.click(projectCard);

    expect(
      screen.getByRole("dialog", {
        name: /Cinematic Conversion Reel preview/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText("Impact")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Discuss this direction/i })
    ).toHaveAttribute("href", expect.stringContaining("mailto:"));
  });

  it("opens video dossiers in a contained viewport frame", () => {
    render(<VideoShowcase />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /^Digital & UI\[2\]$/i,
      })
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /Product Motion Signal/i,
      })
    );

    const dialog = screen.getByRole("dialog", {
      name: /Product Motion Signal preview/i,
    });
    const video = dialog.querySelector("video");

    expect(video).toBeInTheDocument();
    expect(video).toHaveClass("object-contain");
    expect(video).toHaveAttribute("preload", "metadata");
  });
});
