import certDataScientist from './assets/certificates/data-scientist.webp'
import certEntrepreneurship from './assets/certificates/entrepreneurship.webp'
import certIflcSilver from './assets/certificates/iflc-silver-medal.webp'
import certIss3rd from './assets/certificates/iss-3rd-winner.webp'
import certIssGold from './assets/certificates/iss-gold-medal.webp'
import certMindset from './assets/certificates/mindset.webp'
import certNetwork from './assets/certificates/network.webp'
import certOperator from './assets/certificates/operator.webp'
import coverArli from './assets/projects/arli.webp'
import coverJasuda from './assets/projects/jasuda.webp'
import coverKpm from './assets/projects/kpm.webp'
import coverPosko from './assets/projects/posko-jasuda.webp'
import coverSimanis from './assets/projects/simanis.webp'
import coverTiec from './assets/projects/tiec-website.webp'
import coverLms from './assets/projects/tiec-lms.webp'
import coverYapensa from './assets/projects/yapensa.webp'
import portrait from './assets/portrait.webp'
import type { Project, SiteContent } from '@/types/content'

/**
 * Development and preview content, mirroring supabase/seed.sql. Loaded only outside production builds.
 * Items with needsVerification are drafts in the database, so they never reach the live site unconfirmed.
 */
const ISS_ORGANIZER = 'Sentosa Foundation with INSAN USIM, Universiti Sains Islam Malaysia, and World Association of Young Scientists'

const blankProject = {
  context: '', problem: '', goals: '', solution: '', role: '', keyFeatures: [], flowSteps: [], challenges: '',
  verifiedOutcomes: '', technologies: [], cover: null, gallery: [], projectStatus: null, demoUrl: null, repoUrl: null,
} satisfies Partial<Project>

