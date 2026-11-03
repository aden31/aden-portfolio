# Portofolio Aden Lutfil Irsyadi

Situs portofolio dengan CMS. React, TypeScript, Vite, Tailwind CSS, Motion, dan Supabase.

Status saat ini: **tahap 1 sampai 4**. Lihat [docs/status.md](docs/status.md) untuk rincian yang sudah dan belum selesai.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
```

Tanpa `.env`, mode pengembangan memakai data contoh dan menampilkan pemberitahuan di atas halaman.
Build produksi tidak pernah memakai data contoh: tanpa konfigurasi Supabase, halaman menampilkan pesan galat.

Untuk memakai database, salin `.env.example` menjadi `.env`, lalu ikuti [docs/deployment.md](docs/deployment.md).

## Pemeriksaan

```bash
npm run typecheck
npm run lint
npm test           # komponen, layanan data, dan kebijakan RLS pada Postgres (PGlite)
npm run test:e2e   # Playwright
npm run build
```

Berkas pratinjau tunggal: `npx vite build --mode preview-file` (hasil di `dist-preview/index.html`).

## Dokumentasi

- [docs/PLAN.md](docs/PLAN.md): kebutuhan, arsitektur, sitemap, design system, rencana, risiko, status data profil
- [docs/content-sources.md](docs/content-sources.md): sumber setiap fakta dan perbedaan antardokumen
- [docs/database.md](docs/database.md): rujukan tabel dan aturan akses
- [docs/auth-and-admin.md](docs/auth-and-admin.md): autentikasi dan pembuatan akun admin pertama
- [docs/deployment.md](docs/deployment.md): deploy, backup, dan restore
- [docs/status.md](docs/status.md): fitur selesai dan tertunda
