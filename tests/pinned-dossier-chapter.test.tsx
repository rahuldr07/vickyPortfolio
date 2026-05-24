import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PinnedDossierChapter from "@/components/PinnedDossierChapter";

describe("PinnedDossierChapter", () => {
  it("renders a viewport-bounded sticky rail and page-scrolled content", () => {
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
    expect(screen.getByTestId("pinned-dossier-chapter-rail")).toHaveClass(
      "lg:max-h-[calc(100svh-8rem)]"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-rail")).toHaveClass(
      "lg:overflow-y-auto"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-content")).toHaveClass(
      "overflow-x-clip"
    );
    expect(screen.getByTestId("pinned-dossier-chapter-content")).not.toHaveClass(
      "lg:overflow-y-auto"
    );
  });
});
