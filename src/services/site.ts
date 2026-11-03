import type { SupabaseClient } from '@supabase/supabase-js'
import { allowSampleContent, supabaseAnonKey, supabaseUrl, useStaticContent } from '@/lib/env'
import type {
  Achievement, AchievementCategory, Certificate, Education, EvidenceLevel, Experience, ExpertiseArea, MediaRef,
  PipelineStage, Project, ProjectStatus, SiteContent, SkillGroup, SocialLink,
} from '@/types/content'

type MediaRow = { bucket: string; path: string; alt_text: string } | null
type Result<T> = { data: T | null; error: { message: string } | null }

type ProfileRow = {
  full_name: string; headline: string; subheadline: string; status_label: string
  about_statement: string; about_points: string[]; about_body: string; soft_skills: string[]
  contact_email: string | null; cta_primary_label: string; cta_cv_label: string
  closing_headline: string; closing_body: string; portrait: MediaRow; cv: MediaRow
}

type ProjectRow = {
  slug: string; title: string; summary: string; context: string; problem: string; goals: string
  solution: string; role: string; key_features: string[]; flow_steps: string[]; challenges: string
  verified_outcomes: string; project_status: ProjectStatus | null; year: number | null
  demo_url: string | null; repo_url: string | null; is_featured: boolean; cover: MediaRow
  category: { name: string } | null
  project_technologies: { sort_order: number; technologies: { name: string } | null }[]
  project_images: { caption: string; sort_order: number; media: MediaRow }[]
}

type EducationRow = {
  id: string; institution: string; faculty: string | null; program: string; start_year: number | null
  end_year: number | null; gpa: number | null; gpa_scale: number | null; honors: string | null; description: string
}

export type ExperienceRow = {
  id: string; kind: Experience['kind']; organization: string; position: string; description: string
  contributions: string[]; start_date: string | null; end_date: string | null
  period_label: string | null; is_current: boolean
}

type AchievementRow = {
  id: string; title: string; description: string; category: AchievementCategory; organizer: string | null
  achieved_year: number | null; event_period: string | null; credential_id: string | null
  highlight_value: string | null; highlight_label: string | null; is_featured: boolean
  source_url: string | null; proof: MediaRow
}

type CertificateRow = {
  id: string; title: string; issuer: string; program: string | null; training_period: string | null
  training_hours: number | null; credential_id: string | null; credential_url: string | null; media: MediaRow
}

type SkillRow = {
  name: string; usage_description: string; evidence: EvidenceLevel
  category: { name: string; sort_order: number } | null
}

const MEDIA = 'bucket,path,alt_text'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const PROJECT_FIELDS = `slug,title,summary,context,problem,goals,solution,role,key_features,flow_steps,challenges,
  verified_outcomes,project_status,year,demo_url,repo_url,is_featured,
  cover:media_assets!cover_media_id(${MEDIA}),category:project_categories(name),
  project_technologies(sort_order,technologies(name)),
  project_images(caption,sort_order,media:media_assets(${MEDIA}))`

function publicUrl(baseUrl: string, media: MediaRow): string | null {
  if (!media || media.bucket !== 'public-media') return null
  const path = media.path.split('/').map(encodeURIComponent).join('/')
  return `${baseUrl}/storage/v1/object/public/${media.bucket}/${path}`
}

function mediaRef(baseUrl: string, media: MediaRow): MediaRef | null {
  const url = publicUrl(baseUrl, media)
  return url && media ? { url, alt: media.alt_text } : null
}

function formatMonth(date: string | null): string | null {
  if (!date) return null
  const [year, month] = date.split('-')
  return `${MONTHS[Number(month) - 1]} ${year}`
}

/** Shows only what is stored. Missing dates stay missing. */
export function formatExperiencePeriod(row: Pick<ExperienceRow, 'start_date' | 'end_date' | 'period_label' | 'is_current'>): string | null {
  if (row.period_label) return row.period_label
  const start = formatMonth(row.start_date)
  const end = row.is_current ? 'present' : formatMonth(row.end_date)
  if (start && end) return start === end ? start : `${start} – ${end}`
  return start ?? end
}

function mapProject(baseUrl: string, row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    context: row.context,
    problem: row.problem,
    goals: row.goals,
    solution: row.solution,
    role: row.role,
    keyFeatures: row.key_features,
    flowSteps: row.flow_steps,
    challenges: row.challenges,
    verifiedOutcomes: row.verified_outcomes,
    technologies: [...row.project_technologies]
      .sort((a, b) => a.sort_order - b.sort_order)
      .flatMap((link) => (link.technologies ? [link.technologies.name] : [])),
    category: row.category?.name ?? null,
    cover: mediaRef(baseUrl, row.cover),
    gallery: [...row.project_images]
      .sort((a, b) => a.sort_order - b.sort_order)
      .flatMap((image) => {
        const ref = mediaRef(baseUrl, image.media)
        return ref ? [{ ...ref, caption: image.caption }] : []
      }),
    projectStatus: row.project_status,
    year: row.year,
    demoUrl: row.demo_url,
    repoUrl: row.repo_url,
    isFeatured: row.is_featured,
  }
}

function groupSkills(rows: SkillRow[]): SkillGroup[] {
  const groups = new Map<string, { order: number; group: SkillGroup }>()
  for (const row of rows) {
    if (!row.category) continue
    const entry = groups.get(row.category.name) ?? {
      order: row.category.sort_order,
      group: { name: row.category.name, skills: [] },
    }
    entry.group.skills.push({ name: row.name, usage: row.usage_description, evidence: row.evidence })
    groups.set(row.category.name, entry)
  }
  return [...groups.values()].sort((a, b) => a.order - b.order).map((entry) => entry.group)
}

