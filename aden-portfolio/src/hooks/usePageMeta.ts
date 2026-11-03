import { useEffect } from 'react'

const SITE_NAME = 'Aden Lutfil Irsyadi'

export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Informatics Engineering Graduate`
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
