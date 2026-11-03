import { ExternalLink } from 'lucide-react'
import { VerificationTag } from '@/components/Tag'
import type { Project, ProjectStatus } from '@/types/content'

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  concept: 'Concept',
  in_progress: 'In progress',
  completed: 'Completed',
  maintained: 'Maintained',
  archived: 'Archived',
}

export function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {project.year && <span className="meta">{project.year}</span>}
      {project.category && <span className="meta">{project.category}</span>}
      {project.projectStatus && <span className="meta">{STATUS_LABEL[project.projectStatus]}</span>}
      {project.needsVerification && <VerificationTag />}
    </div>
  )
}

export function ExternalLinks({ project }: { project: Project }) {
  const links = [
    project.demoUrl && { href: project.demoUrl, label: 'Live site' },
    project.repoUrl && { href: project.repoUrl, label: 'Repository' },
  ].filter((link): link is { href: string; label: string } => Boolean(link))

  return links.map((link) => (
    <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-paper">
      {link.label}
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  ))
}

/** The system's real flow, drawn from the project's steps. */
export function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <ol aria-label="System flow" className="border border-line bg-charcoal p-5 sm:p-8">
      {steps.map((step, index) => (
        <li key={step} className="relative flex items-center gap-4 pb-7 last:pb-0">
          {index < steps.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-3 w-px bg-line-strong" />}
          <span aria-hidden="true" className="relative size-[11px] shrink-0 border border-line-strong bg-surface" />
          <span className="font-mono text-[0.9375rem] text-paper">{step}</span>
        </li>
      ))}
    </ol>
  )
}
