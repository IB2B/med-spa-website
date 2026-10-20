"use client"

import { useEffect, useRef, useState } from "react"

// The header row every section starts with: accent diamond + label on the start side, a tag on
// the end side, thin line on top (same as the testimonials and pain points). `tone="dark"` for black bands.
export function SectionHeader({ label, tag, tone = "light" }: { label: string; tag: string; tone?: "light" | "dark" }) {
  const colors = tone === "dark" ? "border-neutral-800 text-neutral-400" : "border-neutral-200 text-neutral-600"
  return (
    <div className={`flex items-center justify-between gap-4 border-t pt-5 font-mono text-xs tracking-wide uppercase ${colors}`}>
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="size-2 rotate-45 bg-accent" />
        {label}
      </span>
      <span className="text-end">{tag}</span>
    </div>
  )
}

// True once the element has scrolled into view (then stays true). Drives the staggered fade-ups.
export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

/** Class for an item that fades up once its list is in view (shown at once with reduced motion). */
export function fadeUp(inView: boolean) {
  return inView ? "animate-fade-up motion-reduce:animate-none" : "opacity-0 motion-reduce:opacity-100"
}
