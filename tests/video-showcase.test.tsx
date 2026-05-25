import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import VideoShowcase from "@/components/VideoShowcase";

describe("VideoShowcase", () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
  });

  it("links category navigation to continuous archive sections", () => {
    render(<VideoShowcase />);

    expect(
      screen.getByRole("link", {
        name: /^All projects section 16 projects$/i,
      })
    ).toHaveAttribute("href", "#work");
    expect(
      screen.getByRole("link", {
        name: /^Logos section 3 projects$/i,
      })
    ).toHaveAttribute("href", "#work-logos");
    expect(
      screen.getByRole("link", {
        name: /^Menus section 2 projects$/i,
      })
    ).toHaveAttribute("href", "#work-menus");
    expect(
      screen.getByRole("link", {
        name: /^Posters section 7 projects$/i,
      })
    ).toHaveAttribute("href", "#work-posters");
    expect(
      screen.getByRole("link", {
        name: /^Banners section 3 projects$/i,
      })
    ).toHaveAttribute("href", "#work-banners");
    expect(
      screen.getByRole("link", {
        name: /^Video Reels section 1 projects$/i,
      })
    ).toHaveAttribute("href", "#work-reels");
  });

  it("renders category sections with project counts and opens a project dossier modal", () => {
    render(<VideoShowcase />);

    const logosSection = screen.getByRole("region", {
      name: /Logo Systems/i,
    });

    expect(within(logosSection).getByText("Logos / 03")).toBeInTheDocument();
    expect(
      within(logosSection).getByRole("button", {
        name: /Open Coastal Cravings Identity/i,
      })
    ).toHaveAttribute("data-archive-frame", "logo");

    const menusSection = screen.getByRole("region", {
      name: /Menu Cards/i,
    });
    expect(within(menusSection).getByText("Menus / 02")).toBeInTheDocument();
    expect(
      within(menusSection).getByRole("button", {
        name: /Open Restaurant Menu Layout/i,
      })
    ).toHaveAttribute("data-archive-frame", "menu");

    const projectCard = within(logosSection).getByRole("button", {
      name: /Open Coastal Cravings Identity/i,
    });
    fireEvent.click(projectCard);

    expect(
      screen.getByRole("dialog", {
        name: /Coastal Cravings Identity preview/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText("Impact")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Discuss this direction/i })
    ).toHaveAttribute("href", expect.stringContaining("mailto:"));
  });

  it("uses distinct archive frames for menus, banners, posters, and video reels", () => {
    render(<VideoShowcase />);

    const menusSection = screen.getByRole("region", {
      name: /Menu Cards/i,
    });
    expect(
      within(menusSection).getByRole("button", { name: /Open Restaurant Menu Layout/i })
    ).toHaveAttribute("data-archive-frame", "menu");

    const bannersSection = screen.getByRole("region", {
      name: /Banners & Hoardings/i,
    });
    expect(
      within(bannersSection).getByRole("button", { name: /Open Digital Hoarding Design/i })
    ).toHaveAttribute("data-archive-frame", "banner");

    const postersSection = screen.getByRole("region", {
      name: /Poster Campaigns/i,
    });
    expect(
      within(postersSection).getByRole("button", { name: /Open Product Campaign Posters/i })
    ).toHaveAttribute("data-archive-frame", "poster");

    const reelsSection = screen.getByRole("region", {
      name: /^Video Reels$/i,
    });
    const reelCard = within(reelsSection).getByRole("button", {
      name: /Open Cinematic Final Output/i,
    });
    expect(reelCard).toHaveAttribute("data-archive-frame", "reel");
    fireEvent.click(reelCard);

    const dialog = screen.getByRole("dialog", {
      name: /Cinematic Final Output preview/i,
    });
    const video = dialog.querySelector("video");

    expect(video).toBeInTheDocument();
    expect(video).toHaveClass("object-contain");
    expect(video).toHaveAttribute("preload", "metadata");
  });

  it("shows the complete visual archive by default", () => {
    render(<VideoShowcase />);

    expect(
      screen.getByRole("link", {
        name: /^All projects section 16 projects$/i,
      })
    ).toHaveAttribute("href", "#work");
    expect(screen.getAllByTestId("work-reel-card")).toHaveLength(16);
    expect(screen.getByText("Visual Work Archive")).toBeInTheDocument();
    expect(screen.getByText("Logo systems, menus, posters, banners, and reels.")).toBeInTheDocument();
  });

  it("opens video dossiers in a contained viewport frame", () => {
    render(<VideoShowcase />);

    const reelsSection = screen.getByRole("region", {
      name: /^Video Reels$/i,
    });
    fireEvent.click(
      within(reelsSection).getByRole("button", {
        name: /Open Cinematic Final Output/i,
      })
    );

    const dialog = screen.getByRole("dialog", {
      name: /Cinematic Final Output preview/i,
    });
    const video = dialog.querySelector("video");

    expect(video).toBeInTheDocument();
    expect(video).toHaveClass("object-contain");
    expect(video).toHaveAttribute("preload", "metadata");
  });

  it("keeps the work archive free of layout animation reflow", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "components", "VideoShowcase.tsx"),
      "utf8"
    );

    expect(source).not.toContain("framer-motion");
    expect(source).not.toContain("AnimatePresence");
    expect(source).not.toContain("<motion");
    expect(source).not.toContain("ScrollTrigger");
    expect(source).toContain("useGSAP");
    expect(source).toContain("IntersectionObserver");
    expect(source).not.toContain("SmartVideoPreview");
  });
});
