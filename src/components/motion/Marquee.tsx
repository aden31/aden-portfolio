/** A band of words that runs across the page and pauses on hover. */
export function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <li key={item} className="display flex items-center gap-10 whitespace-nowrap text-[clamp(2rem,4vw,3.5rem)] text-muted">
          {item}
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="marquee relative z-10 flex overflow-hidden py-6">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
