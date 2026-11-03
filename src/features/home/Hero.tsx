import { Fragment, useState } from 'react'
import { motion } from 'motion/react'
import { ActionLink } from '@/components/ActionLink'
import type { PipelineStage, Profile, SocialLink } from '@/types/content'

const EASE = [0.16, 1, 0.3, 1] as const

function Headline({ text }: { text: string }) {
  const words = text.split(/\s+/)
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden align-top">
            <motion.span
              className="inline-block"
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.06, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  )
}

function Portrait({ profile }: { profile: Profile }) {
  if (profile.portrait) {
    return (
      <img
        src={profile.portrait.url}
        alt={profile.portrait.alt || `Portrait of ${profile.fullName}`}
        className="aspect-[4/5] w-full object-cover object-top"
        fetchPriority="high"
      />
    )
  }
  return (
    <div aria-hidden="true" className="aspect-[4/5] w-full border border-line-strong bg-charcoal" />
  )
}

function Pipeline({ stages }: { stages: PipelineStage[] }) {
  const [activeId, setActiveId] = useState(stages[0]?.id)
  const active = stages.find((stage) => stage.id === activeId) ?? stages[0]
  if (!active) return null

  return (
    <div>
      <ul className="flex justify-between">
        {stages.map((stage) => {
          const selected = stage.id === active.id
          return (
            <li key={stage.id} className="flex flex-1 last:flex-none last:justify-end">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveId(stage.id)}
                onPointerEnter={(event) => event.pointerType === 'mouse' && setActiveId(stage.id)}
                className="group flex min-h-12 flex-col items-start gap-2 pr-2 text-left in-[li:last-child]:items-end in-[li:last-child]:pr-0 in-[li:last-child]:text-right"
              >
                <span
                  data-trace-stage
                  className={`relative z-10 size-3 rounded-full border transition-colors ${
                    selected ? 'border-lime bg-lime' : 'border-line-strong bg-ink group-hover:border-paper'
                  }`}
                />
                <span className={`meta transition-colors ${selected ? 'text-paper' : ''}`}>
                  <span className="hidden sm:inline">{stage.label}</span>
                  <span className="sm:hidden">{selected ? stage.label : <span className="sr-only">{stage.label}</span>}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p aria-live="polite" className="mt-2 max-w-[60ch] pr-8 text-muted">{active.detail}</p>
    </div>
  )
}

type Props = {
  profile: Profile
  socialLinks: SocialLink[]
  stages: PipelineStage[]
  onExplore: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

export function Hero({ profile, socialLinks, stages, onExplore }: Props) {
  return (
    <section aria-labelledby="hero-title" className="page-x relative pb-14 pt-8 lg:pt-10">
      <motion.p
        className="meta mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {profile.statusLabel}
      </motion.p>

      <div className="flex flex-col min-[900px]:block">
        <motion.div
          className="order-3 mt-10 w-3/5 min-[900px]:float-right min-[900px]:mt-1 min-[900px]:ml-[3vw] min-[900px]:w-[min(22vw,25rem)]"
          initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        >
          <Portrait profile={profile} />
        </motion.div>

        <h1 id="hero-title" className="display hero-title order-1">
          <Headline text={profile.headline} />
        </h1>

        <div className="order-2 mt-8 min-[900px]:clear-both min-[900px]:flex min-[900px]:items-end min-[900px]:justify-between min-[900px]:gap-12 min-[900px]:pt-8">
          <p className="max-w-[58ch] text-lg text-paper">{profile.subheadline}</p>
          <div className="mt-6 flex shrink-0 flex-wrap gap-3 min-[900px]:mt-0">
            <ActionLink to="#work" onClick={onExplore}>{profile.ctaPrimaryLabel}</ActionLink>
            {profile.cvUrl && (
              <ActionLink to={profile.cvUrl} variant="secondary" download>{profile.ctaCvLabel}</ActionLink>
            )}
            {socialLinks.map((link) => (
              <ActionLink key={link.platform} to={link.url} variant="secondary" external>{link.label}</ActionLink>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 min-[900px]:mt-10">
        <Pipeline stages={stages} />
      </div>
    </section>
  )
}
