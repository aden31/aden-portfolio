-- Initial content. Sources for every fact are listed in docs/content-sources.md.
-- Nothing marked needs_verification can be published until an admin confirms it and clears the flag.
-- Images and the CV are uploaded through the CMS; see docs/content-sources.md.

insert into public.profiles (
  full_name, headline, subheadline, status_label, short_bio, about_statement, about_points,
  about_body, soft_skills, contact_email, closing_headline, closing_body
) values (
  'Aden Lutfil Irsyadi',
  'Building digital solutions that matter.',
  'I''m Aden Lutfil Irsyadi, an Informatics Engineering graduate focused on building practical digital solutions through software development, system design, and automation.',
  'Fresh graduate, Informatics Engineering',
  'Informatics Engineering graduate, UIN Alauddin Makassar.',
  'Good software starts before the first line of code.',
  array[
    'I start by understanding what people actually need, then design the system around it.',
    'I work across the database, the interface, and the backend, so the parts fit together.',
    'I connect tools and APIs to remove repetitive work, and keep people in the loop where judgment matters.'
  ],
  'I studied Informatics Engineering at UIN Alauddin Makassar, focusing on software development, databases, artificial intelligence, data processing, and web-based systems. Along the way I built web systems during my internship, designed content and learning platforms for organizations, and assisted the Database course as a teaching assistant. For competitions, I built Autovizu, an AI mobile app that helps small businesses create product designs.',
  array['Problem solving', 'Critical thinking', 'Communication', 'Teamwork', 'Project management', 'Adaptability'],
  'adenlutfil@gmail.com',
  'Have a problem worth solving?',
  'I''m looking for opportunities to build useful software. Take a look at the work, or get in touch.'
);

insert into public.social_links (platform, label, url, sort_order, status) values
  ('linkedin', 'LinkedIn', 'https://www.linkedin.com/in/aden-lutfil-irsyadi-0827b12b9', 0, 'published'),
  ('github', 'GitHub', 'https://github.com/aden31', 1, 'draft');

insert into public.site_settings (key, value, is_public) values (
  'hero_pipeline',
  '[
    {"id":"need","label":"Need","detail":"Understand the real problem and who has it."},
    {"id":"schema","label":"Schema","detail":"Design the system and the data behind it."},
    {"id":"interface","label":"Interface","detail":"Build screens people can use without a manual."},
    {"id":"backend","label":"Backend","detail":"Implement the logic, the APIs, and the rules."},
    {"id":"automation","label":"Automation","detail":"Connect the workflow, with a person reviewing what matters."}
  ]'::jsonb,
  true
);

insert into public.education (institution, faculty, program, start_year, end_year, gpa, gpa_scale, honors, description, status)
values ('Universitas Islam Negeri Alauddin Makassar', 'Fakultas Sains dan Teknologi', 'Teknik Informatika',
        2022, 2026, 3.72, 4.00, 'Cumlaude',
        'Focus on software development, databases, artificial intelligence, and web-based systems.', 'published');

insert into public.achievements
  (title, description, category, organizer, achieved_on, achieved_year, event_period, credential_id,
   highlight_value, highlight_label, is_featured, sort_order, status)
values
  ('Graduated with honors', 'Teknik Informatika, UIN Alauddin Makassar.', 'academic', null, null, 2026, null, null,
   '3.72', 'GPA out of 4.00, Cumlaude', true, 0, 'published'),
  ('Gold Medal, International Student Summit',
   'Essay competition. Presented a Figma prototype of Autovizu, my AI product design app for small businesses.', 'competition',
   'Sentosa Foundation with INSAN USIM, Universiti Sains Islam Malaysia, and World Association of Young Scientists',
   '2025-10-18', 2025, '18–19 October 2025', '002/ECO&LAW/ISS/SF/INSAN/USIM/WAYS/X/2025',
   'Gold', 'Malaysia, 2025', true, 1, 'published'),
  ('Silver Medal, International Future Leaders Competition',
   'Essay competition. Presented the finished Autovizu app, updated with auto caption.', 'competition',
   'Sentosa Foundation with the Arabic Literature Students Association of Gadjah Mada University',
   '2026-07-25', 2026, '25–26 July 2026', '008/E/SE/IFLC/SF-IKMASA-UGM/VII/2026',
   'Silver', 'Yogyakarta, 2026', true, 2, 'published'),
  ('3rd Winner, International Student Summit',
   'Essay competition. Presented a Figma prototype of Autovizu, my AI product design app for small businesses.', 'competition',
   'Sentosa Foundation with INSAN USIM, Universiti Sains Islam Malaysia, and World Association of Young Scientists',
   '2025-10-18', 2025, '18–19 October 2025', '010/WINNER/ISS/SF/INSAN/USIM/WAYS/X/2025',
   '3rd', 'Malaysia, 2025', false, 3, 'published');

