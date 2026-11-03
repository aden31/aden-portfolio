import { useState } from 'react'
import { CertificateViewer } from '@/components/CertificateViewer'
import { ContentGate } from '@/components/ContentGate'
import { PageIntro } from '@/components/PageIntro'
import { uniqueValues } from '@/features/projects/filter'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { Achievement, AchievementCategory, Certificate, SiteContent } from '@/types/content'

const CATEGORY_LABEL: Record<AchievementCategory, string> = {
  academic: 'Academic',
  competition: 'Competition',
  certification: 'Certification',
  organizational: 'Organizational',
  professional: 'Professional',
}

function AchievementItem({ item }: { item: Achievement }) {
  return (
    <li className="grid gap-4 border-t border-line py-8 lg:grid-cols-12 lg:gap-8">
      <p className="display text-[clamp(3.5rem,6vw,6rem)] lg:col-span-3">{item.value}</p>
      <div className="lg:col-span-8">
        <h3 className="text-xl font-medium">{item.title}</h3>
        {item.organizer && <p className="mt-1 max-w-[62ch] text-muted">{item.organizer}</p>}
        {!item.organizer && item.label && <p className="mt-1 text-muted">{item.label}</p>}
        <p className="meta mt-3">{[item.period, CATEGORY_LABEL[item.category]].filter(Boolean).join(', ')}</p>
        {item.credentialId && <p className="meta mt-1 break-all">Certificate no. {item.credentialId}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-6">
          {item.proof && <CertificateViewer image={item.proof} label={item.title} />}
          {item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-muted underline underline-offset-4 hover:text-paper">Source</a>}
        </div>
      </div>
    </li>
  )
}

function CertificateItem({ item }: { item: Certificate }) {
  return (
    <li className="grid gap-2 border-t border-line py-6 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-7">
        <h3 className="text-lg font-medium">{item.title}</h3>
        <p className="text-muted">{item.issuer}</p>
        {item.program && <p className="meta mt-2">{item.program}</p>}
      </div>
      <div className="md:col-span-5">
        <p className="meta">{[item.period, item.hours && `${item.hours} training hours`].filter(Boolean).join(', ')}</p>
        {item.credentialId && <p className="meta mt-1 break-all">No. {item.credentialId}</p>}
        {item.image && <div className="mt-1"><CertificateViewer image={item.image} label={item.title} /></div>}
      </div>
    </li>
  )
}

function Achievements({ content }: { content: SiteContent }) {
  const [active, setActive] = useState<AchievementCategory | 'all'>('all')
  const categories = uniqueValues(content.achievements.map((item) => item.category))
  const visible = content.achievements.filter((item) => active === 'all' || item.category === active)
  const filters: (AchievementCategory | 'all')[] = ['all', ...categories]

  return (
    <>
      <PageIntro title="Achievements" />
      <div className="page-x py-10 lg:py-14">
        {categories.length > 1 && (
          <div role="group" aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2">
            {filters.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={active === value}
                onClick={() => setActive(value)}
                className={`min-h-11 border px-4 transition-colors ${active === value ? 'border-accent bg-accent text-ink' : 'border-line-strong hover:border-paper'}`}
              >
                {value === 'all' ? 'All' : CATEGORY_LABEL[value]}
              </button>
            ))}
          </div>
        )}
        <ul>{visible.map((item) => <AchievementItem key={item.id} item={item} />)}</ul>

        {content.certificates.length > 0 && (
          <section aria-labelledby="training" className="mt-20">
            <h2 id="training" className="display text-[clamp(2.5rem,5vw,4.5rem)]">Training certificates</h2>
            <p className="mb-8 mt-3 max-w-[62ch] text-muted">Completed through the Digital Talent Scholarship program. These certify finished training, not a professional license.</p>
            <ul>{content.certificates.map((item) => <CertificateItem key={item.id} item={item} />)}</ul>
          </section>
        )}
      </div>
    </>
  )
}

export function AchievementsPage() {
  usePageMeta('Achievements', 'Academic results, competition awards, and training certificates of Aden Lutfil Irsyadi.')
  return <ContentGate>{(content) => <Achievements content={content} />}</ContentGate>
}
