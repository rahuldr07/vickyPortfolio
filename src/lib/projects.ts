import {
  PROJECT_CATEGORIES,
  type ProjectCategory,
  type ShowcaseProject,
} from "@/content/portfolio";

export function filterProjectsByCategory(
  projects: readonly ShowcaseProject[],
  category: ProjectCategory
): ShowcaseProject[] {
  if (category === "All Works") return [...projects];
  return projects.filter((project) => project.category === category);
}

export function getProjectCountByCategory(
  projects: readonly ShowcaseProject[],
  category: ProjectCategory
): number {
  return filterProjectsByCategory(projects, category).length;
}

export function isProjectCategory(value: string): value is ProjectCategory {
  return PROJECT_CATEGORIES.includes(value as ProjectCategory);
}
