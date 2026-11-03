import { motion } from 'motion/react'
import { Link, useParams } from 'react-router-dom'
import { RevealText } from '@/components/motion/Reveal'
import { ContentGate } from '@/components/ContentGate'
import { Row } from '@/components/PageIntro'
import { ExternalLinks, FlowDiagram, ProjectMeta } from '@/features/projects/shared'
import { usePageMeta } from '@/hooks/usePageMeta'
import { NotFound } from '@/pages/NotFoundPage'
import type { Project } from '@/types/content'

function Detail({ project, related }: { project: Project; related: Project[] }) {
  usePageMeta(project.title, project.summary)
  const text = [
    { label: 'Background', value: project.context },
    { label: 'Problem', value: project.problem },
    { label: 'Goals', value: project.goals },
    { label: 'Solution', value: project.solution },
    { label: 'My role', value: project.role },
  ]
  const after = [
    { label: 'Technical challenges', value: project.challenges },
    { label: 'Verified results', value: project.verifiedOutcomes },
  ]

  return (
    <article>
      <header className="page-x border-b border-line pb-12 pt-10 lg:pt-14">
        <Link to="/projects" className="meta underline-offset-4 hover:text-paper hover:underline">All projects</Link>
        <div className="mt-8"><ProjectMeta project={project} /></div>
        <RevealText as="h1" immediate text={project.title} className="display mt-4 max-w-[18ch] text-[clamp(3.5rem,9vw,9rem)]" />
        <p className="mt-6 max-w-[60ch] text-lg">{project.summary}</p>
        <div className="mt-5 flex flex-wrap gap-6"><ExternalLinks project={project} /></div>
      </header>
      {project.cover && (
        <motion.img
          src={project.cover.url}
          alt={project.cover.alt}
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-h-[70vh] w-full object-cover object-top"
        />
      )}
      <div className="page-x">
        {text.filter((item) => item.value).map((item) => (
          <Row key={item.label} label={item.label}><p className="max-w-[62ch]">{item.value}</p></Row>
        ))}
        {project.flowSteps.length > 0 && <Row label="System flow"><div className="max-w-md"><FlowDiagram steps={project.flowSteps} /></div></Row>}
        {project.keyFeatures.length > 0 && (
          <Row label="Key features">
            <ul className="max-w-[62ch] list-inside list-disc space-y-2 marker:text-accent">
              {project.keyFeatures.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </Row>
        )}
        {project.technologies.length > 0 && <Row label="Technologies"><p className="font-mono">{project.technologies.join(', ')}</p></Row>}
        {after.filter((item) => item.value).map((item) => (
          <Row key={item.label} label={item.label}><p className="max-w-[62ch]">{item.value}</p></Row>
        ))}
        {project.gallery.length > 0 && (
          <Row label="Screenshots">
            <div className="grid gap-6 sm:grid-cols-2">
              {project.gallery.map((image) => (
                <figure key={image.url}>
                  <img src={image.url} alt={image.alt} loading="lazy" className="w-full" />
                  {image.caption && <figcaption className="meta mt-2">{image.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </Row>
        )}
        {related.length > 0 && (
          <Row label="Related projects">
            <ul className="space-y-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link to={`/projects/${item.slug}`} className="display text-[clamp(1.875rem,3vw,2.75rem)] hover:text-accent">{item.title}</Link>
                </li>
              ))}
            </ul>
          </Row>
        )}
      </div>
    </article>
  )
}

export function ProjectDetailPage() {
  const { slug } = useParams()
  return (
    <ContentGate>
      {({ projects }) => {
        const project = projects.find((item) => item.slug === slug)
        if (!project) return <NotFound />
        const related = projects.filter((item) => item.slug !== slug && item.category === project.category).slice(0, 2)
        return <Detail key={project.slug} project={project} related={related} />
      }}
    </ContentGate>
  )
}