export const sampleContent: SiteContent = {
  isSample: true,
  profile: {
    fullName: 'Aden Lutfil Irsyadi',
    headline: 'Building digital solutions that matter.',
    subheadline:
      "I'm Aden Lutfil Irsyadi, an Informatics Engineering graduate focused on building practical digital solutions through software development, system design, and automation.",
    statusLabel: 'Fresh graduate, Informatics Engineering',
    aboutStatement: 'Good software starts before the first line of code.',
    aboutPoints: [
      'I start by understanding what people actually need, then design the system around it.',
      'I work across the database, the interface, and the backend, so the parts fit together.',
      'I connect tools and APIs to remove repetitive work, and keep people in the loop where judgment matters.',
    ],
    aboutBody:
      'I studied Informatics Engineering at UIN Alauddin Makassar, focusing on software development, databases, artificial intelligence, data processing, and web-based systems. Along the way I built web systems during my internship, designed content and learning platforms for organizations, and assisted the Database course as a teaching assistant. For competitions, I built Autovizu, an AI mobile app that helps small businesses create product designs.',
    softSkills: ['Problem solving', 'Critical thinking', 'Communication', 'Teamwork', 'Project management', 'Adaptability'],
    contactEmail: 'adenlutfil@gmail.com',
    portrait: { url: portrait, alt: 'Portrait of Aden Lutfil Irsyadi in a black suit and tie' },
    cvUrl: null,
    ctaPrimaryLabel: 'Explore my work',
    ctaCvLabel: 'Download CV',
    closingHeadline: 'Have a problem worth solving?',
    closingBody: "I'm looking for opportunities to build useful software. Take a look at the work, or get in touch.",
  },
  socialLinks: [{ platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/aden-lutfil-irsyadi-0827b12b9' }],
  pipeline: [
    { id: 'need', label: 'Need', detail: 'Understand the real problem and who has it.' },
    { id: 'schema', label: 'Schema', detail: 'Design the system and the data behind it.' },
    { id: 'interface', label: 'Interface', detail: 'Build screens people can use without a manual.' },
    { id: 'backend', label: 'Backend', detail: 'Implement the logic, the APIs, and the rules.' },
    { id: 'automation', label: 'Automation', detail: 'Connect the workflow, with a person reviewing what matters.' },
  ],
  projects: [
    {
      ...blankProject,
      slug: "remedial-learning-automation",
      title: "AI automation for personalized remedial learning",
      summary: "Connects a Moodle LMS, n8n workflows, and quiz results to draft remedial questions for a teacher to review.",
      context: "Undergraduate thesis. Perancangan AI Automation Berbasis n8n untuk Personalisasi Pelatihan Remedial Pada LMS: Studi Kasus Bimbel TIEC ID Takalar.",
      problem: "Preparing remedial practice that fits each student takes time after every evaluation.",
      solution: "Quiz results flow from Moodle into an n8n workflow that drafts remedial questions with GPT-4. A person reviews each draft before it reaches the question bank.",
      role: "Designed and built the automation as my undergraduate thesis.",
      keyFeatures: ["Quiz evaluation intake from Moodle", "Exponential Moving Average in the evaluation data", "n8n workflow automation", "AI-assisted question drafts", "Human review before publishing"],
      flowSteps: ["Moodle quiz results", "n8n workflow", "GPT-4 question draft", "Human review", "Question bank"],
      technologies: ["Moodle", "n8n", "GPT-4", "Exponential Moving Average"],
      category: "AI Automation",
      year: 2026,
      projectStatus: "completed",
      isFeatured: true,
    },
    {
      ...blankProject,
      slug: "autovizu",
      title: "Autovizu",
      summary: "An AI mobile app that turns a photo of a product into a marketing design, so small businesses can promote what they sell.",
      context: "Built for two essay competitions. I presented it as a Figma prototype at the International Student Summit in Malaysia, then as a finished app with auto caption at the International Future Leaders Competition in Yogyakarta.",
      problem: "Small businesses need product designs for marketing, and many have no easy way to make them.",
      solution: "The user takes a photo of a product and the app creates the design. An n8n workflow connects the app to a GPT model.",
      role: "Designed and built the app.",
      keyFeatures: ["Product design from a single photo", "Auto caption", "Menu layout when several products are uploaded, such as food items"],
      flowSteps: ["Product photo", "Flutter app", "n8n workflow", "GPT model", "Design and caption"],
      technologies: ["Flutter", "Dart", "n8n", "GPT", "Figma"],
      category: "AI Automation",
      year: 2026,
      projectStatus: "completed",
      isFeatured: true,
    },
    {
      ...blankProject,
      slug: "simanis",
      title: "SIMANIS",
      summary: "A web-based service for requesting research and internship permit letters at Kanwil Kementerian Hukum Sulawesi Selatan, with letter tracking.",
      context: "Built during my internship in the Public Relations Division, Kementerian Hukum Sulawesi Selatan.",
      role: "Developed the system during the internship.",
      keyFeatures: ["Online requests for research and internship letters", "Letter tracking to follow each request", "Accessible from anywhere"],
      technologies: ["CodeIgniter"],
      category: "Information Systems",
      year: 2025,
      cover: { url: coverSimanis, alt: "SIMANIS service poster from Kanwil Kemenkum Sulawesi Selatan" },
      demoUrl: "http://simanis.kemenkumsulsel.id/",
      isFeatured: true,
    },
    {
      ...blankProject,
      slug: "public-satisfaction-survey",
      title: "Public satisfaction survey system",
      summary: "A web-based survey system that supports evaluation of public service quality at Kementerian Hukum Sulawesi Selatan.",
      context: "Built during my internship in the Public Relations Division, Kementerian Hukum Sulawesi Selatan.",
      role: "Developed the system during the internship.",
      technologies: ["Laravel"],
      category: "Information Systems",
      year: 2025,
      isFeatured: false,
    },
    {
      ...blankProject,
      slug: "tiec-id-web-platform",
      title: "TIEC-ID Takalar website",
      summary: "The website of Takalar International Education Centre Indonesia, a tutoring institution, with a CMS for news, galleries, fee information, and student resources.",
      role: "Designed and developed the CMS and website.",
      technologies: ["PHP"],
      category: "Web Applications",
      year: 2025,
      cover: { url: coverTiec, alt: "Homepage of the TIEC-ID Takalar website" },
      demoUrl: "https://tiec-id.com",
      isFeatured: false,
    },
    {
      ...blankProject,
      slug: "tiec-id-lms",
      title: "TIEC-ID Takalar LMS",
      summary: "A Moodle learning platform for the tutoring institution, with courses for junior and senior high students, intensive classes, and practice tryouts.",
      role: "Designed and developed the LMS.",
      technologies: ["Moodle"],
      category: "Learning Platforms",
      year: 2025,
      cover: { url: coverLms, alt: "Login page of the TIEC-ID Takalar LMS" },
      demoUrl: "https://lms.tiec-id.com",
      isFeatured: false,
    },
    {
      ...blankProject,
      slug: "jasuda",
      title: "JASUDA",
      summary: "A CMS and company website for JaSuDa, covering its seaweed business, products, partners, media, and price information.",
      role: "Designed and developed the CMS and website.",
      technologies: [],
      category: "Web Applications",
      year: 2026,
      cover: { url: coverJasuda, alt: "Homepage of the JaSuDa website" },
      demoUrl: "https://baru.jasuda.net",
      isFeatured: false,
    },
    {
      ...blankProject,
      slug: "posko-jasuda",
      title: "Posko JaSuDa",
      summary: "The website of CV Posko JaSuDa, a seaweed trading company, with its profile, documents, and team.",
      role: "Built the website.",
      technologies: ["Node.js"],
      category: "Web Applications",
      year: null,
      cover: { url: coverPosko, alt: "Homepage of the Posko JaSuDa website" },
      demoUrl: "https://gudang.jasuda.net",
      isFeatured: false,
    },
    {
      ...blankProject,
      slug: "arli",
      title: "ARLI",
      summary: "The website of Asosiasi Rumput Laut Indonesia, the Indonesian Seaweed Association, with its programs, news, galleries, and member directory.",
      role: "Built the website.",
      technologies: ["Node.js"],
      category: "Web Applications",
      year: null,
      cover: { url: coverArli, alt: "Homepage of the Asosiasi Rumput Laut Indonesia website" },
      demoUrl: "https://arli.or.id",
      isFeatured: false,
    },
    {
      ...blankProject,
      slug: "kpm-fst-uin-alauddin",
      title: "KPM FST UIN Alauddin Makassar",
      summary: "A CMS and website for the quality assurance committee of the Faculty of Science and Technology, publishing quality documents, evaluations, accreditation status, and activities.",
      role: "Designed and developed the CMS and website.",
      technologies: ["PHP"],
      category: "Web Applications",
      year: 2026,
      cover: { url: coverKpm, alt: "Homepage of the KPM FST UIN Alauddin Makassar website" },
      demoUrl: "https://kpm.uin-alauddin.com",
      isFeatured: false,
    },
    {
      ...blankProject,
      slug: "yapensa",
      title: "Yapensa",
      summary: "The website of Yayasan Pensa Global Agromandiri, a foundation that supports farmers and rural communities in Sulawesi.",
      role: "Built the website.",
      technologies: ["PHP"],
      category: "Web Applications",
      year: null,
      cover: { url: coverYapensa, alt: "Homepage of the Yapensa website" },
      demoUrl: "https://yapensa.or.id",
      isFeatured: false,
    },
    {
      ...blankProject,
      slug: "irsyadi-family-site",
      title: "irsyadi.com",
      summary: "A shared family website with profile pages, portfolios, photos, and archived projects.",
      role: "Built the website.",
      technologies: ["PHP"],
      category: "Web Applications",
      year: null,
      demoUrl: "https://irsyadi.com",
      isFeatured: false,
    },
  ],
  expertise: [
    { title: 'Web development', description: 'Web systems and CMS platforms built for an institution, organizations, and a company.', evidence: 'applied', tools: ['PHP', 'Laravel', 'CodeIgniter', 'Node.js', 'JavaScript', 'HTML', 'CSS'] },
    { title: 'Backend and database', description: 'Application logic and data, plus teaching database design as an assistant.', evidence: 'applied', tools: ['PHP', 'MySQL', 'REST API'] },
    { title: 'LMS integration', description: 'A Moodle LMS for TIEC-ID Takalar, and Moodle integration in my thesis.', evidence: 'applied', tools: ['Moodle'] },
    { title: 'Software development', description: 'Building applications from requirements through delivery.', evidence: 'project', tools: ['Flutter', 'Dart', 'Git'] },
    { title: 'System design', description: 'Analysis and design of information systems.', evidence: 'project', tools: [] },
    { title: 'AI automation', description: 'Workflows that connect systems and AI services.', evidence: 'project', tools: ['n8n', 'GPT'] },
    { title: 'Quality assurance', description: 'Software testing.', evidence: 'project', tools: [], needsVerification: true },
    { title: 'Data science', description: 'Completed 30 hours of Associate Data Scientist training.', evidence: 'learning', tools: [] },
  ],
  achievements: [
    { id: 'gpa', title: 'Graduated with honors', description: 'Teknik Informatika, UIN Alauddin Makassar.', category: 'academic', organizer: null, period: '2026', credentialId: null, value: '3.72', label: 'GPA out of 4.00, Cumlaude', isFeatured: true, proof: null, sourceUrl: null },
    { id: 'iss-gold', title: 'Gold Medal, International Student Summit', description: 'Essay competition. Presented a Figma prototype of Autovizu, my AI product design app for small businesses.', category: 'competition', organizer: ISS_ORGANIZER, period: '18–19 October 2025', credentialId: '002/ECO&LAW/ISS/SF/INSAN/USIM/WAYS/X/2025', value: 'Gold', label: 'Malaysia, 2025', isFeatured: true, proof: { url: certIssGold, alt: 'Gold Medal certificate, International Student Summit' }, sourceUrl: null },
    { id: 'iflc-silver', title: 'Silver Medal, International Future Leaders Competition', description: 'Essay competition. Presented the finished Autovizu app, updated with auto caption.', category: 'competition', organizer: 'Sentosa Foundation with the Arabic Literature Students Association of Gadjah Mada University', period: '25–26 July 2026', credentialId: '008/E/SE/IFLC/SF-IKMASA-UGM/VII/2026', value: 'Silver', label: 'Yogyakarta, 2026', isFeatured: true, proof: { url: certIflcSilver, alt: 'Silver Medal certificate, International Future Leaders Competition' }, sourceUrl: null },
    { id: 'iss-3rd', title: '3rd Winner, International Student Summit', description: 'Essay competition. Presented a Figma prototype of Autovizu, my AI product design app for small businesses.', category: 'competition', organizer: ISS_ORGANIZER, period: '18–19 October 2025', credentialId: '010/WINNER/ISS/SF/INSAN/USIM/WAYS/X/2025', value: '3rd', label: 'Malaysia, 2025', isFeatured: false, proof: { url: certIss3rd, alt: '3rd Winner certificate, International Student Summit' }, sourceUrl: null },
  ],
  certificates: [
    { id: 'network', title: 'Teknisi Utama Jaringan Komputer', issuer: 'BBPSDMP Makassar, Komdigi', program: 'Vocational School Graduate Academy, Digital Talent Scholarship 2025', period: '5–7 July 2025', hours: 24, credentialId: '193106651060-14/VSGA/BLSDM.Komdigi/2025', credentialUrl: null, image: { url: certNetwork, alt: 'Teknisi Utama Jaringan Komputer training certificate' } },
    { id: 'data', title: 'Associate Data Scientist', issuer: 'BBPSDMP Makassar, Kominfo', program: 'Vocational School Graduate Academy, Digital Talent Scholarship 2024', period: '18–23 March 2024', hours: 30, credentialId: '19377581060-208/VSGA/BLSDM.Kominfo/2024', credentialUrl: null, image: { url: certDataScientist, alt: 'Associate Data Scientist training certificate' } },
    { id: 'operator', title: 'Operator Komputer Madya', issuer: 'Kominfo', program: 'Vocational School Graduate Academy, Digital Talent Scholarship 2023', period: '28 March – 1 April 2023', hours: 24, credentialId: '19360551060-76/VSGA/BLSDM.Kominfo/2023', credentialUrl: null, image: { url: certOperator, alt: 'Operator Komputer Madya training certificate' } },
    { id: 'entrepreneur', title: 'Kewirausahaan Digital Dasar', issuer: 'Kominfo', program: 'Digital Entrepreneurship Academy, Digital Talent Scholarship 2023', period: '12–13 August 2023', hours: 13, credentialId: '19669571060-258/DEA/BLSDM.Kominfo/2023', credentialUrl: null, image: { url: certEntrepreneurship, alt: 'Kewirausahaan Digital Dasar training certificate' } },
    { id: 'mindset', title: 'Pengantar Mindset Digital 1', issuer: 'Pusat Pengembangan Literasi Digital, Komdigi', program: 'Micro Skill, Digital Talent Scholarship 2025', period: '2025', hours: 2, credentialId: '2299815850-7300/MS/BLSDM.Komdigi/2025', credentialUrl: null, image: { url: certMindset, alt: 'Pengantar Mindset Digital 1 training certificate' } },
  ],
  experiences: [
    { id: 'ta', kind: 'academic', organization: 'Universitas Islam Negeri Alauddin Makassar', position: 'Teaching assistant, Basis Data', description: 'Assisted lectures and practical sessions for the Database course.', contributions: ['Guided students in designing and managing databases.', 'Helped students finish assignments and projects, and supported learning evaluation.'], period: 'Aug 2025 – Dec 2025' },
    { id: 'intern', kind: 'professional', organization: 'Kementerian Hukum Sulawesi Selatan', position: 'Intern, Divisi Humas', description: 'Built two web-based systems during my internship in the Public Relations Division.', contributions: ['Developed SIMANIS, a letter service system for prospective interns, with CodeIgniter.', 'Developed a public satisfaction survey system with Laravel to support evaluation of service quality.'], period: 'Feb 2025 – Mar 2025' },
    { id: 'inready', kind: 'organizational', organization: 'Inready Workgroup', position: 'Divisi Humas', description: 'A student workgroup at UIN Alauddin Makassar focused on software development and digital technology.', contributions: ['Managed communication and publications on Instagram, and acted as the link to external parties.', 'Coordinated organization events, including exhibitions, seminars, inaugurations, and outdoor activities.'], period: 'Apr 2024 – Jul 2026' },
  ],
  education: [
    { id: 'uin', institution: 'Universitas Islam Negeri Alauddin Makassar', faculty: 'Fakultas Sains dan Teknologi', program: 'Teknik Informatika', period: '2022–2026', gpa: '3.72/4.00', honors: 'Cumlaude', description: 'Focus on software development, databases, artificial intelligence, and web-based systems.' },
  ],
  skillGroups: [
    { name: 'Programming languages', skills: [{ name: 'PHP', usage: 'Web systems and CMS platforms.', evidence: 'applied' }, { name: 'JavaScript', usage: 'Interactive web interfaces.', evidence: 'applied' }, { name: 'Dart', usage: 'Mobile app built with Flutter.', evidence: 'project' }] },
    { name: 'Frontend development', skills: [{ name: 'HTML', usage: 'Website structure.', evidence: 'applied' }, { name: 'CSS', usage: 'Website layout and styling.', evidence: 'applied' }, { name: 'Flutter', usage: 'Autovizu, an AI product design app.', evidence: 'project' }, { name: 'React', usage: '', evidence: 'project', needsVerification: true }, { name: 'Bootstrap', usage: '', evidence: 'project', needsVerification: true }, { name: 'Chart.js', usage: '', evidence: 'project', needsVerification: true }] },
    { name: 'Backend development', skills: [{ name: 'REST API', usage: 'Connecting systems and services.', evidence: 'applied' }, { name: 'Laravel', usage: 'Public satisfaction survey system.', evidence: 'applied' }, { name: 'CodeIgniter', usage: 'SIMANIS letter service system.', evidence: 'applied' }, { name: 'Node.js', usage: 'Posko JaSuDa and ARLI websites.', evidence: 'applied' }] },
    { name: 'Database', skills: [{ name: 'MySQL', usage: 'Data storage for web systems.', evidence: 'applied' }, { name: 'Database management', usage: 'Taught database design and management as a teaching assistant.', evidence: 'applied' }] },
    { name: 'AI and automation', skills: [{ name: 'AI automation', usage: 'Workflow design in my thesis and AI app.', evidence: 'project' }, { name: 'n8n', usage: 'Workflow automation in my thesis and AI app.', evidence: 'project' }, { name: 'GPT', usage: 'AI model in my thesis and AI app.', evidence: 'project' }, { name: 'Moodle', usage: 'TIEC-ID LMS and my thesis.', evidence: 'applied' }] },
    { name: 'Tools and workflow', skills: [{ name: 'Git', usage: 'Version control.', evidence: 'project' }, { name: 'Figma', usage: 'App prototype for competition.', evidence: 'project' }] },
  ],
}
