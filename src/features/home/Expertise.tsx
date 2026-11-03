import { Reveal, RevealText } from '@/components/motion/Reveal'
import { VerificationTag } from '@/components/Tag'
import { EVIDENCE_LABEL, type EvidenceLevel, type ExpertiseArea } from '@/types/content'

const EVIDENCE_ORDER: EvidenceLevel[] = ['applied', 'project', 'learning']

export function Expertise({ areas }: { areas: ExpertiseArea[] }) {
  if (areas.length === 0) return null
  const groups = EVIDENCE_ORDER
    .map((level) => ({ level, items: areas.filter((area) => area.evidence === level) }))
    .filter((group) => group.items.length > 0)

  return (
    <section aria-labelledby="expertise-title" className="page-x relative z-10 py-20 lg:py-28">
      <RevealText id="expertise-title" text="What I can show evidence for" className="display mb-12 text-[clamp(1.75rem,2.6vw,2.5rem)] text-muted" />
      <div className="space-y-14">
        {groups.map((group) => (
          <div key={group.level} className="grid gap-4 lg:grid-cols-12">
            <h3 className="meta pt-3 text-paper lg:col-span-2">{EVIDENCE_LABEL[group.level]}</h3>
            <ul className="lg:col-span-10">
              {group.items.map((area, index) => (
                <Reveal as="li" key={area.title} delay={index * 0.05} className="group grid gap-x-8 gap-y-1 border-t border-line py-4 transition-colors hover:border-accent md:grid-cols-10">
                  <div className="md:col-span-4">
                    <p className="display text-[clamp(1.875rem,3vw,2.75rem)] transition-transform duration-300 ease-cut group-hover:translate-x-2">{area.title}</p>
                    {area.needsVerification && <div className="mt-2"><VerificationTag /></div>}
                  </div>
                  <p className="text-muted md:col-span-3 md:pt-1">{area.description}</p>
                  <p className="meta md:col-span-3 md:pt-2">{area.tools.join(', ')}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
