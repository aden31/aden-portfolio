import { createClient } from 'npm:@supabase/supabase-js@2'
import { handleContact } from './handler.ts'

const SITE_URL = Deno.env.get('SITE_URL') ?? ''
const cors = {
  'Access-Control-Allow-Origin': SITE_URL,
  'Access-Control-Allow-Headers': 'content-type, apikey, authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function hashIp(ip: string) {
  const data = new TextEncoder().encode(`${Deno.env.get('CONTACT_IP_HASH_SALT')}:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: cors })

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  try {
    const result = await handleContact(await request.json().catch(() => null), await hashIp(ip), {
      async countSince(ipHash, since) {
        const { count, error } = await db.from('contact_messages')
          .select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', since)
        if (error) throw error
        return count ?? 0
      },
      async insert(row) {
        const { error } = await db.from('contact_messages').insert(row)
        if (error) throw error
      },
    })
    return Response.json(result.body, { status: result.status, headers: cors })
  } catch (error) {
    console.error(error)
    return Response.json({ ok: false, message: 'The message could not be saved.' }, { status: 500, headers: cors })
  }
})
