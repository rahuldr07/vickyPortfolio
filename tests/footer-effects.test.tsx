import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "@/components/Footer";

describe("Footer premium contact effects", () => {
  it("renders the layered contact effect system and magnetic contact targets", () => {
    const { container } = render(<Footer />);
    const contact = container.querySelector("#contact");

    expect(contact).toHaveAttribute("data-contact-effects", "premium");
    expect(container.querySelector(".contact-aura")).toBeInTheDocument();
    expect(container.querySelector(".contact-orbit")).toBeInTheDocument();
    expect(container.querySelector(".contact-scanline")).toBeInTheDocument();
    expect(
      container.querySelectorAll("[data-contact-magnet='true']")
    ).toHaveLength(5);
    expect(screen.getByRole("link", { name: /start project brief/i })).toHaveClass(
      "contact-premium-cta"
    );
  });
});
