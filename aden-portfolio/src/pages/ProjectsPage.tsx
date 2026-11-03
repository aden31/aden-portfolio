import { Link, useSearchParams } from 'react-router-dom'
import { ContentGate } from '@/components/ContentGate'
import { PageIntro } from '@/components/PageIntro'
import { filterProjects, uniqueValues, type SortKey } from '@/features/projects/filter'
import { ProjectMeta, STATUS_LABEL } from '@/features/projects/shared'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { Project } from '@/types/content'

const fieldStyle = 'min-h-12 w-full border border-line-strong bg-ink px-3 text-paper'

function Select({ label, value, options, onChange }: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="meta mb-1.5 block">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={fieldStyle}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

function Projects({ projects }: { projects: Project[] }) {
  const [params, setParams] = useSearchParams()
  const filters = {
    query: params.get('q') ?? '',
    category: params.get('category') ?? '',
    technology: params.get('technology') ?? '',
    status: params.get('status') ?? '',
    sort: (params.get('sort') ?? 'curated') as SortKey,
  }
  const set = (key: string, value: string) =>
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })

  const categories = uniqueValues(projects.map((project) => project.category))
  const technologies = uniqueValues(projects.flatMap((project) => project.technologies))
  const statuses = uniqueValues(projects.map((project) => project.projectStatus))
  const results = filterProjects(projects, filters)

  return (
    <>
      <PageIntro title="Projects">Web systems, learning platforms, and automation I’ve built.</PageIntro>
      <div className="page-x py-10">
        <form role="search" onSubmit={(event) => event.preventDefault()} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="meta mb-1.5 block">Search</span>
            <input type="search" value={filters.query} onChange={(event) => set('q', event.target.value)} className={fieldStyle} />
          </label>
          <Select label="Category" value={filters.category} onChange={(value) => set('category', value)}
            options={[{ value: '', label: 'All categories' }, ...categories.map((value) => ({ value, label: value }))]} />
          <Select label="Technology" value={filters.technology} onChange={(value) => set('technology', value)}
            options={[{ value: '', label: 'All technologies' }, ...technologies.map((value) => ({ value, label: value }))]} />
          {statuses.length > 0 && (
            <Select label="Status" value={filters.status} onChange={(value) => set('status', value)}
              options={[{ value: '', label: 'All statuses' }, ...statuses.map((value) => ({ value, label: STATUS_LABEL[value] }))]} />
          )}
          <Select label="Sort by" value={filters.sort} onChange={(value) => set('sort', value === 'curated' ? '' : value)}
            options={[{ value: 'curated', label: 'Recommended' }, { value: 'newest', label: 'Newest' }, { value: 'title', label: 'Title A–Z' }]} />
        </form>

        <p role="status" className="meta mt-8">{results.length} of {projects.length} projects</p>

        {results.length === 0 ? (
          <div className="py-16">
            <p className="text-lg">No projects match these filters.</p>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="mt-3 min-h-11 underline decoration-accent decoration-2 underline-offset-4">Clear filters</button>
          </div>
        ) : (
          <ul className="mt-4">
            {results.map((project) => (
              <li key={project.slug} className="border-t border-line">
                <Link to={`/projects/${project.slug}`} className="group grid gap-3 py-8 lg:grid-cols-12 lg:gap-8">
                  <div className="lg:col-span-7">
                    <ProjectMeta project={project} />
                    <h2 className="display mt-3 text-[clamp(2.5rem,4.8vw,4.75rem)] transition-colors group-hover:text-accent">{project.title}</h2>
                  </div>
                  <div className="lg:col-span-4 lg:col-start-9 lg:pt-8">
                    <p className="text-muted">{project.summary}</p>
                    {project.technologies.length > 0 && <p className="meta mt-3">{project.technologies.join(', ')}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export function ProjectsPage() {
  usePageMeta('Projects', 'Web systems, learning platforms, and automation built by Aden Lutfil Irsyadi.')
  return <ContentGate>{(content) => <Projects projects={content.projects} />}</ContentGate>
}
