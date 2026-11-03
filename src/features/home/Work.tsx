import { Link } from 'react-router-dom'
import { ExternalLinks, FlowDiagram, ProjectMeta } from '@/features/projects/shared'
import type { Project } from '@/types/content'

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      <Link to={`/projects/${project.slug}`} className="underline decoration-lime decoration-2 underline-offset-4 hover:text-lime">
        View project
        <span className="sr-only">: {project.title}</span>
      </Link>
      <ExternalLinks project={project} />
    </div>
  )
}

function LeadProject({ project }: { project: Project }) {
  const details = [
    { term: 'Problem', value: project.problem },
    { term: 'Solution', value: project.solution },
    { term: 'My role', value: project.role },
  ].filter((item) => item.value)

  return (
    <article className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <ProjectMeta project={project} />
        <h3 className="display mt-4 text-[clamp(2.75rem,6vw,6rem)]">{project.title}</h3>
        <p className="mt-6 max-w-[58ch] text-lg">{project.summary}</p>
        <dl className="mt-8 space-y-5">
          {details.map((item) => (
            <div key={item.term} className="grid gap-1 sm:grid-cols-[6.5rem_1fr]">
              <dt className="meta pt-1">{item.term}</dt>
              <dd className="max-w-[58ch] text-muted">{item.value}</dd>
            </div>
          ))}
        </dl>
        {project.technologies.length > 0 && (
          <p className="meta mt-6">{project.technologies.join(', ')}</p>
        )}
        <div className="mt-6"><ProjectLinks project={project} /></div>
      </div>
      <div className="lg:col-span-4 lg:col-start-9">
        {project.cover ? (
          <img src={project.cover.url} alt={project.cover.alt} loading="lazy" className="h-full w-full object-cover" />
        ) : project.flowSteps.length > 0 ? (
          <FlowDiagram steps={project.flowSteps} />
        ) : null}
      </div>
    </article>
  )
}

function SupportingProject({ project, offset }: { project: Project; offset: boolean }) {
  return (
    <article className={`border-t border-line-strong pt-5 ${offset ? 'lg:col-span-4 lg:col-start-9 lg:mt-24' : 'lg:col-span-6'}`}>
      <ProjectMeta project={project} />
      <h3 className="display mt-4 text-[clamp(2.5rem,4.6vw,4.75rem)]">{project.title}</h3>
      {project.cover && <img src={project.cover.url} alt={project.cover.alt} loading="lazy" className="mt-5 aspect-video w-full object-cover" />}
      <p className="mt-4 max-w-[48ch] text-muted">{project.summary}</p>
      {project.technologies.length > 0 && <p className="meta mt-4">{project.technologies.join(', ')}</p>}
      <div className="mt-5"><ProjectLinks project={project} /></div>
    </article>
  )
}

export function Work({ projects }: { projects: Project[] }) {
  const [lead, ...supporting] = projects
  if (!lead) return null

  return (
    <section id="work" aria-labelledby="work-title" tabIndex={-1} className="page-x relative z-10 py-20 outline-none lg:py-28">
      <div className="mb-12 flex items-end justify-between gap-6">
        <h2 id="work-title" className="display text-[clamp(1.75rem,2.6vw,2.5rem)] text-muted">Selected work</h2>
        <Link to="/projects" className="shrink-0 underline underline-offset-4 hover:text-lime">All projects</Link>
      </div>
      <LeadProject project={lead} />
      {supporting.length > 0 && (
        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-0">
          {supporting.map((project, index) => (
            <SupportingProject key={project.slug} project={project} offset={index % 2 === 1} />
          ))}
        </div>
      )}
    </section>
  )
}
