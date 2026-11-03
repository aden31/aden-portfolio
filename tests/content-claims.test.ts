import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { sampleContent } from '@/data/sample'

/** Guards the wording checked against the certificates. See docs/content-sources.md. */
const seed = readFileSync('supabase/seed.sql', 'utf8')
const sample = JSON.stringify(sampleContent)

describe.each([['seed', seed], ['sample', sample]])('%s content', (_, text) => {
  it('uses the certificate wording for awards', () => {
    expect(text).not.toMatch(/juara|first place|second place/i)
    expect(text).toContain('Gold Medal, International Student Summit')
    expect(text).toContain('Silver Medal, International Future Leaders Competition')
    expect(text).toContain('3rd Winner, International Student Summit')
  })

  it('dates the silver medal 2026, as the certificate does', () => {
    expect(text).toContain('Yogyakarta, 2026')
    expect(text).not.toContain('Yogyakarta, 2025')
  })

  it('keeps private contact details and unproven claims out', () => {
    expect(text).not.toMatch(/082216080001|Baji Pamai|Tamparang/)
    expect(text).not.toMatch(/irsyadi@gmail|Siradjuddin/)
    expect(text).not.toMatch(/improved|increased|meningkatkan/i)
    expect(text).not.toMatch(/\d+\s?%/)
  })

  it('does not call training a certification', () => {
    expect(text).not.toMatch(/certified/i)
  })
})

it('lists the same projects in the seed and the preview', () => {
  for (const project of sampleContent.projects) expect(seed).toContain(`'${project.slug}'`)
})
