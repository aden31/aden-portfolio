import { useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useLocation } from 'react-router-dom'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent" style={{ scaleX }} />
}

/** A panel that wipes away to show the new page. Skipped on first load. */
export function PageCurtain() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const [firstPath, setFirstPath] = useState<string | null>(pathname)

  if (firstPath !== null && pathname !== firstPath) setFirstPath(null)
  if (reduced || firstPath !== null) return null

  return (
    <motion.div
      key={pathname}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-45 origin-top bg-surface"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
    />
  )
}
