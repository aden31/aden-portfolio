import { useEffect, useRef, type RefObject } from 'react'
import { useMotionValue, useReducedMotion, useSpring, motion } from 'motion/react'
import { useTracePath } from '@/hooks/useTracePath'

const SAMPLE_STEP = 24
const HEAD_POSITION = 0.82

/** The lime line that runs down the page. It draws to follow scrolling; without motion it is simply complete. */
export function Trace({ hostRef }: { hostRef: RefObject<HTMLElement | null> }) {
  const { d, width, height } = useTracePath(hostRef)
  const pathRef = useRef<SVGPathElement>(null)
  const reduced = useReducedMotion()
  const offset = useMotionValue(1)
  const smooth = useSpring(offset, { stiffness: 70, damping: 22, mass: 0.6 })

  useEffect(() => {
    const path = pathRef.current
    if (!path || !d || reduced || typeof path.getTotalLength !== 'function') return
    const total = path.getTotalLength()
    if (!total) return

    // Largest length reached at each height, so the head can be found without searching the path.
    const reachedAt: { y: number; length: number }[] = []
    let deepest = -Infinity
    for (let length = 0; length <= total; length += SAMPLE_STEP) {
      const { y } = path.getPointAtLength(length)
      if (y >= deepest) {
        deepest = y
        reachedAt.push({ y, length })
      } else {
        reachedAt[reachedAt.length - 1].length = length
      }
    }

    const update = () => {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight
      const atBottom = window.scrollY >= scrollMax - 2
      const head = window.scrollY + window.innerHeight * HEAD_POSITION
      let reached = 0
      for (const sample of reachedAt) {
        if (sample.y > head) break
        reached = sample.length
      }
      offset.set(atBottom ? 0 : 1 - reached / total)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [d, reduced, offset])

  if (!d) return null

  return (
    <svg
      aria-hidden="true"
      data-testid="trace"
      className="pointer-events-none absolute left-0 top-0 z-0"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <path d={d} stroke="var(--color-line)" strokeWidth="1" />
      <motion.path
        ref={pathRef}
        d={d}
        stroke="var(--color-lime)"
        strokeWidth="1.5"
        pathLength={1}
        strokeDasharray="1 1"
        style={{ strokeDashoffset: reduced ? 0 : smooth }}
      />
    </svg>
  )
}
