import { useCallback, useEffect, useState } from 'react'
import { getSiteContent } from '@/services/site'
import type { SiteContent } from '@/types/content'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; content: SiteContent }

let cache: Promise<SiteContent> | null = null

function load() {
  cache ??= getSiteContent().catch((error: unknown) => {
    cache = null
    throw error
  })
  return cache
}

export function resetSiteContentCache() {
  cache = null
}

/** One request serves every public page during a visit. */
export function useSiteContent() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    load()
      .then((content) => active && setState({ status: 'ready', content }))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'The content could not be loaded.'
        if (active) setState({ status: 'error', message })
      })
    return () => {
      active = false
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((value) => value + 1)
  }, [])

  return { state, retry }
}
