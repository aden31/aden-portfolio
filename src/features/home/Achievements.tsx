import { Link } from 'react-router-dom'
import { CountUp, Reveal, RevealText } from '@/components/motion/Reveal'
import type { Achievement } from '@/types/content'

export function Achievements({ items }: { items: Achievement[] }) {
  if (items.length === 0) return null
  return (
    <section aria-labelledby="achievements-title" className="page-x relative z-10 py-20 lg:py-28">
      <div className="mb-12 flex items-end justify-between gap-6">
        <RevealText id="achievements-title" text="Achievements" className="display text-[clamp(1.75rem,2.6vw,2.5rem)] text-muted" />
        <Link to="/achievements" className="shrink-0 underline underline-offset-4 hover:text-accent">All achievements</Link>
      </div>
      <ul className="grid gap-12 md:grid-cols-12 md:gap-8">
        {items.map((item, index) => (
          <Reveal as="li" key={item.title} delay={index * 0.1} className={index === 0 ? 'md:col-span-6' : 'md:col-span-3'}>
            <p className={`display ${index === 0 ? 'text-[clamp(6rem,15vw,15rem)] text-accent' : 'text-[clamp(4rem,7vw,7rem)]'}`}>
              <CountUp value={item.value ?? ''} />
            </p>
            <p className="meta mt-3 text-paper">{item.label}</p>
            <p className="mt-2 max-w-[34ch] font-medium">{item.title}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
