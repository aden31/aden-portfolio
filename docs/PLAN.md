# Rencana implementasi

## 1. Ringkasan kebutuhan

Portofolio profesional untuk Aden Lutfil Irsyadi, fresh graduate Teknik Informatika, dengan CMS yang benar-benar berfungsi. Pemilik mengelola seluruh konten tanpa menyentuh kode. Tiga aturan mengarahkan seluruh keputusan:

- **Hanya fakta yang terverifikasi yang tampil ke publik.** Tidak ada metrik, tanggal, jabatan, atau klaim karangan.
- **Tidak ada elemen palsu.** Tombol, tautan, dan formulir harus bekerja atau tidak ditampilkan.
- **Keamanan ditegakkan di database,** bukan di route guard frontend.

## 2. Rekomendasi arsitektur

| Bagian | Keputusan | Alasan |
| --- | --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4 | Sesuai brief. Token tema ada di satu blok `@theme`. |
| Animasi | Motion saja | Jalur scroll bisa dibuat dengan Motion, jadi GSAP belum dibutuhkan. |
| Backend | Supabase: Auth, Postgres, Storage, Edge Functions | Sesuai pilihan utama brief. Tidak perlu server sendiri. |
| Otorisasi | Tabel `admin_users`, fungsi `is_admin()`, RLS di setiap tabel | Akun yang login tidak otomatis menjadi admin. |
| Publikasi | `publish_status` ditambah `needs_verification` | Check constraint menolak publikasi konten yang belum diverifikasi. |
| Formulir kontak | Edge Function dengan service role | Pengunjung tidak punya akses tulis langsung, dan rate limit ada di server. |
| SEO | SPA, ditambah prerender halaman publik saat build (tahap 8) | Lebih sederhana daripada SSR. Build dipicu ulang saat konten dipublikasikan. |
| Hosting | Vercel, Netlify, atau Cloudflare Pages | Hosting statis. Lihat docs/deployment.md. |

Pengambilan data lewat lapisan `src/services`, sehingga komponen tidak tahu asal datanya.

## 3. Sitemap

Publik: `/`, `/about`, `/projects`, `/projects/:slug`, `/experience`, `/achievements`, `/skills`, `/contact`.

Pendidikan tampil di `/about` dan `/experience`. Halaman `/education` tersendiri dan `/articles` dapat ditambahkan pada tahap 4 bila dibutuhkan.

Admin: `/admin/login`, `/admin`, `/admin/profile`, `/admin/projects`, `/admin/experience`, `/admin/education`, `/admin/achievements`, `/admin/skills`, `/admin/certificates`, `/admin/articles`, `/admin/media`, `/admin/settings`.

## 4. Design system awal

Warna (semua token ada di `src/styles/index.css`):

| Token | Nilai | Peran |
| --- | --- | --- |
| `ink` | `#0A0A0B` | Latar utama |
| `charcoal` | `#121315` | Latar sekunder |
| `surface` | `#1A1B1F` | Permukaan |
| `paper` | `#F4F4F2` | Teks utama |
| `muted` | `#A1A1AA` | Teks sekunder |
| `lime` | `#C6F36A` | Aksen: CTA utama, jalur, fokus |
| `line`, `line-strong` | paper 14% dan 28% | Garis tipis |

Tipografi: Big Shoulders Display untuk headline, karena sempit sehingga tetap besar di ponsel. Geist untuk isi, Geist Mono untuk metadata. Font di-bundle lokal.

Elemen khas: **jalur sirkuit**. Satu garis lime mulai dari pipeline Need sampai Automation di hero, berkelok melintasi halaman sebagai pembatas antarbagian, dan berakhir di tombol kontak. Garis tergambar mengikuti scroll, dan berada di gutter sehingga tidak menabrak teks. Ini memvisualisasikan posisi Aden: menghubungkan kebutuhan nyata dengan solusi.

Aturan: aksen dipakai hemat, tidak ada gradient neon, tidak ada persentase keahlian. Animasi otomatis hanya pada pemuatan hero dan jalur scroll. Semua hormat pada `prefers-reduced-motion`.

Responsif: titik ubah utama 900px untuk hero, 1024px untuk grid dan navigasi. Di ponsel urutan hero berubah: headline, teks, CTA, foto, pipeline.

## 5. Struktur database CMS

Lihat [database.md](database.md). Ringkasnya:

- Konten: `profiles`, `projects`, `experiences`, `education`, `achievements`, `certificates`, `skills`, `expertise_areas`, `articles`
- Pendukung: `project_categories`, `technologies`, `project_technologies`, `project_images`, `experience_technologies`, `skill_categories`, `social_links`, `site_settings`
- Sistem: `admin_users`, `media_assets`, `contact_messages`, `audit_log`

## 6. Struktur direktori

```
src/components   komponen bersama (Trace, ActionLink)
src/layouts      kerangka publik, header
src/pages        halaman
src/features     bagian per fitur (home, nanti admin)
src/hooks        useHomeContent, useTracePath
src/lib          env, klien Supabase
src/services     pengambilan dan pemetaan data
src/types        tipe konten
src/data         data contoh, hanya untuk pengembangan
src/routes       definisi rute
src/styles       token dan CSS dasar
supabase/        migrations, seed.sql
tests/           Vitest, termasuk tests/db untuk RLS
e2e/             Playwright
docs/            dokumentasi
```

## 7. Rencana implementasi

| Tahap | Isi | Status |
| --- | --- | --- |
| 1 | Audit dan perencanaan | Selesai |
| 2 | Design system | Selesai |
| 3 | Homepage publik | Selesai |
| 4 | Halaman About, Projects, detail, Experience, Achievements, Skills, Contact | Selesai dengan konten pratinjau |
| 5 | Auth admin, CRUD, media library | Berikutnya. Skema dan RLS sudah ada |
| 6 | Integrasi semua halaman dengan database | Lapisan data siap, belum diuji di Supabase asli |
| 7 | Penghalusan animasi | Belum |
| 8 | Audit keamanan, performa, SEO, prerender | Belum |
| 9 | Pengujian penuh dan deploy | Belum |

## 8. Risiko teknis

| Risiko | Dampak | Penanganan |
| --- | --- | --- |
| Data proyek belum lengkap | Halaman detail tipis | Tampilkan hanya bagian yang ada. Butuh source code atau catatan dari pemilik. |
| SEO pada SPA | Mesin pencari dan pratinjau tautan lemah | Prerender pada tahap 8. |
| Prerender berbasis build | Konten baru terlambat tampil di HTML statis | Deploy hook setelah publikasi. |
| RLS diuji dengan PGlite dan stub Auth/Storage | Perbedaan kecil dengan Supabase asli | Ulangi pengujian di proyek Supabase sebelum rilis. |
| Data internal instansi di screenshot | Kebocoran data | Tinjau setiap gambar sebelum publikasi, gunakan data dummy. |
| Ukuran bundle awal 136 kB gzip | Muat awal di ponsel | Lazy route dan `LazyMotion` pada tahap 8. |
| Satu pemilik satu akun admin | Akses bisa hilang | Pulihkan lewat reset password dan dasbor Supabase. Lihat docs/auth-and-admin.md. |

## 9. Informasi profil

Dipindahkan ke [content-sources.md](content-sources.md), berisi sumber setiap fakta, perbedaan antardokumen, dan yang masih menunggu pemilik.
