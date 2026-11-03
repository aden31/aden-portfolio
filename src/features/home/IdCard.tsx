import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from 'motion/react'
import type { Profile } from '@/types/content'

const SPRING = { stiffness: 110, damping: 7, mass: 1 }
const MAX_PULL = 340
const MOBILE_STRAP = 88
const HEADER_HEIGHT = 64
const DROP_FROM = -420

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

/** The portrait as an ID card on a lanyard. Pull it and it swings back; without motion it simply hangs. */
export function IdCard({ profile }: { profile: Profile }) {
  const reduced = useReducedMotion()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const grab = useRef<{ x: number; y: number } | null>(null)
  const [strap, setStrap] = useState(MOBILE_STRAP)

  const targetX = useMotionValue(0)
  const targetY = useMotionValue(reduced ? 0 : DROP_FROM)
  const x = useSpring(targetX, SPRING)
  const y = useSpring(targetY, SPRING)
  const speed = useVelocity(x)
  const rotate = useTransform([x, speed], ([px, v]: number[]) => clamp(-px * 0.05 - v * 0.012, 22))
  const path = useTransform([x, y], ([px, py]: number[]) =>
    `M 0 ${-strap} Q ${px * 0.3} ${(py - strap) / 2} ${px} ${py + 12}`,
  )

  useEffect(() => {
    targetY.set(0)
  }, [targetY])

  useEffect(() => {
    const measure = () => {
      const top = wrapperRef.current?.getBoundingClientRect().top ?? 0
      const desktop = window.matchMedia('(min-width: 900px)').matches
      setStrap(desktop ? Math.max(40, top + window.scrollY - HEADER_HEIGHT + 8) : MOBILE_STRAP)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced) return
    event.currentTarget.setPointerCapture(event.pointerId)
    grab.current = { x: event.clientX - targetX.get(), y: event.clientY - targetY.get() }
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!grab.current) return
    targetX.set(clamp(event.clientX - grab.current.x, MAX_PULL))
    targetY.set(clamp(event.clientY - grab.current.y, MAX_PULL))
  }
  const release = () => {
    grab.current = null
    targetX.set(0)
    targetY.set(0)
  }

  return (
    <div
      ref={wrapperRef}
      style={{ marginTop: strap < 90 ? strap : undefined }}
      className="relative z-30 order-3 mx-auto w-[min(72%,19rem)] min-[900px]:float-right min-[900px]:mx-0 min-[900px]:ml-[3vw] min-[900px]:mt-1! min-[900px]:w-[min(21vw,21rem)]"
    >
      <svg aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 size-px overflow-visible">
        <motion.path d={path} fill="none" stroke="var(--color-surface)" strokeWidth="20" />
        <motion.path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="10 8" />
      </svg>
      <motion.div
        data-testid="id-card"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        style={{ x, y, rotate, transformOrigin: '50% 0%' }}
        className={`relative touch-none select-none rounded-2xl bg-paper p-3 pt-8 text-ink shadow-[0_24px_50px_rgb(6_18_40/0.45)] ${reduced ? '' : 'cursor-grab active:cursor-grabbing'}`}
      >
        <span aria-hidden="true" className="absolute left-1/2 top-3 h-2.5 w-14 -translate-x-1/2 rounded-full bg-ink/25" />
        {profile.portrait ? (
          <img
            src={profile.portrait.url}
            alt={profile.portrait.alt || `Portrait of ${profile.fullName}`}
            draggable={false}
            fetchPriority="high"
            className="aspect-[4/5] w-full rounded-lg object-cover object-top"
          />
        ) : (
          <div aria-hidden="true" className="aspect-[4/5] w-full rounded-lg bg-surface" />
        )}
        <p className="display mt-3 text-[clamp(1.5rem,2.1vw,2rem)] leading-none">{profile.fullName}</p>
        <p className="mt-1 mb-1 font-mono text-[0.75rem] leading-snug text-ink/75">{profile.statusLabel}</p>
      </motion.div>
    </div>
  )
}
