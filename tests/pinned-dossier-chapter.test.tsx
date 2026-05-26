import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import PinnedDossierChapter from "@/components/PinnedDossierChapter";

afterEach(() => {
  cleanup();
});

describe("PinnedDossierChapter", () => {
  it("renders a sticky rail without trapping content in an inner scroller", () => {
    render(
      <PinnedDossierChapter
        id="pinned-chapter"
        labelledBy="pinned-heading"
        rail={<h2 id="pinned-heading">Pinned Rail</h2>}
      >
        <p>Page-scrolled pinned content</p>
      </PinnedDossierChapter>
    );

    expect(screen.getByLabelText("Pinned Rail")).toBeInTheDocument();
    expect(screen.getByTestId("pinned-dossier-chapter")).toHaveAttribute(
      "data-pinned-chapter-id",
      "pinned-chapter"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-rail")).toHaveClass(
      "lg:sticky"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-rail")).not.toHaveClass(
      "lg:max-h-[calc(100svh-8rem)]"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-rail")).not.toHaveClass(
      "lg:overflow-y-auto"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-content")).toHaveClass(
      "overflow-x-clip"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-content")).not.toHaveClass(
      "lg:overflow-y-auto"
    );
  });

  it("supports a full-screen pinned chapter mode and keeps page-flow content by default", () => {
    const { container } = render(
      <PinnedDossierChapter
        id="pinned-chapter"
        labelledBy="pinned-heading"
        rail={<h2 id="pinned-heading">Pinned Rail</h2>}
        viewportChapter
      >
        <p>Page-scrolled pinned content</p>
      </PinnedDossierChapter>
    );

    expect(container.querySelector("#pinned-chapter")).toHaveAttribute(
      "data-scroll-chapter",
      "true"
    );
    expect(container.querySelector("#pinned-chapter")).toHaveClass(
      "sm:min-h-[100svh]"
    );
    expect(container.querySelector("#pinned-chapter")).not.toHaveClass(
      "min-h-[100svh]"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-content")).not.toHaveAttribute(
      "data-native-scroll"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-content")).not.toHaveAttribute(
      "data-lenis-prevent"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-content")).not.toHaveClass(
      "lg:overflow-y-auto"
    );
  });

  it("marks intentional inner scrollers so Lenis hands them off", () => {
    render(
      <PinnedDossierChapter
        id="pinned-chapter"
        labelledBy="pinned-heading"
        rail={<h2 id="pinned-heading">Pinned Rail</h2>}
        viewportChapter
        contentScrollable
      >
        <p>Page-scrolled pinned content</p>
      </PinnedDossierChapter>
    );

    expect(screen.getByTestId("pinned-dossier-chapter-content")).toHaveAttribute(
      "data-native-scroll",
      "true"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-content")).toHaveAttribute(
      "data-lenis-prevent",
      "true"
    );
  });
});
