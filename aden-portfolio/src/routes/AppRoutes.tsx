import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { PublicLayout } from '@/layouts/PublicLayout'
import { HomePage } from '@/pages/HomePage'
import { NotFound } from '@/pages/NotFoundPage'

const page = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(async () => ({ default: (await load())[name] }))

const AboutPage = page(() => import('@/pages/AboutPage'), 'AboutPage')
const ProjectsPage = page(() => import('@/pages/ProjectsPage'), 'ProjectsPage')
const ProjectDetailPage = page(() => import('@/pages/ProjectDetailPage'), 'ProjectDetailPage')
const ExperiencePage = page(() => import('@/pages/ExperiencePage'), 'ExperiencePage')
const AchievementsPage = page(() => import('@/pages/AchievementsPage'), 'AchievementsPage')
const SkillsPage = page(() => import('@/pages/SkillsPage'), 'SkillsPage')
const ContactPage = page(() => import('@/pages/ContactPage'), 'ContactPage')

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
      <Suspense fallback={<div role="status" className="min-h-screen" />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:slug" element={<ProjectDetailPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </>
  )
}