insert into public.certificates
  (title, issuer, program, training_period, training_hours, issued_on, credential_id, sort_order, status)
values
  ('Teknisi Utama Jaringan Komputer', 'BBPSDMP Makassar, Komdigi', 'Vocational School Graduate Academy, Digital Talent Scholarship 2025',
   '5–7 July 2025', 24, '2025-07-16', '193106651060-14/VSGA/BLSDM.Komdigi/2025', 0, 'published'),
  ('Associate Data Scientist', 'BBPSDMP Makassar, Kominfo', 'Vocational School Graduate Academy, Digital Talent Scholarship 2024',
   '18–23 March 2024', 30, '2024-03-29', '19377581060-208/VSGA/BLSDM.Kominfo/2024', 1, 'published'),
  ('Operator Komputer Madya', 'Kominfo', 'Vocational School Graduate Academy, Digital Talent Scholarship 2023',
   '28 March – 1 April 2023', 24, '2023-10-03', '19360551060-76/VSGA/BLSDM.Kominfo/2023', 2, 'published'),
  ('Kewirausahaan Digital Dasar', 'Kominfo', 'Digital Entrepreneurship Academy, Digital Talent Scholarship 2023',
   '12–13 August 2023', 13, '2023-08-30', '19669571060-258/DEA/BLSDM.Kominfo/2023', 3, 'published'),
  ('Pengantar Mindset Digital 1', 'Pusat Pengembangan Literasi Digital, Komdigi', 'Micro Skill, Digital Talent Scholarship 2025',
   '2025', 2, '2025-07-07', '2299815850-7300/MS/BLSDM.Komdigi/2025', 4, 'published');

insert into public.experiences
  (kind, organization, position, description, contributions, start_date, end_date, period_label, sort_order,
   status, needs_verification, verification_note)
values
  ('academic', 'Universitas Islam Negeri Alauddin Makassar', 'Teaching assistant, Basis Data',
   'Assisted lectures and practical sessions for the Database course.',
   array['Guided students in designing and managing databases.', 'Helped students finish assignments and projects, and supported learning evaluation.'],
   '2025-08-01', '2025-12-31', null, 0, 'published', false, null),
  ('professional', 'Kementerian Hukum Sulawesi Selatan', 'Intern, Divisi Humas',
   'Built two web-based systems during my internship in the Public Relations Division.',
   array['Developed SIMANIS, a letter service system for prospective interns, with CodeIgniter.', 'Developed a public satisfaction survey system with Laravel to support evaluation of service quality.'],
   '2025-02-01', '2025-03-31', null, 1, 'published', false, 'No certificate exists.'),
  ('organizational', 'Inready Workgroup', 'Divisi Humas',
   'A student workgroup at UIN Alauddin Makassar focused on software development and digital technology.',
   array['Managed communication and publications on Instagram, and acted as the link to external parties.', 'Coordinated organization events, including exhibitions, seminars, inaugurations, and outdoor activities.'],
   '2024-04-01', '2026-07-31', null, 2, 'published', false, null);

insert into public.project_categories (name, slug, sort_order) values
  ('Web Applications', 'web-applications', 0),
  ('Learning Platforms', 'learning-platforms', 1),
  ('AI Automation', 'ai-automation', 2),
  ('Information Systems', 'information-systems', 3),
  ('Dashboards', 'dashboards', 4),
  ('Research and Academic Projects', 'research-academic', 5);

