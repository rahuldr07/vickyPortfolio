import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TopNav from "@/components/TopNav";

describe("TopNav", () => {
  it("opens and closes the mobile menu", () => {
    render(<TopNav />);

    const toggleButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(toggleButton);

    expect(screen.getByRole("dialog", { name: /mobile menu/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    const closeButton = screen.getByRole("button", { name: /close menu/i });
    fireEvent.click(closeButton);

    expect(closeButton).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
  });
});
