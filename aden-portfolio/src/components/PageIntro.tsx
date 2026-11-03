import type { ReactNode } from 'react'

export function PageIntro({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="page-x border-b border-line pb-12 pt-14 lg:pb-16 lg:pt-20">
      <h1 className="display text-[clamp(4rem,12vw,11rem)]">{title}</h1>
      {children && <div className="mt-6 max-w-[60ch] text-lg text-muted">{children}</div>}
    </header>
  )
}

/** Label on the left, content on the right. Stacks on small screens. */
export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-3 border-b border-line py-10 last:border-b-0 lg:grid-cols-12 lg:gap-8">
      <h2 className="meta text-paper lg:col-span-3">{label}</h2>
      <div className="lg:col-span-8">{children}</div>
    </section>
  )
}
