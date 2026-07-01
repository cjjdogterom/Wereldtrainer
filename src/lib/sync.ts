import type { ProgressState } from './training'

// The full state shared across all devices (stored server-side once KV is on).
export type SharedState = {
  v: number
  progress: ProgressState
  // Slim-oefenen "seen this cycle", keyed by area (continent / 'Wereld' / focus)
  oefenSeen: Record<string, string[]>
  updatedAt: number
}

const API = '/api/progress'

// Load the shared state. Returns null when the store isn't configured yet
// (or unreachable) so the caller can fall back to local storage.
export async function fetchShared(): Promise<SharedState | null> {
  try {
    const r = await fetch(API, { cache: 'no-store' })
    if (!r.ok) return null
    const j = await r.json()
    if (!j || !j.configured || !j.data) return null
    return j.data as SharedState
  } catch {
    return null
  }
}

let timer: ReturnType<typeof setTimeout> | null = null
let pending: SharedState | null = null

// Debounced save so rapid answers coalesce into one write.
export function saveShared(state: SharedState) {
  pending = state
  if (timer) clearTimeout(timer)
  timer = setTimeout(flush, 700)
}

function flush() {
  timer = null
  const body = pending
  pending = null
  if (!body) return
  fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {})
}
