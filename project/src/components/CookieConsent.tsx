"use client"

import { useEffect, useState } from 'react'

/**
 * CookieConsent displays a banner asking the user to accept or reject optional
 * cookies. It stores preferences in localStorage so subsequent visits skip
 * the banner. Strictly necessary cookies are always enabled and cannot be
 * disabled from this banner.
 */
const CATEGORIES = ['necessary', 'functional', 'analytics', 'marketing'] as const

export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<Record<(typeof CATEGORIES)[number], boolean>>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // On mount, check if preferences have been set previously
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cookie-prefs') : null
    if (!saved) {
      setOpen(true)
    } else {
      try {
        setPrefs(JSON.parse(saved))
      } catch {
        setOpen(true)
      }
    }
  }, [])

  function save(next: typeof prefs) {
    localStorage.setItem('cookie-prefs', JSON.stringify(next))
    setPrefs(next)
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 w-[92vw] max-w-xl rounded-2xl border bg-white p-4 shadow-2xl">
      <h2 className="font-semibold text-lg">Cookie Preferences</h2>
      <p className="mt-1 text-sm text-foreground-secondary">
        We use cookies to improve your experience. Strictly necessary cookies are always on.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        {CATEGORIES.map((k) => (
          <label key={k} className="flex items-center gap-2">
            <input
              type="checkbox"
              disabled={k === 'necessary'}
              checked={!!prefs[k]}
              onChange={(e) => setPrefs((p) => ({ ...p, [k]: e.target.checked }))}
            />
            <span className="capitalize">{k}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2 text-sm">
        <button
          className="rounded-xl border px-3 py-2"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
        <button
          className="rounded-xl px-3 py-2"
          onClick={() => save({ ...prefs, functional: false, analytics: false, marketing: false })}
        >
          Reject non‑essential
        </button>
        <button
          className="rounded-xl bg-primary px-3 py-2 text-white"
          onClick={() => save(prefs)}
        >
          Save
        </button>
      </div>
      <p className="mt-2 text-xs text-foreground-secondary">
        Manage later via the{' '}
        <a className="underline" href="/cookies">
          Preferences Centre
        </a>
        . See our{' '}
        <a className="underline" href="/privacy">
          Privacy &amp; Data Requests
        </a>
        .
      </p>
    </div>
  )
}