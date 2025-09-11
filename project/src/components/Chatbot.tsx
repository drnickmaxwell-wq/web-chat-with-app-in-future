"use client"

import { useState } from 'react'

/**
 * A minimal chat interface that will be wired up to a backend API in the future.
 * For now it simply echoes a canned assistant response to demonstrate the UI.
 * The component is client side only (`use client`) so it can manage state.
 */
export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState('')

  async function send() {
    if (!input.trim()) return
    const userMsg = { role: 'user' as const, content: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    // Placeholder assistant response. Replace with call to your API route when ready.
    setMessages((m) => [
      ...m,
      { role: 'assistant', content: "Thanks for your message! I'll respond once the AI backend is configured." },
    ])
  }

  return (
    <div className="border rounded-2xl p-4 bg-background/40">
      <div className="space-y-2 max-h-64 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <span
              className="inline-block px-3 py-2 rounded-xl bg-white shadow text-sm sm:text-base"
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 border rounded-xl px-3 py-2 text-sm sm:text-base"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send()
          }}
          placeholder="Ask about services, hours, or directions…"
        />
        <button
          onClick={send}
          className="rounded-xl px-4 py-2 bg-primary text-white text-sm sm:text-base"
        >
          Send
        </button>
      </div>
    </div>
  )
}