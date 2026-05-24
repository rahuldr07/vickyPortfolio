import { describe, expect, it } from "vitest";
import { SHOWCASE_PROJECTS } from "@/content/portfolio";
import {
  filterProjectsByCategory,
  getProjectCountByCategory,
  isProjectCategory,
} from "@/lib/projects";

describe("project helpers", () => {
  it("returns all projects for All Works", () => {
    const result = filterProjectsByCategory(SHOWCASE_PROJECTS, "All Works");
    expect(result).toHaveLength(SHOWCASE_PROJECTS.length);
  });

  it("filters by a specific category", () => {
    const result = filterProjectsByCategory(SHOWCASE_PROJECTS, "Cinematic");
    expect(result.every((project) => project.category === "Cinematic")).toBe(true);
    expect(getProjectCountByCategory(SHOWCASE_PROJECTS, "Cinematic")).toBe(
      result.length
    );
  });

  it("validates category values", () => {
    expect(isProjectCategory("Brand Identity")).toBe(true);
    expect(isProjectCategory("Unknown")).toBe(false);
  });

  it("provides dossier metadata for every showcased project", () => {
    SHOWCASE_PROJECTS.forEach((project) => {
      expect(project.brief).toBeTruthy();
      expect(project.impact).toBeTruthy();
      expect(project.role).toBeTruthy();
      expect(project.mediaAlt).toBeTruthy();
      expect(project.deliverables.length).toBeGreaterThan(0);
      expect(project.visualTreatment).toMatchObject({
        code: expect.any(String),
        signal: expect.any(String),
        texture: expect.any(String),
      });
    });
  });
});
