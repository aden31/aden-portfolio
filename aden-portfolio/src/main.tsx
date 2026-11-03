import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { isPreviewFile } from '@/lib/env'
import { AppRoutes } from '@/routes/AppRoutes'
import '@fontsource-variable/big-shoulders-display'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@/styles/index.css'

// A single-file preview has no server to resolve paths, so it routes through the hash.
const Router = isPreviewFile ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </StrictMode>,
)
