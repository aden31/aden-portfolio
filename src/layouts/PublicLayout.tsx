import { motion, MotionConfig } from 'motion/react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { PageCurtain, ScrollProgress } from '@/components/motion/PageChrome'
import { SiteHeader } from './SiteHeader'

export function PublicLayout() {
  const { pathname } = useLocation()
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('main')?.focus()
        }}
        className="fixed left-4 top-[-4rem] z-50 bg-accent px-4 py-3 text-ink focus:top-4"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <PageCurtain />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Outlet />
        </motion.div>
      </main>
      <footer className="page-x flex flex-col gap-2 border-t border-line py-8 sm:flex-row sm:justify-between">
        <p className="meta">© {new Date().getFullYear()} Aden Lutfil Irsyadi</p>
        <Link to="/contact" className="meta underline-offset-4 hover:text-paper hover:underline">
          Contact
        </Link>
      </footer>
    </MotionConfig>
  )
}
