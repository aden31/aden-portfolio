import { Component, type ReactNode } from 'react'

/** Replaces a blank screen with a way forward if a page crashes while rendering. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" className="page-x min-h-screen py-20">
        <h1 className="display text-6xl">Something broke on this page</h1>
        <p className="mt-4 max-w-[52ch] text-muted">Reload to try again. If it keeps happening, the rest of the site may still work.</p>
        <button type="button" onClick={() => window.location.assign('/')} className="mt-6 min-h-12 bg-accent px-6 py-3 font-medium text-ink">Go to home</button>
      </div>
    )
  }
}
