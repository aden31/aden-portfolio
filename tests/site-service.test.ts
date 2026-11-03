import type { SupabaseClient } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'
import { sampleContent } from '@/data/sample'
import { fetchSiteContent, formatExperiencePeriod, toPublishable } from '@/services/site'

const BASE = 'https://demo.supabase.co'

const ROWS: Record<string, unknown> = {
  profiles: {
    full_name: 'Aden', headline: 'H', subheadline: 'S', status_label: 'L', about_statement: 'A', about_points: ['p'],
    about_body: '', soft_skills: [], contact_email: 'a@b.c', cta_primary_label: 'Go', cta_cv_label: 'CV',
    closing_headline: 'C', closing_body: 'B',
    portrait: { bucket: 'public-media', path: 'me photo.jpg', alt_text: 'Aden' },
    cv: { bucket: 'private-media', path: 'cv.pdf', alt_text: '' },
  },
  social_links: [],
  site_settings: { value: [{ id: 'need', label: 'Need', detail: 'd' }] },
  projects: [{
    slug: 'p', title: 'P', summary: '', context: '', problem: '', goals: '', solution: '', role: '', key_features: [],
    flow_steps: [], challenges: '', verified_outcomes: '', project_status: null, year: 2025, demo_url: null, repo_url: null,
    is_featured: true, cover: null, category: { name: 'Web' },
    project_technologies: [{ sort_order: 1, technologies: { name: 'B' } }, { sort_order: 0, technologies: { name: 'A' } }],
    project_images: [
      { caption: 'hidden', sort_order: 0, media: { bucket: 'private-media', path: 'x.png', alt_text: '' } },
      { caption: 'shown', sort_order: 1, media: { bucket: 'public-media', path: 'y.png', alt_text: 'y' } },
    ],
  }],
  expertise_areas: [],
  achievements: [{
    id: 'a', title: 'T', description: '', category: 'competition', organizer: null, achieved_year: 2025,
    event_period: null, credential_id: null, highlight_value: null, highlight_label: null, is_featured: false,
    source_url: null, proof: null,
  }],
  certificates: [{
    id: 'c', title: 'C', issuer: 'I', program: null, training_period: null, training_hours: '24.0',
    credential_id: null, credential_url: null, media: null,
  }],
  education: [{
    id: 'e', institution: 'U', faculty: null, program: 'TI', start_year: 2022, end_year: 2026,
    gpa: '3.72', gpa_scale: '4.00', honors: 'Cumlaude', description: '',
  }],
  experiences: [],
  skills: [
    { name: 'SQL', usage_description: '', evidence: 'applied', category: { name: 'Database', sort_order: 3 } },
    { name: 'PHP', usage_description: '', evidence: 'applied', category: { name: 'Languages', sort_order: 0 } },
  ],
}

function fakeClient(errors: Record<string, string> = {}) {
  const from = (table: string) => {
    const result = { data: errors[table] ? null : ROWS[table], error: errors[table] ? { message: errors[table] } : null }
    const query: Record<string, unknown> = { then: (done: (r: unknown) => unknown) => done(result) }
    for (const method of ['select', 'eq', 'order', 'limit', 'single', 'maybeSingle']) query[method] = () => query
    return query
  }
  return { from } as unknown as SupabaseClient
}

describe('fetchSiteContent', () => {
  it('maps rows and builds storage URLs', async () => {
    const content = await fetchSiteContent(fakeClient(), BASE)
    expect(content.isSample).toBe(false)
    expect(content.profile.portrait?.url).toBe(`${BASE}/storage/v1/object/public/public-media/me%20photo.jpg`)
    expect(content.projects[0].technologies).toEqual(['A', 'B'])
    expect(content.education[0].gpa).toBe('3.72/4.00')
    expect(content.certificates[0].hours).toBe(24)
    expect(content.achievements[0].period).toBe('2025')
  })

  it('never builds a public URL for a private file', async () => {
    const content = await fetchSiteContent(fakeClient(), BASE)
    expect(content.profile.cvUrl).toBeNull()
    expect(content.projects[0].gallery.map((image) => image.caption)).toEqual(['shown'])
  })

  it('groups skills in category order', async () => {
    const content = await fetchSiteContent(fakeClient(), BASE)
    expect(content.skillGroups.map((group) => group.name)).toEqual(['Languages', 'Database'])
  })

  it('reports query errors', async () => {
    await expect(fetchSiteContent(fakeClient({ projects: 'denied' }), BASE)).rejects.toThrow('denied')
  })
})

describe('toPublishable', () => {
  it('drops unconfirmed items and the preview notice', () => {
    const content = toPublishable(sampleContent)
    expect(content.isSample).toBe(false)
    expect(JSON.stringify(content)).not.toContain('"needsVerification":true')
    expect(content.skillGroups.flatMap((group) => group.skills.map((skill) => skill.name))).not.toContain('React')
    expect(content.projects).toHaveLength(sampleContent.projects.length)
  })
})

describe('formatExperiencePeriod', () => {
  const row = { start_date: null, end_date: null, period_label: null, is_current: false }

  it('never invents dates', () => {
    expect(formatExperiencePeriod(row)).toBeNull()
  })

  it('prefers a stated period and formats ranges', () => {
    expect(formatExperiencePeriod({ ...row, period_label: '2025' })).toBe('2025')
    expect(formatExperiencePeriod({ ...row, start_date: '2025-09-01', end_date: '2025-12-31' })).toBe('Sep 2025 – Dec 2025')
    expect(formatExperiencePeriod({ ...row, start_date: '2024-04-01', is_current: true })).toBe('Apr 2024 – present')
  })
})
