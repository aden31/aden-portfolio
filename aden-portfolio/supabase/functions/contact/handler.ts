import { validateContact, type ContactInput } from './validate.ts'

export const RATE_LIMIT = 5
export const RATE_WINDOW_MS = 60 * 60 * 1000

export type ContactStore = {
  countSince(ipHash: string, sinceIso: string): Promise<number>
  insert(row: ContactInput & { ip_hash: string }): Promise<void>
}

type Result = { status: number; body: Record<string, unknown> }

/** Reports success only after the message is stored. */
export async function handleContact(body: unknown, ipHash: string, store: ContactStore, now = Date.now()): Promise<Result> {
  const payload = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>
  // Bots fill the hidden field. They get a normal-looking reply and nothing is stored.
  if (payload.website) return { status: 201, body: { ok: true } }

  const { values, errors, valid } = validateContact(payload)
  if (!valid) return { status: 400, body: { ok: false, errors } }

  const since = new Date(now - RATE_WINDOW_MS).toISOString()
  if ((await store.countSince(ipHash, since)) >= RATE_LIMIT) {
    return { status: 429, body: { ok: false, message: 'Too many messages. Try again in an hour.' } }
  }
  await store.insert({ ...values, ip_hash: ipHash })
  return { status: 201, body: { ok: true } }
}
