import { expect, test } from '@playwright/test'

const WIDTHS = [320, 390, 768, 900, 1440, 1920]
const PAGES = ['/', '/about', '/projects', '/projects/remedial-learning-automation', '/experience', '/achievements', '/skills', '/contact']

for (const width of WIDTHS) for (const path of PAGES) {
  test(`${path} has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto(path)
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.evaluate(() => document.fonts.ready)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBe(0)
    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll('h1, h2, h3')].filter((el) => el.scrollWidth > el.clientWidth + 1).length,
    )
    expect(clipped).toBe(0)
  })
}

test('shows the main call to action in the first screen on a laptop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Explore my work' })).toBeInViewport()
})

test('Explore my work moves to the work section', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Explore my work' }).click()
  await expect(page.getByRole('heading', { name: 'Selected work' })).toBeInViewport()
})

test('pipeline stages respond to keyboard', async ({ page }) => {
  await page.goto('/')
  const stage = page.getByRole('button', { name: 'Backend' })
  await stage.focus()
  await page.keyboard.press('Enter')
  await expect(stage).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByText('Implement the logic, the APIs, and the rules.')).toBeVisible()
})

test('offers LinkedIn, and no CV or GitHub until they are ready', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('heading', { level: 1 }).waitFor()
  await expect(page.getByRole('link', { name: 'Download CV' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /github/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'LinkedIn' }).first()).toHaveAttribute('href', /aden-lutfil-irsyadi/)
})

test('every internal link on the homepage resolves to a page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('heading', { level: 1 }).waitFor()
  const hrefs = await page.$$eval('a[href^="/"]', (links) => [...new Set(links.map((a) => a.getAttribute('href')!))])
  expect(hrefs.length).toBeGreaterThan(5)
  for (const href of hrefs) {
    await page.goto(href)
    await expect(page.getByRole('heading', { name: 'Page not found' })).toHaveCount(0)
  }
})

test('unknown addresses show the not-found page', async ({ page }) => {
  await page.goto('/nope')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
})

test('mobile menu opens, closes with Escape, and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const menu = page.getByRole('navigation', { name: 'Mobile' })
  await expect(menu).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await page.getByRole('button', { name: 'Open menu' }).click()
  await menu.getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(menu).toBeHidden()
})

test('touch targets in the hero meet the minimum size on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('heading', { level: 1 }).waitFor()
  const small = await page.$$eval('section button, section a[class*="min-h-12"], header button', (els) =>
    els.filter((el) => el.getBoundingClientRect().height < 44).length,
  )
  expect(small).toBe(0)
})

test('the skip link is the first focus stop and reaches the content', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeInViewport()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('shows all content and the finished trace straight away', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport()
    await page.locator('[data-testid=trace] path').nth(1).waitFor({ state: 'attached' })
    const offset = await page.$eval('[data-testid=trace] path:nth-child(2)', (el) => getComputedStyle(el).strokeDashoffset)
    expect(parseFloat(offset)).toBe(0)
    const box = await page.getByTestId('id-card').boundingBox()
    await page.mouse.move(box!.x + 40, box!.y + 40)
    await page.mouse.down()
    await page.mouse.move(box!.x - 100, box!.y + 100)
    await page.mouse.up()
    expect((await page.getByTestId('id-card').boundingBox())!.x).toBeCloseTo(box!.x, 0)
    const transform = await page.$eval('h1 span span', (el) => getComputedStyle(el).transform)
    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform)
  })
})

test('the trace draws further as the page scrolls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByRole('heading', { level: 1 }).waitFor()
  await page.waitForTimeout(1500)
  const read = () => page.$eval('[data-testid=trace] path:nth-child(2)', (el) => parseFloat(getComputedStyle(el).strokeDashoffset))
  const atTop = await read()
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(2500)
  expect(atTop).toBeGreaterThan(0.5)
  expect(await read()).toBeLessThan(0.01)
})

test('project filters narrow the list and survive a reload', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.getByRole('status').filter({ hasText: 'projects' })).toHaveText('12 of 12 projects')
  await page.getByLabel('Category').selectOption('Information Systems')
  await expect(page.getByRole('status').filter({ hasText: 'projects' })).toHaveText('2 of 12 projects')
  await page.reload()
  await expect(page.getByLabel('Category')).toHaveValue('Information Systems')
  await page.getByLabel('Search').fill('nothing-matches')
  await expect(page.getByText('No projects match these filters.')).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'projects' })).toHaveText('12 of 12 projects')
})

test('a project opens from the list, and the new page starts at the top', async ({ page }) => {
  await page.goto('/projects')
  await page.getByRole('link', { name: /SIMANIS/ }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'SIMANIS' })).toBeInViewport()
  await expect(page).toHaveTitle(/SIMANIS/)
})

test('a certificate opens in a dialog and closes with Escape', async ({ page }) => {
  await page.goto('/achievements')
  await page.getByRole('button', { name: /View certificate: Gold Medal/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('img')).toBeVisible()
  expect(await dialog.getByRole('img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('the ID card follows a drag and swings back on release', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const card = page.getByTestId('id-card')
  await card.waitFor()
  await page.waitForTimeout(3000)
  const start = (await card.boundingBox())!
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2)
  await page.mouse.down()
  await page.mouse.move(start.x - 150, start.y + 120, { steps: 8 })
  await page.waitForTimeout(800)
  const pulled = (await card.boundingBox())!
  expect(Math.abs(pulled.x - start.x)).toBeGreaterThan(80)
  await page.mouse.up()
  await page.waitForTimeout(5000)
  const settled = (await card.boundingBox())!
  expect(Math.abs(settled.x - start.x)).toBeLessThan(6)
})

test('scrolling moves the project gallery sideways on a desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const track = page.getByTestId('gallery-track')
  await track.waitFor()
  const start = (await track.boundingBox())!.x
  await track.evaluate((el) => {
    const section = el.closest('section')!
    window.scrollTo(0, section.offsetTop + section.offsetHeight * 0.4 + el.closest('section')!.getBoundingClientRect().top * 0)
  })
  await expect.poll(async () => (await track.boundingBox())!.x, { timeout: 5000 }).toBeLessThan(start - 100)
})

test('moving between pages keeps links usable during the transition', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('heading', { level: 1 }).waitFor()
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Skills' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Skills' })).toBeVisible()
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Contact' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible()
})