insert into public.technologies (name, slug) values
  ('Moodle', 'moodle'),
  ('n8n', 'n8n'),
  ('GPT-4', 'gpt-4'),
  ('Exponential Moving Average', 'exponential-moving-average'),
  ('Flutter', 'flutter'),
  ('Dart', 'dart'),
  ('GPT', 'gpt'),
  ('Figma', 'figma'),
  ('CodeIgniter', 'codeigniter'),
  ('Laravel', 'laravel'),
  ('PHP', 'php'),
  ('Node.js', 'node-js');

insert into public.projects
  (slug, title, summary, context, problem, solution, role, key_features, flow_steps, category_id, year,
   project_status, demo_url, is_featured, sort_order, status)
values
  ('remedial-learning-automation', 'AI automation for personalized remedial learning',
   'Connects a Moodle LMS, n8n workflows, and quiz results to draft remedial questions for a teacher to review.',
   'Undergraduate thesis. Perancangan AI Automation Berbasis n8n untuk Personalisasi Pelatihan Remedial Pada LMS: Studi Kasus Bimbel TIEC ID Takalar.', 'Preparing remedial practice that fits each student takes time after every evaluation.', 'Quiz results flow from Moodle into an n8n workflow that drafts remedial questions with GPT-4. A person reviews each draft before it reaches the question bank.', 'Designed and built the automation as my undergraduate thesis.',
   array['Quiz evaluation intake from Moodle', 'Exponential Moving Average in the evaluation data', 'n8n workflow automation', 'AI-assisted question drafts', 'Human review before publishing'], array['Moodle quiz results', 'n8n workflow', 'GPT-4 question draft', 'Human review', 'Question bank'],
   (select id from public.project_categories where slug = 'ai-automation'), 2026, 'completed', null,
   true, 0, 'published'),
  ('autovizu', 'Autovizu',
   'An AI mobile app that turns a photo of a product into a marketing design, so small businesses can promote what they sell.',
   'Built for two essay competitions. I presented it as a Figma prototype at the International Student Summit in Malaysia, then as a finished app with auto caption at the International Future Leaders Competition in Yogyakarta.', 'Small businesses need product designs for marketing, and many have no easy way to make them.', 'The user takes a photo of a product and the app creates the design. An n8n workflow connects the app to a GPT model.', 'Designed and built the app.',
   array['Product design from a single photo', 'Auto caption', 'Menu layout when several products are uploaded, such as food items'], array['Product photo', 'Flutter app', 'n8n workflow', 'GPT model', 'Design and caption'],
   (select id from public.project_categories where slug = 'ai-automation'), 2026, 'completed', null,
   true, 1, 'published'),
  ('simanis', 'SIMANIS',
   'A web-based service for requesting research and internship permit letters at Kanwil Kementerian Hukum Sulawesi Selatan, with letter tracking.',
   'Built during my internship in the Public Relations Division, Kementerian Hukum Sulawesi Selatan.', '', '', 'Developed the system during the internship.',
   array['Online requests for research and internship letters', 'Letter tracking to follow each request', 'Accessible from anywhere'], '{}',
   (select id from public.project_categories where slug = 'information-systems'), 2025, null, 'http://simanis.kemenkumsulsel.id/',
   true, 2, 'published'),
  ('public-satisfaction-survey', 'Public satisfaction survey system',
   'A web-based survey system that supports evaluation of public service quality at Kementerian Hukum Sulawesi Selatan.',
   'Built during my internship in the Public Relations Division, Kementerian Hukum Sulawesi Selatan.', '', '', 'Developed the system during the internship.',
   '{}', '{}',
   (select id from public.project_categories where slug = 'information-systems'), 2025, null, null,
   false, 3, 'published'),
  ('tiec-id-web-platform', 'TIEC-ID Takalar website',
   'The website of Takalar International Education Centre Indonesia, a tutoring institution, with a CMS for news, galleries, fee information, and student resources.',
   '', '', '', 'Designed and developed the CMS and website.',
   '{}', '{}',
   (select id from public.project_categories where slug = 'web-applications'), 2025, null, 'https://tiec-id.com',
   false, 4, 'published'),
  ('tiec-id-lms', 'TIEC-ID Takalar LMS',
   'A Moodle learning platform for the tutoring institution, with courses for junior and senior high students, intensive classes, and practice tryouts.',
   '', '', '', 'Designed and developed the LMS.',
   '{}', '{}',
   (select id from public.project_categories where slug = 'learning-platforms'), 2025, null, 'https://lms.tiec-id.com',
   false, 5, 'published'),
  ('jasuda', 'JASUDA',
   'A CMS and company website for JaSuDa, covering its seaweed business, products, partners, media, and price information.',
   '', '', '', 'Designed and developed the CMS and website.',
   '{}', '{}',
   (select id from public.project_categories where slug = 'web-applications'), 2026, null, 'https://baru.jasuda.net',
   false, 6, 'published'),
  ('posko-jasuda', 'Posko JaSuDa',
   'The website of CV Posko JaSuDa, a seaweed trading company, with its profile, documents, and team.',
   '', '', '', 'Built the website.',
   '{}', '{}',
   (select id from public.project_categories where slug = 'web-applications'), null, null, 'https://gudang.jasuda.net',
   false, 7, 'published'),
  ('arli', 'ARLI',
   'The website of Asosiasi Rumput Laut Indonesia, the Indonesian Seaweed Association, with its programs, news, galleries, and member directory.',
   '', '', '', 'Built the website.',
   '{}', '{}',
   (select id from public.project_categories where slug = 'web-applications'), null, null, 'https://arli.or.id',
   false, 8, 'published'),
  ('kpm-fst-uin-alauddin', 'KPM FST UIN Alauddin Makassar',
   'A CMS and website for the quality assurance committee of the Faculty of Science and Technology, publishing quality documents, evaluations, accreditation status, and activities.',
   '', '', '', 'Designed and developed the CMS and website.',
   '{}', '{}',
   (select id from public.project_categories where slug = 'web-applications'), 2026, null, 'https://kpm.uin-alauddin.com',
   false, 9, 'published'),
  ('yapensa', 'Yapensa',
   'The website of Yayasan Pensa Global Agromandiri, a foundation that supports farmers and rural communities in Sulawesi.',
   '', '', '', 'Built the website.',
   '{}', '{}',
   (select id from public.project_categories where slug = 'web-applications'), null, null, 'https://yapensa.or.id',
   false, 10, 'published'),
  ('irsyadi-family-site', 'irsyadi.com',
   'A shared family website with profile pages, portfolios, photos, and archived projects.',
   '', '', '', 'Built the website.',
   '{}', '{}',
   (select id from public.project_categories where slug = 'web-applications'), null, null, 'https://irsyadi.com',
   false, 11, 'published');

