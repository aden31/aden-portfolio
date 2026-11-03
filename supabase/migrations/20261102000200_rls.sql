-- Default deny: every table gets RLS, then only the access listed here.
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Tables with a status column: visitors see published rows, admins see everything.
do $$
declare t text;
begin
  foreach t in array array[
    'social_links', 'projects', 'experiences', 'education', 'achievements',
    'certificates', 'skills', 'expertise_areas', 'articles'
  ] loop
    execute format(
      'create policy public_read on public.%I for select to anon, authenticated
       using (status = ''published'' or (select public.is_admin()))', t);
    execute format(
      'create policy admin_write on public.%I for all to authenticated
       using ((select public.is_admin())) with check ((select public.is_admin()))', t);
  end loop;
end $$;

-- Always-public lookups, written by admins only.
do $$
declare t text;
begin
  foreach t in array array['profiles', 'project_categories', 'technologies', 'skill_categories'] loop
    execute format(
      'create policy public_read on public.%I for select to anon, authenticated using (true)', t);
    execute format(
      'create policy admin_write on public.%I for all to authenticated
       using ((select public.is_admin())) with check ((select public.is_admin()))', t);
  end loop;
end $$;

-- Child rows follow the published state of their parent.
create policy public_read on public.project_images for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = project_id));
create policy admin_write on public.project_images for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy public_read on public.project_technologies for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = project_id));
create policy admin_write on public.project_technologies for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy public_read on public.experience_technologies for select to anon, authenticated
  using (exists (select 1 from public.experiences e where e.id = experience_id));
create policy admin_write on public.experience_technologies for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy public_read on public.site_settings for select to anon, authenticated
  using (is_public or (select public.is_admin()));
create policy admin_write on public.site_settings for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy public_read on public.media_assets for select to anon, authenticated
  using (visibility = 'public' or (select public.is_admin()));
create policy admin_write on public.media_assets for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- No insert policy for visitors: the Edge Function writes with the service role.
create policy admin_read on public.contact_messages for select to authenticated
  using ((select public.is_admin()));
create policy admin_update on public.contact_messages for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_delete on public.contact_messages for delete to authenticated
  using ((select public.is_admin()));

-- The audit log is read-only from the API; only the trigger writes to it.
create policy admin_read on public.audit_log for select to authenticated
  using ((select public.is_admin()));

create policy self_read on public.admin_users for select to authenticated
  using (user_id = auth.uid());

grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
revoke all on public.admin_users from anon;
revoke insert, update, delete on public.admin_users from authenticated;
revoke all on public.contact_messages from anon;
revoke insert on public.contact_messages from authenticated;
revoke all on public.audit_log from anon;
revoke insert, update, delete on public.audit_log from authenticated;
grant execute on function public.is_admin() to anon, authenticated;
