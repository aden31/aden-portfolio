import { useEffect, useRef } from 'react'

/** Soft moving light behind the hero, with a dot grid that brightens around the pointer. */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    const parent = node?.parentElement
    if (!node || !parent) return
    const onMove = (event: PointerEvent) => {
      const box = parent.getBoundingClientRect()
      node.style.setProperty('--spot-x', `${event.clientX - box.left}px`)
      node.style.setProperty('--spot-y', `${event.clientY - box.top}px`)
    }
    parent.addEventListener('pointermove', onMove)
    return () => parent.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="hero-backdrop pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span className="hero-glow hero-glow-a" />
      <span className="hero-glow hero-glow-b" />
      <span className="hero-dots" />
      <span className="hero-dots hero-dots-spot" />
    </div>
  )
}
