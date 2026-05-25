import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("Home page sections", () => {
  it("renders the main viewport chapters with stable anchor ids", { timeout: 15000 }, () => {
    const { container } = render(<Home />);

    for (const id of ["home", "work", "about", "arsenal", "experience", "contact"]) {
      const section = container.querySelector(`#${id}`);
      expect(section).toBeTruthy();
      expect(section).toHaveAttribute("data-scroll-chapter", "true");
    }
  });
});
