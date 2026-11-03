export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isPreviewFile = import.meta.env.MODE === 'preview-file'

/** Serves the bundled content on the live site until Supabase is connected. */
export const useStaticContent = import.meta.env.VITE_CONTENT_SOURCE === 'static'

/** Sample content is allowed only outside production builds. */
export const allowSampleContent = import.meta.env.DEV || isPreviewFile || import.meta.env.MODE === 'test'
