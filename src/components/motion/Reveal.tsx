import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1] as const
const VIEWPORT = { once: true, margin: '0px 0px -8% 0px' }

const HEADINGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p }
const STAGGER = { hidden: {}, shown: { transition: { staggerChildren: 0.05 } } }

const TAGS = { div: motion.div, li: motion.li, section: motion.section }

type RevealProps = {
  as?: keyof typeof TAGS
  delay?: number
  className?: string
  children: ReactNode
}

/** Slides content up once as it enters the screen. */
export function Reveal({ as = 'div', delay = 0, className, children }: RevealProps) {
  const Tag = TAGS[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

type RevealTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  id?: string
  className?: string
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean
}

/** Headline whose words rise out of a mask, one after another. */
export function RevealText({ text, as: Tag = 'h2', id, className, immediate }: RevealTextProps) {
  const trigger = immediate ? { animate: 'shown' } : { whileInView: 'shown', viewport: VIEWPORT }
  const MotionTag = HEADINGS[Tag]
  return (
    <MotionTag id={id} className={className} initial="hidden" {...trigger} variants={STAGGER}>
      {text.split(/\s+/).map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden pb-[0.06em] align-top">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: '110%' }, shown: { y: 0 } }}
              transition={{ duration: 0.75, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>{' '}
        </span>
      ))}
    </MotionTag>
  )
}

function ScrollWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total
  const opacity = useTransform(progress, [start, start + 1.5 / total], [0.22, 1])
  return <motion.span style={{ opacity }}>{word} </motion.span>
}

/** Text that lights up word by word as it scrolls past. */
export function ScrollWords({ text, id, className }: { text: string; id?: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(/\s+/)
  return (
    <h2 ref={ref} id={id} className={className}>
      {reduced ? text : words.map((word, index) => (
        <ScrollWord key={`${word}-${index}`} word={word} index={index} total={words.length} progress={scrollYProgress} />
      ))}
    </h2>
  )
}

/** Counts up to a number once. Anything that isn't a number shows as written. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  const target = Number(value)
  const [shown, setShown] = useState<string | null>(null)
  const decimals = value.split('.')[1]?.length ?? 0

  useEffect(() => {
    if (!inView || reduced || Number.isNaN(target)) return
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (latest) => setShown(latest.toFixed(decimals)),
      onComplete: () => setShown(null),
    })
    return () => controls.stop()
  }, [inView, reduced, target, decimals])

  return <span ref={ref}>{shown ?? value}</span>
}

/** Vertical line that fills as a timeline scrolls past. */
export function ScrollLine() {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] })
  return (
    <span ref={ref} aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-line-strong">
      <motion.span className="absolute inset-0 origin-top bg-accent" style={{ scaleY: reduced ? 1 : scrollYProgress }} />
    </span>
  )
}
