import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sampleContent } from '@/data/sample'
import { filterProjects } from '@/features/projects/filter'
import { roundedPath } from '@/hooks/useTracePath'
import { resetSiteContentCache } from '@/hooks/useSiteContent'
import { AppRoutes } from '@/routes/AppRoutes'
import { getSiteContent } from '@/services/site'
import type { SiteContent } from '@/types/content'

vi.mock('@/services/site', () => ({ getSiteContent: vi.fn() }))
const load = vi.mocked(getSiteContent)

beforeEach(() => {
  load.mockReset()
  resetSiteContentCache()
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
  vi.stubGlobal('scrollTo', () => {})
})

const open = (path = '/') => render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>)

const live: SiteContent = {
  ...sampleContent, isSample: false, projects: [], expertise: [], achievements: [],
  certificates: [], experiences: [], education: [], skillGroups: [], socialLinks: [],
}

describe('home', () => {
  it('reads the headline with spaces and marks preview content', async () => {
    load.mockResolvedValue(sampleContent)
    open()
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Building digital solutions that matter.')
    expect(screen.getByRole('note')).toHaveTextContent('Preview content')
    expect(screen.getByRole('img', { name: /Portrait of Aden/ })).toBeInTheDocument()
  })

  it('hides the notice and sections with nothing published', async () => {
    load.mockResolvedValue(live)
    open()
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('note')).not.toBeInTheDocument()
    for (const name of ['Selected work', 'Achievements', 'Education and experience']) {
      expect(screen.queryByRole('heading', { name })).not.toBeInTheDocument()
    }
  })

  it('shows Download CV only when a CV exists', async () => {
    load.mockResolvedValue(sampleContent)
    const first = open()
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('link', { name: 'Download CV' })).not.toBeInTheDocument()
    first.unmount()
    resetSiteContentCache()
    load.mockResolvedValue({ ...live, profile: { ...live.profile, cvUrl: 'https://cdn.test/cv.pdf' } })
    open()
    const hero = (await screen.findByRole('heading', { level: 1 })).closest('section')!
    expect(within(hero).getByRole('link', { name: 'Download CV' })).toHaveAttribute('download')
  })

  it('explains a failed load and retries', async () => {
    load.mockRejectedValueOnce(new Error('Network down')).mockResolvedValueOnce(sampleContent)
    open()
    expect(await screen.findByRole('alert')).toHaveTextContent('Network down')
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('public pages', () => {
  it.each([
    ['/about', 'About'], ['/projects', 'Projects'], ['/experience', 'Experience'],
    ['/achievements', 'Achievements'], ['/skills', 'Skills'], ['/contact', 'Contact'],
  ])('%s renders', async (path, name) => {
    load.mockResolvedValue(sampleContent)
    open(path)
    expect(await screen.findByRole('heading', { level: 1, name })).toBeInTheDocument()
  })

  it('shows only the fields a project has', async () => {
    load.mockResolvedValue(sampleContent)
    open('/projects/simanis')
    expect(await screen.findByRole('heading', { level: 1, name: 'SIMANIS' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'My role' })).toBeInTheDocument()
    for (const name of ['Problem', 'Verified results', 'Screenshots']) {
      expect(screen.queryByRole('heading', { name })).not.toBeInTheDocument()
    }
  })

  it('links related projects from the same category', async () => {
    load.mockResolvedValue(sampleContent)
    open('/projects/simanis')
    expect(await screen.findByRole('link', { name: 'Public satisfaction survey system' })).toBeInTheDocument()
  })

  it('shows not found for an unpublished or unknown project', async () => {
    load.mockResolvedValue(sampleContent)
    open('/projects/nope')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('shows not found for unknown paths', async () => {
    open('/nope')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('filters achievements and keeps training separate from licenses', async () => {
    load.mockResolvedValue(sampleContent)
    open('/achievements')
    await screen.findByRole('heading', { level: 1, name: 'Achievements' })
    expect(screen.getByText(/not a professional license/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Academic' }))
    expect(screen.getByRole('heading', { name: 'Graduated with honors' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Gold Medal/ })).not.toBeInTheDocument()
  })

  it('never offers a fake form without a backend', async () => {
    load.mockResolvedValue(sampleContent)
    open('/contact')
    expect(await screen.findByText(/isn’t available yet/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'adenlutfil@gmail.com' })).toHaveAttribute('href', 'mailto:adenlutfil@gmail.com')
  })
})

describe('filterProjects', () => {
  const base = { query: '', category: '', technology: '', status: '', sort: 'curated' as const }
  const { projects } = sampleContent

  it('searches text and technology', () => {
    expect(filterProjects(projects, { ...base, query: 'codeigniter' }).map((p) => p.slug)).toEqual(['simanis'])
  })

  it('combines filters', () => {
    expect(filterProjects(projects, { ...base, category: 'Web Applications', technology: 'n8n' })).toEqual([])
  })

  it('sorts by year and title, keeping undated projects last', () => {
    const newest = filterProjects(projects, { ...base, sort: 'newest' })
    expect(newest[0].year).toBe(2026)
    expect(newest[newest.length - 1].year).toBeNull()
    expect(filterProjects(projects, { ...base, sort: 'title' })[0].title).toBe('AI automation for personalized remedial learning')
  })
})

describe('roundedPath', () => {
  it('joins points and rounds the corner', () => {
    expect(roundedPath([{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }], 10)).toBe('M 0 0 L 90 0 Q 100 0 100 10 L 100 100')
  })
})
