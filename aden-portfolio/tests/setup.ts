import '@testing-library/jest-dom/vitest'

// jsdom has no matchMedia.
window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia
