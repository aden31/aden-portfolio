import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { PGlite } from '@electric-sql/pglite'

/** Stands in for the parts of Supabase the migrations rely on. */
const SUPABASE_STUB = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  create schema auth;
  create schema storage;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.sub', true), '')::uuid $$;
  grant usage on schema auth to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
  create table storage.buckets (
    id text primary key, name text, public boolean,
    file_size_limit bigint, allowed_mime_types text[]
  );
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
`

export async function createDatabase(): Promise<PGlite> {
  const db = new PGlite()
  await db.exec(SUPABASE_STUB)
  const dir = join(process.cwd(), 'supabase/migrations')
  for (const file of readdirSync(dir).sort()) {
    await db.exec(readFileSync(join(dir, file), 'utf8'))
  }
  await db.exec(readFileSync(join(process.cwd(), 'supabase/seed.sql'), 'utf8'))
  return db
}

export type Actor = { role: 'anon' } | { role: 'authenticated'; userId: string }

/** Runs a query as a request would: with the role and JWT subject set, then reset. */
export async function asActor<T>(db: PGlite, actor: Actor, sql: string, params: unknown[] = []) {
  const userId = actor.role === 'authenticated' ? actor.userId : ''
  await db.query(`select set_config('request.jwt.sub', $1, false)`, [userId])
  await db.exec(`set role ${actor.role}`)
  try {
    return await db.query<T>(sql, params)
  } finally {
    await db.exec('reset role')
    await db.query(`select set_config('request.jwt.sub', '', false)`)
  }
}
