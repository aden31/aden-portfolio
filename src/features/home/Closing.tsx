import { ActionLink } from '@/components/ActionLink'
import { RevealText } from '@/components/motion/Reveal'
import type { Profile, SocialLink } from '@/types/content'

export function Closing({ profile, socialLinks }: { profile: Profile; socialLinks: SocialLink[] }) {
  const linkedIn = socialLinks.find((link) => link.platform === 'linkedin')
  return (
    <section aria-labelledby="closing-title" className="page-x relative z-10 py-24 lg:py-36">
      <RevealText id="closing-title" text={profile.closingHeadline} className="display max-w-[16ch] text-[clamp(4rem,11vw,11rem)]" />
      <p className="mt-8 max-w-[52ch] text-lg text-muted">{profile.closingBody}</p>
      <div data-trace-end-row className="mt-8 flex flex-wrap items-center gap-3">
        <span data-trace-end>
          <ActionLink to="/contact">Get in touch</ActionLink>
        </span>
        <ActionLink to="/projects" variant="secondary">See all projects</ActionLink>
        {profile.cvUrl && <ActionLink to={profile.cvUrl} variant="secondary" download>{profile.ctaCvLabel}</ActionLink>}
        {linkedIn && <ActionLink to={linkedIn.url} variant="secondary" external>{linkedIn.label}</ActionLink>}
      </div>
      {profile.contactEmail && (
        <p className="relative z-10 mt-16 lg:mt-20">
          <a href={`mailto:${profile.contactEmail}`} className="font-mono text-[0.9375rem] text-muted hover:text-paper">{profile.contactEmail}</a>
        </p>
      )}
    </section>
  )
}
