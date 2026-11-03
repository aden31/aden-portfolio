import { Reveal } from '@/components/motion/Reveal'
import { ContentGate } from '@/components/ContentGate'
import { PageIntro } from '@/components/PageIntro'
import { VerificationTag } from '@/components/Tag'
import { usePageMeta } from '@/hooks/usePageMeta'
import { EVIDENCE_LABEL, type SiteContent } from '@/types/content'

function Skills({ content }: { content: SiteContent }) {
  return (
    <>
      <PageIntro title="Skills">Labelled by how I’ve used each one, because a percentage wouldn’t tell you anything.</PageIntro>
      <div className="page-x py-10 lg:py-14">
        {content.skillGroups.map((group) => (
          <Reveal as="section" key={group.name} className="grid gap-4 border-t border-line py-8 lg:grid-cols-12 lg:gap-8">
            <h2 className="display text-[clamp(1.875rem,2.8vw,2.5rem)] lg:col-span-4">{group.name}</h2>
            <ul className="lg:col-span-8">
              {group.skills.map((skill) => (
                <li key={skill.name} className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-8">
                  <p className="font-medium sm:col-span-2">{skill.name}</p>
                  <p className="text-muted sm:col-span-3">{skill.usage}</p>
                  <div className="sm:col-span-3">
                    {skill.needsVerification ? <VerificationTag /> : <p className="meta pt-1">{EVIDENCE_LABEL[skill.evidence]}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </>
  )
}

export function SkillsPage() {
  usePageMeta('Skills', 'Skills of Aden Lutfil Irsyadi, labelled by how each one has been used.')
  return <ContentGate>{(content) => <Skills content={content} />}</ContentGate>
}
