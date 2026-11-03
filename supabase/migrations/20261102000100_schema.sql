-- Core CMS schema. See docs/database.md for the per-table reference.

create type public.publish_status as enum ('draft', 'published', 'archived');
create type public.project_status as enum ('concept', 'in_progress', 'completed', 'maintained', 'archived');
create type public.experience_kind as enum ('professional', 'academic', 'organizational');
create type public.achievement_category as enum ('academic', 'competition', 'certification', 'organizational', 'professional');
create type public.evidence_level as enum ('applied', 'project', 'learning');
create type public.media_kind as enum ('portrait', 'project_image', 'certificate', 'cv', 'article_thumbnail', 'other');
create type public.media_visibility as enum ('public', 'private');
create type public.message_status as enum ('new', 'read', 'archived');

-- Who may use the CMS. Rows are added by hand (docs/admin-setup.md), never from the app.
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null check (bucket in ('public-media', 'private-media')),
  path text not null,
  kind public.media_kind not null default 'other',
  visibility public.media_visibility not null default 'public',
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  width integer,
  height integer,
  alt_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path),
  check ((bucket = 'public-media') = (visibility = 'public'))
);

-- Single row: the site owner.
create table public.profiles (
  id boolean primary key default true check (id),
  full_name text not null,
  headline text not null,
  subheadline text not null,
  status_label text not null,
  short_bio text not null default '',
  about_statement text not null default '',
  about_points text[] not null default '{}',
  about_body text not null default '',
  soft_skills text[] not null default '{}',
  location text,
  contact_email text,
  portrait_media_id uuid references public.media_assets (id) on delete set null,
  cv_media_id uuid references public.media_assets (id) on delete set null,
  cta_primary_label text not null default 'Explore my work',
  cta_cv_label text not null default 'Download CV',
  closing_headline text not null default '',
  closing_body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique,
  label text not null,
  url text not null check (url ~ '^https://'),
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.project_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  summary text not null default '',
  problem text not null default '',
  goals text not null default '',
  solution text not null default '',
  role text not null default '',
  key_features text[] not null default '{}',
  flow_steps text[] not null default '{}',
  architecture_mermaid text,
  challenges text not null default '',
  verified_outcomes text not null default '',
  category_id uuid references public.project_categories (id) on delete set null,
  cover_media_id uuid references public.media_assets (id) on delete set null,
  project_status public.project_status,
  year smallint,
  context text not null default '',
  demo_url text check (demo_url ~ '^https?://'),
  repo_url text check (repo_url ~ '^https://'),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  needs_verification boolean not null default false,
  verification_note text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_verified_before_publish check (status <> 'published' or not needs_verification)
);
create index projects_public_idx on public.projects (status, is_featured, sort_order);
create index projects_category_idx on public.projects (category_id);
create index projects_cover_idx on public.projects (cover_media_id);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  media_id uuid not null references public.media_assets (id) on delete restrict,
  caption text not null default '',
  sort_order integer not null default 0,
  unique (project_id, media_id)
);
create index project_images_media_idx on public.project_images (media_id);

create table public.project_technologies (
  project_id uuid not null references public.projects (id) on delete cascade,
  technology_id uuid not null references public.technologies (id) on delete restrict,
  sort_order integer not null default 0,
  primary key (project_id, technology_id)
);
create index project_technologies_tech_idx on public.project_technologies (technology_id);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  kind public.experience_kind not null,
  organization text not null,
  position text not null,
  description text not null default '',
  contributions text[] not null default '{}',
  start_date date,
  end_date date,
  period_label text,
  is_current boolean not null default false,
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  needs_verification boolean not null default false,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experiences_verified_before_publish check (status <> 'published' or not needs_verification),
  constraint experiences_dates check (end_date is null or start_date is null or end_date >= start_date),
  constraint experiences_current check (not is_current or end_date is null)
);
create index experiences_public_idx on public.experiences (status, sort_order);

create table public.experience_technologies (
  experience_id uuid not null references public.experiences (id) on delete cascade,
  technology_id uuid not null references public.technologies (id) on delete restrict,
  primary key (experience_id, technology_id)
);
create index experience_technologies_tech_idx on public.experience_technologies (technology_id);

