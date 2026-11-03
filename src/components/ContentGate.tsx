import type { ReactNode } from 'react'
import { useSiteContent } from '@/hooks/useSiteContent'
import type { SiteContent } from '@/types/content'

export function ContentGate({ children }: { children: (content: SiteContent) => ReactNode }) {
  const { state, retry } = useSiteContent()

  if (state.status === 'loading') {
    return <div role="status" className="page-x min-h-[80vh] py-20 text-muted">Loading</div>
  }
  if (state.status === 'error') {
    return (
      <div role="alert" className="page-x min-h-[80vh] py-20">
        <h1 className="display text-6xl">This page didn’t load</h1>
        <p className="mt-4 max-w-[52ch] text-muted">{state.message}</p>
        <button type="button" onClick={retry} className="mt-6 min-h-12 bg-accent px-6 py-3 font-medium text-ink">Try again</button>
      </div>
    )
  }
  return (
    <>
      {state.content.isSample && (
        <p role="note" className="page-x relative z-10 border-b border-dashed border-line-strong py-2.5 text-sm text-muted">
          Preview content. Items tagged “needs verification” stay hidden on the live site until they are confirmed in the CMS.
        </p>
      )}
      {children(state.content)}
    </>
  )
}
