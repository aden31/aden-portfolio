import { Link } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'

export function NotFound() {
  usePageMeta('Page not found')
  return (
    <div className="page-x min-h-[70vh] py-20">
      <h1 className="display text-[clamp(3.5rem,10vw,9rem)]">Page not found</h1>
      <p className="mt-6 max-w-[52ch] text-muted">This address doesn’t match any page on the site.</p>
      <Link to="/" className="mt-6 inline-block underline decoration-lime decoration-2 underline-offset-4">Back to home</Link>
    </div>
  )
}