function rows<T>(result: unknown): T {
  const { data, error } = result as Result<T>
  if (error) throw new Error(error.message)
  if (data === null) throw new Error('The content request returned no data.')
  return data
}

/** Loads published content. RLS keeps drafts out; the status filters only keep queries explicit. */
export async function fetchSiteContent(client: SupabaseClient, baseUrl: string): Promise<SiteContent> {
  const published = (table: string, fields: string) => client.from(table).select(fields).eq('status', 'published').order('sort_order')

  const [profile, social, pipeline, projects, expertise, achievements, certificates, education, experiences, skills] = await Promise.all([
    client.from('profiles')
      .select(`full_name,headline,subheadline,status_label,about_statement,about_points,about_body,soft_skills,
        contact_email,cta_primary_label,cta_cv_label,closing_headline,closing_body,
        portrait:media_assets!portrait_media_id(${MEDIA}),cv:media_assets!cv_media_id(${MEDIA})`)
      .single(),
    published('social_links', 'platform,label,url'),
    client.from('site_settings').select('value').eq('key', 'hero_pipeline').maybeSingle(),
    published('projects', PROJECT_FIELDS),
    published('expertise_areas', 'title,description,evidence,tools'),
    published('achievements', `id,title,description,category,organizer,achieved_year,event_period,credential_id,
      highlight_value,highlight_label,is_featured,source_url,proof:media_assets!proof_media_id(${MEDIA})`),
    published('certificates', `id,title,issuer,program,training_period,training_hours,credential_id,credential_url,
      media:media_assets!media_id(${MEDIA})`),
    published('education', 'id,institution,faculty,program,start_year,end_year,gpa,gpa_scale,honors,description'),
    published('experiences', 'id,kind,organization,position,description,contributions,start_date,end_date,period_label,is_current'),
    published('skills', 'name,usage_description,evidence,category:skill_categories(name,sort_order)'),
  ])

  const profileRow = rows<ProfileRow>(profile)
  if (pipeline.error) throw new Error(pipeline.error.message)

  return {
    isSample: false,
    profile: {
      fullName: profileRow.full_name,
      headline: profileRow.headline,
      subheadline: profileRow.subheadline,
      statusLabel: profileRow.status_label,
      aboutStatement: profileRow.about_statement,
      aboutPoints: profileRow.about_points,
      aboutBody: profileRow.about_body,
      softSkills: profileRow.soft_skills,
      contactEmail: profileRow.contact_email,
      portrait: mediaRef(baseUrl, profileRow.portrait),
      cvUrl: publicUrl(baseUrl, profileRow.cv),
      ctaPrimaryLabel: profileRow.cta_primary_label,
      ctaCvLabel: profileRow.cta_cv_label,
      closingHeadline: profileRow.closing_headline,
      closingBody: profileRow.closing_body,
    },
    socialLinks: rows<SocialLink[]>(social),
    pipeline: (pipeline.data?.value as PipelineStage[] | undefined) ?? [],
    projects: rows<ProjectRow[]>(projects).map((row) => mapProject(baseUrl, row)),
    expertise: rows<ExpertiseArea[]>(expertise),
    achievements: rows<AchievementRow[]>(achievements).map((row): Achievement => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      organizer: row.organizer,
      period: row.event_period ?? (row.achieved_year ? String(row.achieved_year) : null),
      credentialId: row.credential_id,
      value: row.highlight_value,
      label: row.highlight_label,
      isFeatured: row.is_featured,
      proof: mediaRef(baseUrl, row.proof),
      sourceUrl: row.source_url,
    })),
    certificates: rows<CertificateRow[]>(certificates).map((row): Certificate => ({
      id: row.id,
      title: row.title,
      issuer: row.issuer,
      program: row.program,
      period: row.training_period,
      hours: row.training_hours === null ? null : Number(row.training_hours),
      credentialId: row.credential_id,
      credentialUrl: row.credential_url,
      image: mediaRef(baseUrl, row.media),
    })),
    education: rows<EducationRow[]>(education).map((row): Education => ({
      id: row.id,
      institution: row.institution,
      faculty: row.faculty,
      program: row.program,
      period: row.start_year && row.end_year ? `${row.start_year}–${row.end_year}` : null,
      gpa: row.gpa === null || row.gpa_scale === null ? null : `${Number(row.gpa).toFixed(2)}/${Number(row.gpa_scale).toFixed(2)}`,
      honors: row.honors,
      description: row.description,
    })),
    experiences: rows<ExperienceRow[]>(experiences).map((row): Experience => ({
      id: row.id,
      kind: row.kind,
      organization: row.organization,
      position: row.position,
      description: row.description,
      contributions: row.contributions,
      period: formatExperiencePeriod(row),
    })),
    skillGroups: groupSkills(rows<SkillRow[]>(skills)),
  }
}

/** Removes everything unconfirmed, matching what the database would show visitors. */
export function toPublishable(content: SiteContent): SiteContent {
  return {
    ...content,
    isSample: false,
    projects: content.projects.filter((item) => !item.needsVerification),
    expertise: content.expertise.filter((item) => !item.needsVerification),
    skillGroups: content.skillGroups
      .map((group) => ({ ...group, skills: group.skills.filter((skill) => !skill.needsVerification) }))
      .filter((group) => group.skills.length > 0),
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  if (supabaseUrl && supabaseAnonKey) {
    const { getSupabase } = await import('@/lib/supabase')
    return fetchSiteContent(await getSupabase(), supabaseUrl)
  }
  if (useStaticContent) return toPublishable((await import('@/data/sample')).sampleContent)
  if (allowSampleContent) return (await import('@/data/sample')).sampleContent
  throw new Error('This site is missing its Supabase configuration.')
}
