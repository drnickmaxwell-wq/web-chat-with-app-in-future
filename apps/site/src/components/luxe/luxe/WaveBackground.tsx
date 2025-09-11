'use client'

import { useEffect, useRef } from 'react'

export default function WaveBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return // no animation if user prefers less motion

    // lazy-load the tiny renderer the ZIP shipped with
    (async () => {
      const { initWaves } = await import('./waves-runtime') // from the ZIP
      if (ref.current) initWaves(ref.current)
    })()
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={ref} className="h-full w-full" />
    </div>
  )
}
