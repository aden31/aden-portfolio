import { Reveal, ScrollWords } from '@/components/motion/Reveal'
import type { Profile } from '@/types/content'

export function About({ profile }: { profile: Profile }) {
  return (
    <section aria-labelledby="about-title" className="page-x relative z-10 grid gap-10 py-20 lg:grid-cols-12 lg:py-32">
      <ScrollWords id="about-title" text={profile.aboutStatement} className="display text-[clamp(3rem,7.4vw,7.5rem)] lg:col-span-7" />
      <ul className="space-y-6 lg:col-span-4 lg:col-start-9 lg:mt-[4vw]">
        {profile.aboutPoints.map((point, index) => (
          <Reveal as="li" key={point} delay={index * 0.1} className="max-w-[46ch] text-muted">{point}</Reveal>
        ))}
      </ul>
    </section>
  )
}
