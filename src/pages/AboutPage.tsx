import { Link } from 'react-router-dom'
import { ActionLink } from '@/components/ActionLink'
import { ContentGate } from '@/components/ContentGate'
import { PageIntro, Row } from '@/components/PageIntro'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { SiteContent } from '@/types/content'

function About({ content }: { content: SiteContent }) {
  const { profile, education } = content
  return (
    <>
      <PageIntro title="About">{profile.statusLabel}</PageIntro>
      <div className="page-x">
        <section className="grid gap-10 border-b border-line py-12 lg:grid-cols-12 lg:py-20">
          {profile.portrait && (
            <img src={profile.portrait.url} alt={profile.portrait.alt} className="aspect-[4/5] w-3/5 object-cover object-top sm:w-2/5 lg:col-span-3 lg:w-full" />
          )}
          <div className="lg:col-span-7 lg:col-start-5">
            <p className="display text-[clamp(2.75rem,5.6vw,5.5rem)]">{profile.aboutStatement}</p>
            {profile.aboutBody && <p className="mt-8 max-w-[62ch] text-lg">{profile.aboutBody}</p>}
          </div>
        </section>
        {profile.aboutPoints.length > 0 && (
          <Row label="How I work">
            <ul className="space-y-4">
              {profile.aboutPoints.map((point) => <li key={point} className="max-w-[62ch] text-muted">{point}</li>)}
            </ul>
          </Row>
        )}
        {education.length > 0 && (
          <Row label="Education">
            {education.map((item) => (
              <div key={item.id}>
                <p className="display text-[clamp(2rem,3.4vw,3rem)]">{item.program}</p>
                <p className="mt-1">{item.institution}</p>
                {item.period && <p className="meta mt-2">{item.period}</p>}
              </div>
            ))}
          </Row>
        )}
        {profile.softSkills.length > 0 && (
          <Row label="Working strengths">
            <p className="max-w-[62ch] text-muted">{profile.softSkills.join(', ')}</p>
          </Row>
        )}
        <Row label="More">
          <div className="flex flex-wrap gap-3">
            <ActionLink to="/projects">See my projects</ActionLink>
            <ActionLink to="/experience" variant="secondary">Experience</ActionLink>
            <ActionLink to="/achievements" variant="secondary">Achievements</ActionLink>
          </div>
          <p className="mt-6 text-muted">Want to talk? <Link to="/contact" className="text-paper underline underline-offset-4 hover:text-lime">Get in touch</Link>.</p>
        </Row>
      </div>
    </>
  )
}

export function AboutPage() {
  usePageMeta('About', 'Background, education, and way of working of Aden Lutfil Irsyadi.')
  return <ContentGate>{(content) => <About content={content} />}</ContentGate>
}
