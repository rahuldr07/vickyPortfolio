import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CustomCursor from "@/components/CustomCursor";

function setMatchMedia(matchesFor: Partial<Record<string, boolean>> = {}) {
  vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
    matches: Boolean(matchesFor[query]),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("CustomCursor", () => {
  beforeEach(() => {
    setMatchMedia();
  });

  afterEach(() => {
    cleanup();
    document.body.className = "";
    vi.clearAllMocks();
  });

  it("stays disabled for reduced motion users", async () => {
    setMatchMedia({ "(prefers-reduced-motion: reduce)": true });

    render(<CustomCursor />);
    fireEvent.mouseMove(window, { clientX: 48, clientY: 64 });

    await waitFor(() => {
      expect(screen.queryByTestId("custom-cursor")).not.toBeInTheDocument();
    });
  });

  it("stays disabled on coarse pointer devices", async () => {
    setMatchMedia({ "(pointer: coarse)": true });

    render(<CustomCursor />);
    fireEvent.mouseMove(window, { clientX: 48, clientY: 64 });

    await waitFor(() => {
      expect(screen.queryByTestId("custom-cursor")).not.toBeInTheDocument();
    });
  });

  it("appears in the default HUD state after mouse movement", async () => {
    render(<CustomCursor />);

    fireEvent.mouseMove(window, { clientX: 48, clientY: 64 });

    const cursor = await screen.findByTestId("custom-cursor");
    expect(cursor).toHaveAttribute("data-cursor-state", "default");
    expect(cursor).not.toHaveTextContent("Open");
  });

  it("switches to an interactive state over actionable controls", async () => {
    render(
      <>
        <CustomCursor />
        <a href="/work">Work</a>
      </>
    );

    fireEvent.mouseMove(window, { clientX: 48, clientY: 64 });
    fireEvent.mouseOver(screen.getByRole("link", { name: "Work" }));

    const cursor = await screen.findByTestId("custom-cursor");
    expect(cursor).toHaveAttribute("data-cursor-state", "interactive");
  });

  it("uses media override labels for visual project surfaces", async () => {
    render(
      <>
        <CustomCursor />
        <div data-cursor="media" data-cursor-label="Open">
          Project visual
        </div>
      </>
    );

    fireEvent.mouseMove(window, { clientX: 48, clientY: 64 });
    fireEvent.mouseOver(screen.getByText("Project visual"));

    const cursor = await screen.findByTestId("custom-cursor");
    expect(cursor).toHaveAttribute("data-cursor-state", "media");
    expect(cursor).toHaveTextContent("Open");
  });

  it("switches to a text caret state over selectable copy", async () => {
    render(
      <>
        <CustomCursor />
        <p data-cursor="text">Selectable dossier copy</p>
      </>
    );

    fireEvent.mouseMove(window, { clientX: 48, clientY: 64 });
    fireEvent.mouseOver(screen.getByText("Selectable dossier copy"));

    const cursor = await screen.findByTestId("custom-cursor");
    expect(cursor).toHaveAttribute("data-cursor-state", "text");
  });

  it("compresses into a pressed state and hides when the pointer leaves", async () => {
    render(<CustomCursor />);

    fireEvent.mouseMove(window, { clientX: 48, clientY: 64 });
    fireEvent.mouseDown(window);

    const cursor = await screen.findByTestId("custom-cursor");
    expect(cursor).toHaveAttribute("data-cursor-state", "pressed");

    fireEvent.mouseLeave(document);

    await waitFor(() => {
      expect(screen.queryByTestId("custom-cursor")).not.toBeInTheDocument();
    });
  });
});
