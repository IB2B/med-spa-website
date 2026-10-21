"use client"

import { useEffect, useRef, useState } from "react"
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react"

const ring = "outline-none focus-visible:ring-4 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"

function clock(s: number) {
  if (!Number.isFinite(s)) return "0:00"
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`
}

// Hero video in the page's style: rounded frame, black "Play video" pill with the accent circle
// (like the CTA buttons) over the first frame. Once playing, a bottom bar with play/pause, an accent
// timeline you can drag, the time, sound and fullscreen. The bar hides after 2.5s without movement
// while playing; clicking the picture plays/pauses.
type PlayerUi = {
  start: string
  play: string
  pause: string
  mute: string
  unmute: string
  fullscreen: string
  exitFullscreen: string
  seek: string
  of: string
}

export function HeroVideo({ src, poster, label, ui }: { src: string; poster?: string; label: string; ui: PlayerUi }) {
  const frame = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const idle = useRef<number | undefined>(undefined)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [full, setFull] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === frame.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => {
      document.removeEventListener("fullscreenchange", onChange)
      window.clearTimeout(idle.current)
    }
  }, [])

  // Show the bar, then hide it again after a pause in movement (only while playing).
  const wake = () => {
    setActive(true)
    window.clearTimeout(idle.current)
    idle.current = window.setTimeout(() => {
      if (!video.current?.paused) setActive(false)
    }, 2500)
  }

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      setStarted(true)
      // Rejects if a pause comes in before it starts; nothing to do then.
      v.play().catch(() => {})
    } else v.pause()
    wake()
  }

  const seek = (value: number) => {
    const v = video.current
    if (!v) return
    v.currentTime = value
    setTime(value)
  }

  const toggleMute = () => {
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void frame.current?.requestFullscreen?.()
  }

  const progress = duration ? (time / duration) * 100 : 0
  const showBar = started && (active || !playing)

  return (
    <div
      ref={frame}
      onPointerMove={started ? wake : undefined}
      className={`relative size-full bg-neutral-950 ${playing && !active ? "cursor-none" : ""}`}
    >
      <video
        ref={video}
        // #t=0.1 makes Safari on iPhone show the first frame instead of a black box before play.
        src={poster ? src : `${src}#t=0.1`}
        poster={poster}
        aria-label={label}
        preload="metadata"
        playsInline
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setActive(true)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        className="absolute inset-0 size-full cursor-pointer object-cover"
      />

      {/* Start: one big pill in the middle, until the video has been played once. */}
      {!started && (
        <button
          type="button"
          onClick={toggle}
          className={`group/play absolute top-1/2 left-1/2 flex min-h-14 -translate-x-1/2 -translate-y-1/2 items-center gap-4 rounded-full bg-neutral-950 py-1.5 ps-6 pe-1.5 font-sans text-xs font-medium tracking-wide whitespace-nowrap text-white uppercase shadow-lg transition-colors hover:bg-neutral-800 ${ring}`}
        >
          {ui.start}
          {duration ? <span className="text-neutral-400 tabular-nums">{clock(duration)}</span> : null}
          <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-accent transition-colors group-hover/play:bg-accent-hover">
            <Play className="size-4 translate-x-px fill-current" />
          </span>
        </button>
      )}

      {/* Controls */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/80 to-transparent px-3 pt-12 pb-3 transition-opacity duration-300 motion-reduce:transition-none sm:px-5 sm:pb-5 ${
          showBar ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onFocus={wake}
      >
        <div className="flex items-center gap-3 rounded-full bg-neutral-950/70 py-1.5 ps-1.5 pe-3 text-white backdrop-blur sm:gap-4 sm:pe-4">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? ui.pause : ui.play}
            className={`grid size-9 shrink-0 place-items-center rounded-full bg-accent transition-colors hover:bg-accent-hover ${ring}`}
          >
            {playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 translate-x-px fill-current" />}
          </button>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label={ui.seek}
            aria-valuetext={`${clock(time)} ${ui.of} ${clock(duration)}`}
            style={{ background: `linear-gradient(to right, var(--accent) ${progress}%, rgb(255 255 255 / 0.25) ${progress}%)` }}
            className={`h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full rtl:rotate-180 [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white ${ring}`}
          />

          <span className="shrink-0 font-sans text-[0.6875rem] tracking-wide text-neutral-300 tabular-nums">
            {clock(time)}
            <span className="hidden sm:inline"> / {clock(duration)}</span>
          </span>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? ui.unmute : ui.mute}
            className={`grid size-8 shrink-0 place-items-center rounded-full text-neutral-300 transition-colors hover:text-white ${ring}`}
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <button
            type="button"
            onClick={toggleFull}
            aria-label={full ? ui.exitFullscreen : ui.fullscreen}
            className={`hidden size-8 shrink-0 place-items-center rounded-full text-neutral-300 transition-colors hover:text-white sm:grid ${ring}`}
          >
            {full ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
