import { ContentGate } from '@/components/ContentGate'
import { Reveal, ScrollLine } from '@/components/motion/Reveal'
import { PageIntro } from '@/components/PageIntro'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { Experience, SiteContent } from '@/types/content'

const KIND_LABEL: Record<Experience['kind'], string> = {
  professional: 'Internship',
  academic: 'Academic role',
  organizational: 'Organization',
}

function Entry({ item }: { item: Experience }) {
  return (
    <Reveal as="li" className="relative pb-14 pl-7 last:pb-2">
      <span aria-hidden="true" className="absolute -left-[5px] top-2 size-[9px] bg-accent" />
      <p className="meta">{[item.period, KIND_LABEL[item.kind]].filter(Boolean).join(', ')}</p>
      <h3 className="display mt-2 text-[clamp(2.25rem,4.4vw,4rem)]">{item.position}</h3>
      <p className="mt-2 font-medium">{item.organization}</p>
      {item.description && <p className="mt-3 max-w-[62ch] text-muted">{item.description}</p>}
      {item.contributions.length > 0 && (
        <ul className="mt-4 max-w-[62ch] list-outside list-disc space-y-2 pl-4 marker:text-accent">
          {item.contributions.map((text) => <li key={text}>{text}</li>)}
        </ul>
      )}
    </Reveal>
  )
}

function ExperienceContent({ content }: { content: SiteContent }) {
  const { experiences, education } = content
  return (
    <>
      <PageIntro title="Experience" />
      <div className="page-x grid gap-16 py-14 lg:grid-cols-12 lg:gap-8 lg:py-20">
        {experiences.length > 0 && (
          <section aria-labelledby="work-history" className="lg:col-span-8">
            <h2 id="work-history" className="display mb-8 text-[clamp(1.75rem,2.6vw,2.5rem)] text-muted">Work and roles</h2>
            <ol className="relative"><ScrollLine />{experiences.map((item) => <Entry key={item.id} item={item} />)}</ol>
          </section>
        )}
        {education.length > 0 && (
          <section aria-labelledby="education" className="lg:col-span-3 lg:col-start-10">
            <h2 id="education" className="display mb-8 text-[clamp(1.75rem,2.6vw,2.5rem)] text-muted">Education</h2>
            {education.map((item) => (
              <div key={item.id}>
                {item.period && <p className="meta">{item.period}</p>}
                <h3 className="display mt-2 text-4xl">{item.program}</h3>
                <p className="mt-2">{item.institution}</p>
                {item.faculty && <p className="text-muted">{item.faculty}</p>}
                {item.gpa && <p className="mt-4 font-mono">GPA {item.gpa}</p>}
                {item.honors && <p className="font-mono">{item.honors}</p>}
                {item.description && <p className="mt-4 text-muted">{item.description}</p>}
              </div>
            ))}
          </section>
        )}
      </div>
    </>
  )
}

export function ExperiencePage() {
  usePageMeta('Experience', 'Internship, teaching assistant role, organization work, and education of Aden Lutfil Irsyadi.')
  return <ContentGate>{(content) => <ExperienceContent content={content} />}</ContentGate>
}