insert into public.project_technologies (project_id, technology_id, sort_order)
select p.id, t.id, x.ord
from (values
  ('remedial-learning-automation', 'moodle', 0),
  ('remedial-learning-automation', 'n8n', 1),
  ('remedial-learning-automation', 'gpt-4', 2),
  ('remedial-learning-automation', 'exponential-moving-average', 3),
  ('autovizu', 'flutter', 0),
  ('autovizu', 'dart', 1),
  ('autovizu', 'n8n', 2),
  ('autovizu', 'gpt', 3),
  ('autovizu', 'figma', 4),
  ('simanis', 'codeigniter', 0),
  ('public-satisfaction-survey', 'laravel', 0),
  ('tiec-id-web-platform', 'php', 0),
  ('tiec-id-lms', 'moodle', 0),
  ('posko-jasuda', 'node-js', 0),
  ('arli', 'node-js', 0),
  ('kpm-fst-uin-alauddin', 'php', 0),
  ('yapensa', 'php', 0),
  ('irsyadi-family-site', 'php', 0)
) as x (project_slug, tech_slug, ord)
join public.projects p on p.slug = x.project_slug
join public.technologies t on t.slug = x.tech_slug;

insert into public.expertise_areas (title, description, evidence, tools, sort_order, status, needs_verification, verification_note)
values
  ('Web development', 'Web systems and CMS platforms built for an institution, organizations, and a company.', 'applied', array['PHP', 'Laravel', 'CodeIgniter', 'Node.js', 'JavaScript', 'HTML', 'CSS'], 0, 'published', false, null),
  ('Backend and database', 'Application logic and data, plus teaching database design as an assistant.', 'applied', array['PHP', 'MySQL', 'REST API'], 1, 'published', false, null),
  ('LMS integration', 'A Moodle LMS for TIEC-ID Takalar, and Moodle integration in my thesis.', 'applied', array['Moodle'], 2, 'published', false, null),
  ('Software development', 'Building applications from requirements through delivery.', 'project', array['Flutter', 'Dart', 'Git'], 3, 'published', false, null),
  ('System design', 'Analysis and design of information systems.', 'project', '{}', 4, 'published', false, null),
  ('AI automation', 'Workflows that connect systems and AI services.', 'project', array['n8n', 'GPT'], 5, 'published', false, null),
  ('Data science', 'Completed 30 hours of Associate Data Scientist training.', 'learning', '{}', 6, 'published', false, null),
  ('Quality assurance', 'Software testing.', 'project', '{}', 7, 'draft', true, 'Not in the resume. Confirm which tests and projects to cite.');

