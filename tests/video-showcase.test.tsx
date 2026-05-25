import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import VideoShowcase from "@/components/VideoShowcase";
import { SHOWCASE_PROJECTS } from "@/content/portfolio";

describe("VideoShowcase", () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
  });

  it("uses local category controls without hash navigation and keeps menus last", () => {
    render(<VideoShowcase />);

    expect(
      screen.getByRole("button", {
        name: /^All projects section 27 projects$/i,
      })
    ).toHaveAttribute("aria-controls", "work");
    expect(
      screen.getByRole("button", {
        name: /^Logos section 7 projects$/i,
      })
    ).toHaveAttribute("aria-controls", "work-logos");
    expect(
      screen.getByRole("button", {
        name: /^Posters section 14 projects$/i,
      })
    ).toHaveAttribute("aria-controls", "work-posters");
    expect(
      screen.getByRole("button", {
        name: /^Banners section 3 projects$/i,
      })
    ).toHaveAttribute("aria-controls", "work-banners");
    expect(
      screen.getByRole("button", {
        name: /^Video Reels section 1 projects$/i,
      })
    ).toHaveAttribute("aria-controls", "work-reels");
    expect(
      screen.getByRole("button", {
        name: /^Menus section 2 projects$/i,
      })
    ).toHaveAttribute("aria-controls", "work-menus");

    const sectionControls = screen.getAllByRole("button", {
      name: /section \d+ projects$/i,
    });
    expect(sectionControls.at(-1)).toHaveAccessibleName(/^Menus section 2 projects$/i);
    expect(sectionControls.some((control) => control.hasAttribute("href"))).toBe(false);

    window.location.hash = "";
    fireEvent.click(
      screen.getByRole("button", {
        name: /^Video Reels section 1 projects$/i,
      })
    );
    expect(window.location.hash).toBe("");
    expect(
      document.querySelector("#work [data-native-scroll='true']")
    ).toBeNull();
  });

  it("renders category sections with project counts and opens an image-only project preview", () => {
    render(<VideoShowcase />);

    const logosSection = screen.getByRole("region", {
      name: /Brand Identity & Logos/i,
    });

    expect(within(logosSection).getByText("Logos / 07")).toBeInTheDocument();
    expect(
      within(logosSection).getByRole("button", {
        name: /Open Coastal Cravings Street Identity/i,
      })
    ).toHaveAttribute("data-archive-frame", "logo");

    const menusSection = screen.getByRole("region", {
      name: /Print Menus & Layouts/i,
    });
    expect(within(menusSection).getByText("Menus / 02")).toBeInTheDocument();
    expect(
      within(menusSection).getByRole("button", {
        name: /Open Restaurant Menu Layout/i,
      })
    ).toHaveAttribute("data-archive-frame", "menu");

    const projectCard = within(logosSection).getByRole("button", {
      name: /Open Coastal Cravings Street Identity/i,
    });
    fireEvent.click(projectCard);

    const dialog = screen.getByRole("dialog", {
      name: /Coastal Cravings Street Identity preview/i,
    });

    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByAltText("Coastal Cravings signage logo mockup")).toBeInTheDocument();
    expect(screen.queryByText("Impact")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Discuss this direction/i })).not.toBeInTheDocument();
  });

  it("uses distinct archive frames for menus, banners, posters, and video reels", () => {
    render(<VideoShowcase />);

    const menusSection = screen.getByRole("region", {
      name: /Print Menus & Layouts/i,
    });
    expect(
      within(menusSection).getByRole("button", { name: /Open Restaurant Menu Layout/i })
    ).toHaveAttribute("data-archive-frame", "menu");

    const bannersSection = screen.getByRole("region", {
      name: /Ads, Banners & Hoardings/i,
    });
    expect(
      within(bannersSection).getByRole("button", { name: /Open Digital Hoarding Design/i })
    ).toHaveAttribute("data-archive-frame", "banner");

    const postersSection = screen.getByRole("region", {
      name: /Visual Campaign Posters/i,
    });
    expect(
      within(postersSection).getByRole("button", { name: /Open GreenMonk Gourmet Launch Poster/i })
    ).toHaveAttribute("data-archive-frame", "poster");

    const reelsSection = screen.getByRole("region", {
      name: /^Motion Edits & Reels$/i,
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

  it("renders the video reel archive card as a lightweight viewport-gated inline preview", () => {
    const originalIntersectionObserver = window.IntersectionObserver;
    const observedTargets = new Map<Element, IntersectionObserverCallback>();

    class TriggerableIntersectionObserver {
      constructor(private callback: IntersectionObserverCallback) {}

      observe = vi.fn((target: Element) => {
        observedTargets.set(target, this.callback);
      });
      unobserve = vi.fn((target: Element) => {
        observedTargets.delete(target);
      });
      disconnect = vi.fn();
    }

    window.IntersectionObserver =
      TriggerableIntersectionObserver as unknown as typeof IntersectionObserver;

    render(<VideoShowcase />);

    const reelsSection = screen.getByRole("region", {
      name: /^Motion Edits & Reels$/i,
    });
    const reelCard = within(reelsSection).getByRole("button", {
      name: /Open Cinematic Final Output/i,
    });
    const inlineVideo = reelCard.querySelector("video");

    expect(inlineVideo).toBeInTheDocument();
    expect(inlineVideo).toHaveAttribute("poster", "/works/thumbs/project-4.webp");
    expect(inlineVideo).toHaveAttribute("preload", "metadata");
    expect(inlineVideo).toHaveProperty("muted", true);
    expect(inlineVideo).toHaveProperty("playsInline", true);
    expect(inlineVideo).toHaveProperty("loop", true);
    expect(inlineVideo).not.toHaveAttribute("controls");
    expect(inlineVideo).not.toHaveAttribute("src");

    act(() => {
      observedTargets.get(inlineVideo as HTMLVideoElement)?.(
        [
          {
            isIntersecting: true,
            target: inlineVideo as HTMLVideoElement,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    expect(inlineVideo).toHaveAttribute("src", "/works/Videos/Final Output.mp4");

    window.IntersectionObserver = originalIntersectionObserver;
  });

  it("uses normal card-fit media with faster stronger hover zoom only for logo cards", () => {
    render(<VideoShowcase />);

    const logosSection = screen.getByRole("region", {
      name: /Brand Identity & Logos/i,
    });
    const logoCard = within(logosSection).getByRole("button", {
      name: /Open BeSuperMind Neural Identity/i,
    });
    const logoImage = within(logoCard).getByAltText("BeSuperMind learning logo design");
    const logoMediaFrame = logoImage.parentElement;

    expect(logoMediaFrame).toHaveClass("inset-3");
    expect(logoMediaFrame).not.toHaveClass("rounded-full");
    expect(logoImage).toHaveClass("object-cover");
    expect(logoImage).toHaveClass("duration-300");
    expect(logoImage).toHaveClass("motion-safe:group-hover:scale-[1.22]");

    const menusSection = screen.getByRole("region", {
      name: /Print Menus & Layouts/i,
    });
    const menuCard = within(menusSection).getByRole("button", {
      name: /Open Restaurant Menu Layout/i,
    });
    const menuImage = within(menuCard).getByAltText("Menu Card Mockup");

    expect(menuImage.parentElement).not.toHaveClass("rounded-full");
    expect(menuImage).not.toHaveClass("duration-300");
    expect(menuImage).not.toHaveClass("motion-safe:group-hover:scale-[1.22]");
  });

  it("shows the complete visual archive by default", () => {
    render(<VideoShowcase />);

    expect(
      screen.getByRole("button", {
        name: /^All projects section 27 projects$/i,
      })
    ).toHaveAttribute("aria-controls", "work");
    expect(screen.getAllByTestId("work-reel-card")).toHaveLength(27);
    expect(screen.getByText("Creative Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Brand identity, print layouts, campaigns, ads, and motion reels.")).toBeInTheDocument();
    expect(screen.getByText("All Work")).toBeInTheDocument();
    expect(screen.getByText("Brand Identity")).toBeInTheDocument();
    expect(screen.getByText("Print & Menus")).toBeInTheDocument();
    expect(screen.getByText("Visual Campaigns")).toBeInTheDocument();
    expect(screen.getByText("Ads & Banners")).toBeInTheDocument();
    expect(screen.getByText("Motion & Reels")).toBeInTheDocument();
  });

  it("uses lightweight project thumbnails for archive card media", () => {
    render(<VideoShowcase />);

    SHOWCASE_PROJECTS.filter((project) => project.type === "image").forEach((project) => {
      const expectedThumbnail = `/works/thumbs/project-${project.id}.webp`;
      const encodedThumbnail = encodeURIComponent(expectedThumbnail);
      const archiveImage = screen.getByAltText(project.mediaAlt);
      const renderedSources = [
        archiveImage.getAttribute("src"),
        archiveImage.getAttribute("srcset"),
      ].join(" ");

      expect(renderedSources).toContain(encodedThumbnail);
    });
  });

  it("keeps new logo thumbnails in the visible archive card aspect ratio", async () => {
    const newLogoProjectIds = [17, 18, 19, 20, 21];

    await Promise.all(
      newLogoProjectIds.map(async (projectId) => {
        const metadata = await sharp(
          join(process.cwd(), "public", "works", "thumbs", `project-${projectId}.webp`)
        ).metadata();

        expect(metadata.width).toBe(760);
        expect(metadata.height).toBe(570);
      })
    );
  });

  it("opens video dossiers in a contained viewport frame", () => {
    render(<VideoShowcase />);

    const reelsSection = screen.getByRole("region", {
      name: /^Motion Edits & Reels$/i,
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
    expect(source).not.toContain("overscroll-contain");
    expect(source).toContain("useGSAP");
    expect(source).toContain("IntersectionObserver");
    expect(source).not.toContain("scrollArchiveToSection");
    expect(source).not.toContain("archiveViewportRef");
    expect(source).not.toContain("SmartVideoPreview");
  });

  it("keeps the work archive on page scroll while the chapter rail stays sticky", () => {
    render(<VideoShowcase />);

    expect(screen.getByTestId("pinned-dossier-chapter-rail")).toHaveClass(
      "lg:sticky"
    );
    expect(
      document.querySelector("#work [data-native-scroll='true']")
    ).toBeNull();
    expect(screen.getByTestId("pinned-dossier-chapter-content")).not.toHaveClass(
      "lg:overflow-y-auto"
    );
  });
});
