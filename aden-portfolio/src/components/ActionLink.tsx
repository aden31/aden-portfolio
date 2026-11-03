import { useRef, type PointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { Link } from 'react-router-dom'

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 font-medium transition-colors duration-200'

export const actionStyles = {
  primary: `${base} bg-accent text-ink hover:bg-paper`,
  secondary: `${base} border border-line-strong bg-ink text-paper hover:border-paper`,
}

type Props = {
  to: string
  variant?: keyof typeof actionStyles
  external?: boolean
  download?: boolean
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  children: ReactNode
}

const MotionLink = motion.create(Link)

/** Link styled as a button. The primary variant leans gently toward a mouse pointer. */
export function ActionLink({ to, variant = 'primary', external, download, onClick, children }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduced = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 })
  const magnetic = variant === 'primary' && !reduced

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!magnetic || event.pointerType !== 'mouse' || !ref.current) return
    const box = ref.current.getBoundingClientRect()
    x.set((event.clientX - box.left - box.width / 2) * 0.16)
    y.set((event.clientY - box.top - box.height / 2) * 0.28)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const shared = {
    className: actionStyles[variant],
    style: magnetic ? { x, y } : undefined,
    onPointerMove,
    onPointerLeave: reset,
    onClick,
  }

  if (external || download || to.startsWith('#')) {
    return (
      <motion.a
        ref={ref}
        href={to}
        download={download || undefined}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...shared}
      >
        {children}
      </motion.a>
    )
  }
  return (
    <MotionLink ref={ref} to={to} {...shared}>
      {children}
    </MotionLink>
  )
}
