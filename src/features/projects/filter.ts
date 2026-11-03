import type { Project, ProjectStatus } from '@/types/content'

export type SortKey = 'curated' | 'newest' | 'title'

export type ProjectFilters = {
  query: string
  category: string
  technology: string
  status: string
  sort: SortKey
}

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  const query = filters.query.trim().toLowerCase()
  const matches = projects.filter((project) => {
    const haystack = [project.title, project.summary, project.context, project.category ?? '', ...project.technologies]
      .join(' ')
      .toLowerCase()
    return (
      (!query || haystack.includes(query)) &&
      (!filters.category || project.category === filters.category) &&
      (!filters.technology || project.technologies.includes(filters.technology)) &&
      (!filters.status || project.projectStatus === (filters.status as ProjectStatus))
    )
  })
  if (filters.sort === 'title') return [...matches].sort((a, b) => a.title.localeCompare(b.title))
  if (filters.sort === 'newest') return [...matches].sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
  return matches
}

export function uniqueValues<T>(values: (T | null | undefined)[]): T[] {
  return [...new Set(values.filter((value): value is T => value !== null && value !== undefined))]
}
