import { supabaseAnonKey, supabaseUrl } from '@/lib/env'
import type { ContactErrors, ContactInput } from '../../supabase/functions/contact/validate'

export const contactFormEnabled = Boolean(supabaseUrl && supabaseAnonKey)

export type SendResult = { ok: true } | { ok: false; message: string; errors?: ContactErrors }

export async function sendContactMessage(input: ContactInput & { website: string }): Promise<SendResult> {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: supabaseAnonKey ?? '' },
      body: JSON.stringify(input),
    })
    const body = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: ContactErrors }
    if (response.status === 201 && body.ok) return { ok: true }
    return { ok: false, message: body.message ?? 'The message wasn’t sent. Try again, or use email.', errors: body.errors }
  } catch {
    return { ok: false, message: 'The message wasn’t sent because the connection failed. Try again, or use email.' }
  }
}
