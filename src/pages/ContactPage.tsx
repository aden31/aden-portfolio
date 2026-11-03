import { ContentGate } from '@/components/ContentGate'
import { PageIntro } from '@/components/PageIntro'
import { ContactForm } from '@/features/contact/ContactForm'
import { usePageMeta } from '@/hooks/usePageMeta'
import { contactFormEnabled } from '@/services/contact'
import type { SiteContent } from '@/types/content'

function Contact({ content }: { content: SiteContent }) {
  const { profile, socialLinks } = content
  return (
    <>
      <PageIntro title="Contact">Open to job opportunities and collaboration.</PageIntro>
      <div className="page-x grid gap-14 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
        <section aria-labelledby="direct" className="lg:col-span-5">
          <h2 id="direct" className="display text-[clamp(1.75rem,2.6vw,2.5rem)] text-muted">Reach me directly</h2>
          {profile.contactEmail && (
            <a href={`mailto:${profile.contactEmail}`} className="mt-5 block break-all font-mono text-lg underline decoration-accent decoration-2 underline-offset-4 hover:text-accent">{profile.contactEmail}</a>
          )}
          <ul className="mt-4 space-y-2">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <a href={link.url} target="_blank" rel="noreferrer" className="inline-block min-h-11 py-2 underline underline-offset-4 hover:text-accent">{link.label}</a>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="message" className="relative lg:col-span-6 lg:col-start-7">
          <h2 id="message" className="display mb-6 text-[clamp(1.75rem,2.6vw,2.5rem)] text-muted">Send a message</h2>
          {contactFormEnabled ? <ContactForm /> : (
            <p className="max-w-[52ch] border border-dashed border-line-strong p-5 text-muted">
              The contact form isn’t available yet. Use the email address on this page.
            </p>
          )}
        </section>
      </div>
    </>
  )
}

export function ContactPage() {
  usePageMeta('Contact', 'Contact Aden Lutfil Irsyadi about job opportunities and collaboration.')
  return <ContentGate>{(content) => <Contact content={content} />}</ContentGate>
}
