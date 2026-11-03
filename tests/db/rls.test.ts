import type { PGlite } from '@electric-sql/pglite'
import { beforeAll, describe, expect, it } from 'vitest'
import { asActor, createDatabase, type Actor } from './harness'

const ADMIN_ID = '00000000-0000-4000-8000-000000000001'
const OTHER_ID = '00000000-0000-4000-8000-000000000002'
const anon: Actor = { role: 'anon' }
const admin: Actor = { role: 'authenticated', userId: ADMIN_ID }
const stranger: Actor = { role: 'authenticated', userId: OTHER_ID }

const TABLES_WITH_DRAFTS = ['projects', 'expertise_areas', 'skills', 'social_links']

let db: PGlite

beforeAll(async () => {
  db = await createDatabase()
  await db.query('insert into auth.users (id) values ($1), ($2)', [ADMIN_ID, OTHER_ID])
  await db.query('insert into public.admin_users (user_id) values ($1)', [ADMIN_ID])
  await db.exec(`
    insert into public.projects (slug, title, needs_verification) values ('draft-probe', 'Draft', true);
    insert into public.project_technologies (project_id, technology_id)
      select p.id, t.id from public.projects p, public.technologies t
      where p.slug = 'draft-probe' and t.slug = 'moodle';
  `)
}, 60_000)

describe('row level security', () => {
  it('is enabled on every public table', async () => {
    const { rows } = await db.query<{ tablename: string }>(
      `select tablename from pg_tables where schemaname = 'public' and not rowsecurity`,
    )
    expect(rows).toEqual([])
  })

  it.each(TABLES_WITH_DRAFTS)('hides %s drafts from visitors and non-admin accounts', async (table) => {
    const sql = `select count(*)::int as n from public.${table} where status <> 'published'`
    const count = async (actor: Actor) => (await asActor<{ n: number }>(db, actor, sql)).rows[0].n
    expect(await count(admin)).toBeGreaterThan(0)
    expect(await count(anon)).toBe(0)
    expect(await count(stranger)).toBe(0)
  })

  it('shows visitors published rows', async () => {
    const { rows } = await asActor<{ institution: string }>(db, anon, 'select institution from public.education')
    expect(rows).toHaveLength(1)
  })

  it('lists only reviewed skills and leaves GitHub hidden', async () => {
    const skills = await asActor<{ name: string }>(db, anon, 'select name from public.skills')
    const links = await asActor<{ platform: string }>(db, anon, 'select platform from public.social_links')
    expect(skills.rows.map((row) => row.name)).not.toContain('React')
    expect(links.rows).toEqual([{ platform: 'linkedin' }])
  })

  it('hides child rows of draft projects from visitors', async () => {
    const sql = `select count(*)::int as n from public.project_technologies pt
      join public.technologies t on t.id = pt.technology_id where t.slug = 'moodle'`
    const { rows } = await asActor<{ n: number }>(db, anon, sql)
    expect(rows[0].n).toBe(2)
    const all = await asActor<{ n: number }>(db, admin, sql)
    expect(all.rows[0].n).toBe(3)
  })

  it('rejects writes from visitors', async () => {
    await expect(
      asActor(db, anon, `insert into public.projects (slug, title) values ('x', 'x')`),
    ).rejects.toThrow(/permission denied/)
  })

  it('rejects writes from signed-in accounts that are not admins', async () => {
    await expect(
      asActor(db, stranger, `insert into public.projects (slug, title) values ('x', 'x')`),
    ).rejects.toThrow(/row-level security/)
    const updated = await asActor(db, stranger, `update public.profiles set full_name = 'x'`)
    expect(updated.affectedRows).toBe(0)
  })

  it('stops a signed-in account from granting itself admin', async () => {
    await expect(
      asActor(db, stranger, 'insert into public.admin_users (user_id) values ($1)', [OTHER_ID]),
    ).rejects.toThrow(/permission denied/)
  })

  it('keeps contact messages private and closed to direct inserts', async () => {
    await expect(asActor(db, anon, 'select * from public.contact_messages')).rejects.toThrow(/permission denied/)
    await expect(
      asActor(db, anon, `insert into public.contact_messages (name, email, message) values ('a', 'a@b.c', 'hi')`),
    ).rejects.toThrow(/permission denied/)
  })

  it('hides private settings and private media', async () => {
    await db.exec(`insert into public.site_settings (key, value, is_public) values ('secret_note', '1', false)`)
    await db.exec(`insert into public.media_assets (bucket, path, visibility, mime_type, size_bytes)
                   values ('private-media', 'proof.pdf', 'private', 'application/pdf', 10)`)
    const settings = await asActor(db, anon, `select * from public.site_settings where key = 'secret_note'`)
    const media = await asActor(db, anon, `select * from public.media_assets`)
    expect(settings.rows).toEqual([])
    expect(media.rows).toEqual([])
  })

  it('does not let visitors read the audit log', async () => {
    await expect(asActor(db, anon, 'select * from public.audit_log')).rejects.toThrow(/permission denied/)
  })
})

describe('publishing rules', () => {
  it('refuses to publish content that still needs verification', async () => {
    await expect(
      asActor(db, admin, `update public.projects set status = 'published' where slug = 'draft-probe'`),
    ).rejects.toThrow(/projects_verified_before_publish/)
  })

  it('publishes once the admin clears verification, and visitors then see it', async () => {
    const slug = 'draft-probe'
    const visible = () => asActor<{ slug: string }>(db, anon, `select slug from public.projects where slug = '${slug}'`)
    expect((await visible()).rows).toEqual([])
    await asActor(db, admin, `update public.projects set needs_verification = false, status = 'published' where slug = '${slug}'`)
    expect((await visible()).rows).toEqual([{ slug }])
  })

  it('hides a project from visitors again when archived', async () => {
    await asActor(db, admin, `update public.projects set status = 'archived' where slug = 'simanis'`)
    const { rows } = await asActor(db, anon, `select slug from public.projects where slug = 'simanis'`)
    expect(rows).toEqual([])
  })

  it('records who changed what', async () => {
    const { rows } = await db.query<{ actor_id: string; action: string }>(
      `select actor_id, action from public.audit_log where table_name = 'projects' and actor_id is not null`,
    )
    expect(rows.length).toBeGreaterThanOrEqual(2)
    expect(rows[0]).toEqual({ actor_id: ADMIN_ID, action: 'update' })
  })

  it('rejects unsafe link schemes', async () => {
    await expect(
      asActor(db, admin, `update public.projects set demo_url = 'javascript:alert(1)' where slug = 'simanis'`),
    ).rejects.toThrow(/demo_url/)
  })
})

describe('storage', () => {
  it('limits buckets by size and file type', async () => {
    const { rows } = await db.query<{ public: boolean; file_size_limit: number; allowed_mime_types: string[] }>(
      `select public, file_size_limit, allowed_mime_types from storage.buckets order by id`,
    )
    expect(rows.map((r) => r.public)).toEqual([false, true])
    for (const row of rows) {
      expect(Number(row.file_size_limit)).toBe(10 * 1024 * 1024)
      expect(row.allowed_mime_types).not.toContain('image/svg+xml')
    }
  })
})
