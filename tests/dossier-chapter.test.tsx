import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import DossierChapter from "@/components/DossierChapter";

afterEach(() => {
  cleanup();
});

describe("DossierChapter", () => {
  it("renders a sticky left rail without trapping content in an inner scroller", () => {
    render(
      <DossierChapter
        id="chapter"
        labelledBy="chapter-heading"
        rail={<h2 id="chapter-heading">Chapter Rail</h2>}
      >
        <p>Scrollable chapter content</p>
      </DossierChapter>
    );

    expect(screen.getByLabelText("Chapter Rail")).toBeInTheDocument();
    expect(screen.getByTestId("dossier-chapter-rail")).toHaveClass(
      "lg:sticky"
    );
    expect(screen.getByTestId("dossier-chapter-rail")).not.toHaveClass(
      "lg:max-h-[calc(100svh-8rem)]"
    );
    expect(screen.getByTestId("dossier-chapter-rail")).not.toHaveClass(
      "lg:overflow-y-auto"
    );
    expect(screen.getByTestId("dossier-chapter-content")).toHaveClass(
      "overflow-x-clip"
    );
    expect(screen.getByTestId("dossier-chapter-content")).not.toHaveClass(
      "lg:overflow-y-auto"
    );
  });

  it("supports a full-screen chapter mode without forcing an inner scroller by default", () => {
    const { container } = render(
      <DossierChapter
        id="chapter"
        labelledBy="chapter-heading"
        rail={<h2 id="chapter-heading">Chapter Rail</h2>}
        viewportChapter
      >
        <p>Scrollable chapter content</p>
      </DossierChapter>
    );

    const section = container.querySelector("#chapter");
    expect(section).toHaveAttribute("data-scroll-chapter", "true");
    expect(section).toHaveClass("min-h-[100svh]");

    expect(screen.getByTestId("dossier-chapter-content")).not.toHaveAttribute(
      "data-native-scroll"
    );
    expect(screen.getByTestId("dossier-chapter-content")).not.toHaveClass(
      "lg:overflow-y-auto"
    );
  });
});
