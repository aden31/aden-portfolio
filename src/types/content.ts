export type MediaRef = { url: string; alt: string }

export type Profile = {
  fullName: string
  headline: string
  subheadline: string
  statusLabel: string
  aboutStatement: string
  aboutPoints: string[]
  aboutBody: string
  softSkills: string[]
  contactEmail: string | null
  portrait: MediaRef | null
  cvUrl: string | null
  ctaPrimaryLabel: string
  ctaCvLabel: string
  closingHeadline: string
  closingBody: string
}

export type SocialLink = { platform: string; label: string; url: string }

export type PipelineStage = { id: string; label: string; detail: string }

export type ProjectStatus = 'concept' | 'in_progress' | 'completed' | 'maintained' | 'archived'

export type Project = {
  slug: string
  title: string
  summary: string
  context: string
  problem: string
  goals: string
  solution: string
  role: string
  keyFeatures: string[]
  flowSteps: string[]
  challenges: string
  verifiedOutcomes: string
  technologies: string[]
  category: string | null
  cover: MediaRef | null
  gallery: (MediaRef & { caption: string })[]
  projectStatus: ProjectStatus | null
  year: number | null
  demoUrl: string | null
  repoUrl: string | null
  isFeatured: boolean
  needsVerification?: boolean
}

export type EvidenceLevel = 'applied' | 'project' | 'learning'

export type ExpertiseArea = {
  title: string
  description: string
  evidence: EvidenceLevel
  tools: string[]
  needsVerification?: boolean
}

export type AchievementCategory = 'academic' | 'competition' | 'certification' | 'organizational' | 'professional'

export type Achievement = {
  id: string
  title: string
  description: string
  category: AchievementCategory
  organizer: string | null
  period: string | null
  credentialId: string | null
  value: string | null
  label: string | null
  isFeatured: boolean
  proof: MediaRef | null
  sourceUrl: string | null
}

export type Certificate = {
  id: string
  title: string
  issuer: string
  program: string | null
  period: string | null
  hours: number | null
  credentialId: string | null
  credentialUrl: string | null
  image: MediaRef | null
}

export type Experience = {
  id: string
  kind: 'professional' | 'academic' | 'organizational'
  organization: string
  position: string
  description: string
  contributions: string[]
  period: string | null
}

export type Education = {
  id: string
  institution: string
  faculty: string | null
  program: string
  period: string | null
  gpa: string | null
  honors: string | null
  description: string
}

export type Skill = { name: string; usage: string; evidence: EvidenceLevel; needsVerification?: boolean }

export type SkillGroup = { name: string; skills: Skill[] }

export type SiteContent = {
  isSample: boolean
  profile: Profile
  socialLinks: SocialLink[]
  pipeline: PipelineStage[]
  projects: Project[]
  expertise: ExpertiseArea[]
  achievements: Achievement[]
  certificates: Certificate[]
  experiences: Experience[]
  education: Education[]
  skillGroups: SkillGroup[]
}

export const EVIDENCE_LABEL: Record<EvidenceLevel, string> = {
  applied: 'Applied in real work',
  project: 'Used in projects',
  learning: 'Still learning',
}
