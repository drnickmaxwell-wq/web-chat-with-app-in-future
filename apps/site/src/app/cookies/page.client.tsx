
import React, { useEffect, useState } from 'react'

export const metadata = {
  title: 'Cookie Preferences',
  description: 'Manage your cookie preferences for St Mary’s House Dental Care.',
}

const CATEGORIES = ['necessary', 'functional', 'analytics', 'marketing'] as const

export default function CookiesPage() {
  const [prefs, setPrefs] = useState<Record<(typeof CATEGORIES)[number], boolean>>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cookie-prefs') : null
    if (saved) {
      try {
        setPrefs(JSON.parse(saved))
      } catch {
        /* ignore */
      }
    }
  }, [])

  function save(next: typeof prefs) {
    localStorage.setItem('cookie-prefs', JSON.stringify(next))
    setPrefs(next)
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <h1 className="text-3xl font-bold">Cookie Preferences</h1>
      <p className="text-base">
        Here you can update which cookies you are willing to accept. Strictly necessary cookies
        cannot be disabled because they enable core site functionality. Your preferences are
        saved in your browser.
      </p>
      <div className="space-y-4">
        {CATEGORIES.map((k) => (
          <label key={k} className="flex items-start gap-3 text-base">
            <input
              type="checkbox"
              disabled={k === 'necessary'}
              checked={!!prefs[k]}
              onChange={(e) => setPrefs((p) => ({ ...p, [k]: e.target.checked }))}
              className="mt-1"
            />
            <span className="capitalize">
              {k === 'necessary' ? 'Strictly necessary' : k} cookies
            </span>
          </label>
        ))}
        <div className="flex gap-3">
          <button
            onClick={() => save(prefs)}
            className="rounded-xl bg-primary px-4 py-2 text-white"
          >
            Save preferences
          </button>
          <button
            onClick={() => save({ ...prefs, functional: false, analytics: false, marketing: false })}
            className="rounded-xl px-4 py-2 border"
          >
            Reject non‑essential
          </button>
        </div>
      </div>
    </section>
  )
}
