import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import BentoGrid from "@/components/BentoGrid";

describe("BentoGrid", () => {
  afterEach(() => {
    cleanup();
  });

  it("unmounts animation effects without recursive GSAP cleanup", () => {
    const { unmount } = render(<BentoGrid />);

    expect(() => unmount()).not.toThrow();
  });
});
