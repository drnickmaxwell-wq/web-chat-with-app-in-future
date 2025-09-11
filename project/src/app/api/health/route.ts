import { NextResponse } from 'next/server'

/**
 * Healthcheck endpoint.
 *
 * Vercel will deploy this as an edge function. It returns `{ ok: true }` when
 * the application is healthy. Used by automated deployment checks.
 */
export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 })
}