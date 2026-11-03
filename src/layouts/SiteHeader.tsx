import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/projects', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="page-x sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)} className="display text-2xl tracking-wide">
          Aden Lutfil Irsyadi
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative py-2 text-[0.9375rem] transition-colors hover:text-paper ${isActive ? 'text-paper' : 'text-muted'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && <motion.span layoutId="nav-indicator" className="absolute inset-x-0 -bottom-px h-0.5 bg-lime" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="-mr-3 flex size-12 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="page-x fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ink pb-10 pt-6 lg:hidden"
          >
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.to} className="border-b border-line">
                  <NavLink to={item.to} onClick={() => setOpen(false)} className="display block py-4 text-5xl">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
