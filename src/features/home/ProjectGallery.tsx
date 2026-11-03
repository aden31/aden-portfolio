import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import { ProjectMeta } from '@/features/projects/shared'
import type { Project } from '@/types/content'

function Card({ project, onFocus }: { project: Project; onFocus?: () => void }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      onFocus={onFocus}
      className="group block w-[min(82vw,44rem)] shrink-0 snap-center"
    >
      <span className="block aspect-video overflow-hidden rounded-xl border border-line bg-charcoal">
        {project.cover && (
          <img
            src={project.cover.url}
            alt={project.cover.alt}
            loading="lazy"
            className="size-full object-cover object-top transition-transform duration-700 ease-cut group-hover:scale-105"
          />
        )}
      </span>
      <span className="mt-4 block"><ProjectMeta project={project} /></span>
      <span className="display mt-2 block text-[clamp(2rem,3.4vw,3.25rem)] transition-colors group-hover:text-accent">{project.title}</span>
    </Link>
  )
}

/** On a desktop the page scroll moves the cards sideways. Elsewhere it's a row you swipe. */
export function ProjectGallery({ projects }: { projects: Project[] }) {
  return projects.length > 0 ? <Gallery projects={projects} /> : null
}

function Gallery({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [pinned, setPinned] = useState(false)
  const [distance, setDistance] = useState(0)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const travel = useMotionValue(0)
  const x = useTransform([scrollYProgress, travel], ([progress, max]: number[]) => -progress * max)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const update = () => {
      const active = query.matches && !reduced
      setPinned(active)
      const track = trackRef.current
      const next = active && track ? Math.max(0, track.scrollWidth - window.innerWidth) : 0
      setDistance(next)
      travel.set(next)
    }
    update()
    window.addEventListener('resize', update)
    const observer = new ResizeObserver(update)
    if (trackRef.current) observer.observe(trackRef.current)
    return () => {
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
  }, [reduced, travel])

  const heading = <h2 id="gallery-title" className="display text-[clamp(1.75rem,2.6vw,2.5rem)] text-muted">Live work</h2>

  if (!pinned) {
    return (
      <section ref={sectionRef} aria-labelledby="gallery-title" className="relative z-10 py-20">
        <div className="page-x mb-8">{heading}</div>
        <div ref={trackRef} className="page-x flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
          {projects.map((project) => <Card key={project.slug} project={project} />)}
        </div>
      </section>
    )
  }

  const focusCard = (index: number) => {
    const section = sectionRef.current
    if (!section) return
    const top = section.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (index / Math.max(1, projects.length - 1)) * distance })
  }

  return (
    <section ref={sectionRef} aria-labelledby="gallery-title" className="relative z-10" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-clip pt-16">
        <div className="page-x mb-8">{heading}</div>
        <motion.div ref={trackRef} style={{ x }} data-testid="gallery-track" className="page-x flex w-max gap-8">
          {projects.map((project, index) => <Card key={project.slug} project={project} onFocus={() => focusCard(index)} />)}
        </motion.div>
      </div>
    </section>
  )
}
