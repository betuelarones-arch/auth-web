interface RateLimitEntry {
  count: number
  lastAttempt: number
  blockedUntil: number | null
}

const store = new Map<string, RateLimitEntry>()

const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 15 * 60 * 1000
const WINDOW_DURATION = 15 * 60 * 1000

export function checkRateLimit(identifier: string): {
  allowed: boolean
  remaining: number
  blockedUntil: number | null
} {
  const now = Date.now()
  const entry = store.get(identifier)

  if (entry) {
    if (entry.blockedUntil && entry.blockedUntil > now) {
      return { allowed: false, remaining: 0, blockedUntil: entry.blockedUntil }
    }

    if (entry.blockedUntil && entry.blockedUntil <= now) {
      store.delete(identifier)
      return { allowed: true, remaining: MAX_ATTEMPTS, blockedUntil: null }
    }

    if (now - entry.lastAttempt > WINDOW_DURATION) {
      store.delete(identifier)
      return { allowed: true, remaining: MAX_ATTEMPTS, blockedUntil: null }
    }
  }

  const current = store.get(identifier) ?? {
    count: 0,
    lastAttempt: now,
    blockedUntil: null,
  }
  current.count++
  current.lastAttempt = now

  if (current.count >= MAX_ATTEMPTS) {
    current.blockedUntil = now + BLOCK_DURATION
  }

  store.set(identifier, current)

  return {
    allowed: current.count < MAX_ATTEMPTS,
    remaining: MAX_ATTEMPTS - current.count,
    blockedUntil: current.blockedUntil,
  }
}

export function resetRateLimit(identifier: string) {
  store.delete(identifier)
}
