import { useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { ContentGate } from '@/components/ContentGate'
import { Marquee } from '@/components/motion/Marquee'
import { SectionRule } from '@/components/SectionRule'
import { Trace } from '@/components/Trace'
import { About } from '@/features/home/About'
import { Achievements } from '@/features/home/Achievements'
import { Closing } from '@/features/home/Closing'
import { Expertise } from '@/features/home/Expertise'
import { Hero } from '@/features/home/Hero'
import { ProjectGallery } from '@/features/home/ProjectGallery'
import { Timeline } from '@/features/home/Timeline'
import { Work } from '@/features/home/Work'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { SiteContent } from '@/types/content'

const FEATURED_PROJECTS = 3
const FEATURED_ACHIEVEMENTS = 3
const TIMELINE_ITEMS = 4

function HomeSections({ content }: { content: SiteContent }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { profile, socialLinks, pipeline, expertise } = content
  const projects = content.projects.filter((project) => project.isFeatured).slice(0, FEATURED_PROJECTS)
  const achievements = content.achievements.filter((item) => item.isFeatured && item.value).slice(0, FEATURED_ACHIEVEMENTS)
  const timeline = [
    ...content.education.map((item) => ({ id: item.id, period: item.period, title: item.program, organization: item.institution, description: item.faculty ?? '' })),
    ...content.experiences.map((item) => ({ id: item.id, period: item.period, title: item.position, organization: item.organization, description: item.description })),
  ].slice(0, TIMELINE_ITEMS)

  const technologies = [...new Set(content.skillGroups.flatMap((group) => group.skills.filter((skill) => !skill.needsVerification).map((skill) => skill.name)))]

  const explore = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const target = document.getElementById('work') ?? document.getElementById('about-title')
    target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    target?.focus({ preventScroll: true })
  }

  return (
    <div ref={hostRef} className="relative isolate overflow-x-clip [--trace-inset:calc(var(--gutter)/2)]">
      <Trace hostRef={hostRef} />
      <Hero profile={profile} socialLinks={socialLinks} stages={pipeline} onExplore={explore} />
      <SectionRule />
      <Marquee items={technologies} />
      <About profile={profile} />
      {projects.length > 0 && <><SectionRule /><Work projects={projects} /></>}
      <ProjectGallery projects={content.projects.filter((project) => project.cover)} />
      {expertise.length > 0 && <><SectionRule /><Expertise areas={expertise} /></>}
      {achievements.length > 0 && <><SectionRule /><Achievements items={achievements} /></>}
      {timeline.length > 0 && <><SectionRule /><Timeline entries={timeline} /></>}
      <SectionRule />
      <Closing profile={profile} socialLinks={socialLinks} />
    </div>
  )
}

export function HomePage() {
  usePageMeta(null)
  return <ContentGate>{(content) => <HomeSections content={content} />}</ContentGate>
}
