import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DossierChapter from "@/components/DossierChapter";

describe("DossierChapter", () => {
  it("renders a sticky left rail and page-scrolled right content", () => {
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
    expect(screen.getByTestId("dossier-chapter-rail")).toHaveClass(
      "lg:max-h-[calc(100svh-8rem)]"
    );
    expect(screen.getByTestId("dossier-chapter-rail")).toHaveClass(
      "lg:overflow-y-auto"
    );
    expect(screen.getByTestId("dossier-chapter-content")).toHaveClass(
      "overflow-x-clip"
    );
    expect(screen.getByTestId("dossier-chapter-content")).not.toHaveClass(
      "lg:overflow-y-auto"
    );
  });
});
