# Status

## Selesai dan teruji

- Design system dan token tema
- Semua halaman publik: Home, About, Projects (cari, filter, urut), detail proyek, Experience, Achievements, Skills, Contact
- Konten dari resume dan sertifikat. Lihat docs/content-sources.md
- Animasi: transisi halaman, progres scroll, teks reveal, galeri horizontal, marquee, spotlight hero, timeline, count-up, dan kartu ID yang bisa ditarik
- Jalur sirkuit mengikuti scroll, reduced motion, navigasi mobile, skip link, dialog sertifikat
- Halaman 404, dan pesan galat dengan tombol coba lagi
- Skema database, RLS, audit log, aturan verifikasi, bucket Storage (diuji di PGlite dengan stub Supabase)
- Pemetaan data dari Supabase (diuji dengan klien tiruan)
- Logika formulir kontak: validasi, honeypot, rate limit, dan pesan sukses hanya setelah tersimpan (diuji dengan penyimpanan tiruan)

## Belum diuji

- Deploy sungguhan ke Vercel, termasuk `vercel.json`

- Koneksi ke proyek Supabase asli
- Edge Function `contact` yang berjalan sungguhan
- Kebijakan `storage.objects`: struktur diuji, penegakan belum
- Perangkat fisik Android dan iPhone
- Core Web Vitals

## Belum dibuat

- Seluruh area admin dan login (tahap 5)
- Notifikasi email saat ada pesan kontak. Pesan tersimpan di tabel `contact_messages`
- Halaman artikel, dan render diagram Mermaid
- Sitemap, robots.txt, structured data, prerender
- Skenario end-to-end CMS
