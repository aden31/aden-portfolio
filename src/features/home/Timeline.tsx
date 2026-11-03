import { Link } from 'react-router-dom'
import { Reveal, RevealText, ScrollLine } from '@/components/motion/Reveal'

export type TimelineEntry = { id: string; period: string | null; title: string; organization: string; description: string }

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) return null
  return (
    <section aria-labelledby="experience-title" className="page-x relative z-10 grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
      <div className="lg:col-span-4">
        <RevealText id="experience-title" text="Education and experience" className="display text-[clamp(1.75rem,2.6vw,2.5rem)] text-muted" />
        <Link to="/experience" className="mt-4 inline-block underline underline-offset-4 hover:text-accent">Full history</Link>
      </div>
      <ol className="relative lg:col-span-7 lg:col-start-6">
        <ScrollLine />
        {entries.map((entry) => (
          <Reveal as="li" key={entry.id} className="relative pb-10 pl-7 last:pb-0">
            <span aria-hidden="true" className="absolute -left-[5px] top-2 size-[9px] bg-paper" />
            {entry.period && <p className="meta">{entry.period}</p>}
            <h3 className="display mt-1 text-[clamp(2rem,3.4vw,3rem)]">{entry.title}</h3>
            <p className="mt-1">{entry.organization}</p>
            {entry.description && <p className="max-w-[56ch] text-muted">{entry.description}</p>}
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
