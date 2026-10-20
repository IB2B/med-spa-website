"use client"

import type { CSSProperties, ReactNode } from "react"

import { useInView } from "@/components/landing/section-header"

// A grey headline keyword (hero and testimonials). It rests in grey; once it has scrolled into view a
// band of accent and ink sweeps through it every 5 seconds. Styles live in globals.css (.keyword).
// No movement with reduced motion. `delay` (ms) offsets several keywords so they take turns.
export function Keyword({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.6)

  return (
    <span
      ref={ref}
      data-on={inView || undefined}
      className="keyword"
      style={{ "--kw-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </span>
  )
}