-- A blank gpa means "do not show it": RLS cannot hide a single column, so nothing private is stored here.
create table public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  faculty text,
  program text not null,
  start_year smallint,
  end_year smallint,
  gpa numeric(3, 2) check (gpa >= 0),
  gpa_scale numeric(3, 2),
  honors text,
  description text not null default '',
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  needs_verification boolean not null default false,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint education_verified_before_publish check (status <> 'published' or not needs_verification),
  constraint education_years check (end_year is null or start_year is null or end_year >= start_year),
  constraint education_gpa check (gpa is null or (gpa_scale is not null and gpa <= gpa_scale))
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category public.achievement_category not null,
  organizer text,
  achieved_on date,
  achieved_year smallint,
  event_period text,
  credential_id text,
  highlight_value text,
  highlight_label text,
  proof_media_id uuid references public.media_assets (id) on delete set null,
  source_url text check (source_url ~ '^https://'),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  needs_verification boolean not null default false,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint achievements_verified_before_publish check (status <> 'published' or not needs_verification)
);
create index achievements_public_idx on public.achievements (status, is_featured, sort_order);
create index achievements_proof_idx on public.achievements (proof_media_id);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_on date,
  expires_on date,
  credential_url text check (credential_url ~ '^https://'),
  credential_id text,
  program text,
  training_period text,
  training_hours numeric(5, 1),
  media_id uuid references public.media_assets (id) on delete set null,
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  needs_verification boolean not null default false,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint certificates_verified_before_publish check (status <> 'published' or not needs_verification)
);
create index certificates_media_idx on public.certificates (media_id);

create table public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- evidence_level replaces skill percentages with an honest label.
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.skill_categories (id) on delete restrict,
  name text not null,
  usage_description text not null default '',
  evidence public.evidence_level not null default 'project',
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  needs_verification boolean not null default false,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, name),
  constraint skills_verified_before_publish check (status <> 'published' or not needs_verification)
);

-- Homepage expertise list: broader than a single skill, and evidence-labelled.
create table public.expertise_areas (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text not null default '',
  evidence public.evidence_level not null default 'project',
  tools text[] not null default '{}',
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  needs_verification boolean not null default false,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expertise_verified_before_publish check (status <> 'published' or not needs_verification)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  body_markdown text not null default '',
  cover_media_id uuid references public.media_assets (id) on delete set null,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index articles_public_idx on public.articles (status, published_at desc);
create index articles_cover_idx on public.articles (cover_media_id);

-- Written only by the contact Edge Function with the service-role key.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  subject text check (char_length(subject) <= 200),
  message text not null check (char_length(message) between 1 and 5000),
  ip_hash text,
  status public.message_status not null default 'new',
  created_at timestamptz not null default now()
);
create index contact_messages_rate_idx on public.contact_messages (ip_hash, created_at desc);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid,
  action text not null,
  table_name text not null,
  row_id text,
  changed_at timestamptz not null default now()
);
create index audit_log_changed_at_idx on public.audit_log (changed_at desc);

-- Keeps updated_at honest on every table that has the column.
do $$
declare t text;
begin
  for t in
    select table_name from information_schema.columns
    where table_schema = 'public' and column_name = 'updated_at'
  loop
    execute format(
      'create trigger touch_updated_at before update on public.%I
       for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

create function public.write_audit_log() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  row_data jsonb := to_jsonb(case when tg_op = 'DELETE' then old else new end);
begin
  insert into public.audit_log (actor_id, action, table_name, row_id)
  values (auth.uid(), lower(tg_op), tg_table_name, coalesce(row_data ->> 'id', row_data ->> 'key'));
  return null;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles', 'social_links', 'site_settings', 'media_assets', 'project_categories',
    'projects', 'experiences', 'education', 'achievements', 'certificates',
    'skill_categories', 'skills', 'expertise_areas', 'articles'
  ] loop
    execute format(
      'create trigger audit after insert or update or delete on public.%I
       for each row execute function public.write_audit_log()', t);
  end loop;
end $$;