insert into public.skill_categories (name, sort_order) values
  ('Programming languages', 0), ('Frontend development', 1), ('Backend development', 2), ('Database', 3),
  ('AI and automation', 4), ('Tools and workflow', 5), ('Software testing', 6);

insert into public.skills (category_id, name, usage_description, evidence, sort_order, status, needs_verification, verification_note)
select c.id, x.name, x.usage, x.evidence::public.evidence_level, x.ord, x.status::public.publish_status, x.review, x.note
from (values
  ('Programming languages', 'PHP', 'Web systems and CMS platforms.', 'applied', 0, 'published', false, null),
  ('Programming languages', 'JavaScript', 'Interactive web interfaces.', 'applied', 1, 'published', false, null),
  ('Programming languages', 'Dart', 'Mobile app built with Flutter.', 'project', 2, 'published', false, null),
  ('Frontend development', 'HTML', 'Website structure.', 'applied', 0, 'published', false, null),
  ('Frontend development', 'CSS', 'Website layout and styling.', 'applied', 1, 'published', false, null),
  ('Frontend development', 'Flutter', 'Autovizu, an AI product design app.', 'project', 2, 'published', false, null),
  ('Frontend development', 'React', '', 'project', 3, 'draft', true, 'Named in the brief, not in the resume. Confirm where it was used.'),
  ('Frontend development', 'Bootstrap', '', 'project', 4, 'draft', true, 'Confirm from the project source.'),
  ('Frontend development', 'Chart.js', '', 'project', 5, 'draft', true, 'Confirm from the project source.'),
  ('Backend development', 'REST API', 'Connecting systems and services.', 'applied', 0, 'published', false, null),
  ('Backend development', 'Laravel', 'Public satisfaction survey system.', 'applied', 1, 'published', false, null),
  ('Backend development', 'CodeIgniter', 'SIMANIS letter service system.', 'applied', 2, 'published', false, null),
  ('Backend development', 'Node.js', 'Posko JaSuDa and ARLI websites.', 'applied', 3, 'published', false, null),
  ('Database', 'MySQL', 'Data storage for web systems.', 'applied', 0, 'published', false, null),
  ('Database', 'Database management', 'Taught database design and management as a teaching assistant.', 'applied', 1, 'published', false, null),
  ('AI and automation', 'AI automation', 'Workflow design in my thesis and AI app.', 'project', 0, 'published', false, null),
  ('AI and automation', 'n8n', 'Workflow automation in my thesis and AI app.', 'project', 1, 'published', false, null),
  ('AI and automation', 'GPT', 'AI model in my thesis and AI app.', 'project', 2, 'published', false, null),
  ('AI and automation', 'Moodle', 'TIEC-ID LMS and my thesis.', 'applied', 3, 'published', false, null),
  ('Tools and workflow', 'Git', 'Version control.', 'project', 0, 'published', false, null),
  ('Tools and workflow', 'Figma', 'App prototype for competition.', 'project', 1, 'published', false, null),
  ('Software testing', 'Software testing', '', 'project', 0, 'draft', true, 'Not in the resume. Confirm before publishing.')
) as x (category, name, usage, evidence, ord, status, review, note)
join public.skill_categories c on c.name = x.category;
