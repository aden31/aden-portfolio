import { MotionConfig } from 'motion/react'
import { Link, Outlet } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'

export function PublicLayout() {
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
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
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
