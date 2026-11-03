import { useEffect, useState, type RefObject } from 'react'

const CORNER = 18

type Point = { x: number; y: number }

/** Joins orthogonal points into one SVG path with rounded corners. */
export function roundedPath(points: Point[], radius = CORNER): string {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length - 1; i += 1) {
    const [prev, at, next] = [points[i - 1], points[i], points[i + 1]]
    const r = Math.min(
      radius,
      (Math.abs(at.x - prev.x) + Math.abs(at.y - prev.y)) / 2,
      (Math.abs(next.x - at.x) + Math.abs(next.y - at.y)) / 2,
    )
    const inX = at.x - Math.sign(at.x - prev.x) * r
    const inY = at.y - Math.sign(at.y - prev.y) * r
    const outX = at.x + Math.sign(next.x - at.x) * r
    const outY = at.y + Math.sign(next.y - at.y) * r
    d += ` L ${inX} ${inY} Q ${at.x} ${at.y} ${outX} ${outY}`
  }
  const last = points[points.length - 1]
  return `${d} L ${last.x} ${last.y}`
}

function center(el: Element, origin: DOMRect): Point {
  const box = el.getBoundingClientRect()
  return { x: box.left + box.width / 2 - origin.left, y: box.top + box.height / 2 - origin.top }
}

/**
 * Routes the trace through the page: along the hero pipeline, then back and forth across the
 * gutters at each [data-trace-rule], ending at [data-trace-end].
 */
export function buildTracePoints(host: HTMLElement): { points: Point[]; width: number; height: number } {
  const origin = host.getBoundingClientRect()
  const gutter = parseFloat(getComputedStyle(host).getPropertyValue('--trace-inset')) || 10
  const left = gutter
  const right = origin.width - gutter

  const stages = [...host.querySelectorAll('[data-trace-stage]')].map((el) => center(el, origin))
  const rules = [...host.querySelectorAll('[data-trace-rule]')].map((el) => center(el, origin).y)
  const endEl = host.querySelector('[data-trace-end]')
  const points: Point[] = stages.length >= 2 ? [stages[0], stages[stages.length - 1]] : []
  if (!points.length) return { points, width: origin.width, height: origin.height }

  let x = points[points.length - 1].x
  rules.forEach((y, index) => {
    points.push({ x, y })
    x = index % 2 === 0 ? left : right
    points.push({ x, y })
  })
  const endRow = host.querySelector('[data-trace-end-row]')
  if (endEl && endRow) {
    // Come up into the button from below, so the line never crosses its neighbours.
    const end = center(endEl, origin)
    const buttonBottom = endEl.getBoundingClientRect().bottom - origin.top
    const below = endRow.getBoundingClientRect().bottom - origin.top + 28
    points.push({ x, y: below }, { x: end.x, y: below }, { x: end.x, y: buttonBottom })
  }
  return { points, width: origin.width, height: origin.height }
}

export function useTracePath(hostRef: RefObject<HTMLElement | null>) {
  const [geometry, setGeometry] = useState({ d: '', width: 0, height: 0 })

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const { points, width, height } = buildTracePoints(host)
        setGeometry((current) => {
          const d = roundedPath(points)
          return current.d === d && current.height === height ? current : { d, width, height }
        })
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(host)
    document.fonts?.ready.then(measure)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [hostRef])

  return geometry
}
