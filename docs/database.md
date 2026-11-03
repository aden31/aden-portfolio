# Database

Skema: `supabase/migrations`. Data awal: `supabase/seed.sql`. Semua tabel memakai RLS.

## Aturan umum

- **Primary key:** `id uuid`, kecuali yang disebut di bawah.
- **Waktu:** `created_at` dan `updated_at`. `updated_at` diperbarui oleh trigger.
- **Publikasi:** kolom `status` bernilai `draft`, `published`, atau `archived`. Pengunjung hanya membaca `published`.
- **Verifikasi:** `needs_verification` dan `verification_note`. Check constraint menolak `published` selama `needs_verification` masih true. Berlaku di `projects`, `experiences`, `education`, `achievements`, `certificates`, `skills`, `expertise_areas`.
- **Tulis:** hanya pengguna di `admin_users`, lewat `is_admin()`.
- **URL:** kolom tautan wajib `https://`, sehingga skema seperti `javascript:` ditolak.
- **Audit:** trigger mencatat insert, update, dan delete pada tabel konten ke `audit_log`.

## Tabel

| Tabel | Tujuan | Kolom utama | Kunci dan constraint | Baca publik | Tulis |
| --- | --- | --- | --- | --- | --- |
| `admin_users` | Daftar admin | `user_id` | PK dan FK ke `auth.users` | Tidak. Pengguna hanya melihat barisnya sendiri | Manual di SQL Editor |
| `profiles` | Profil pemilik, satu baris | `full_name`, `headline`, `subheadline`, `status_label`, `about_*`, `soft_skills`, `closing_*`, `cta_*`, `contact_email` | PK boolean agar hanya satu baris. FK `portrait_media_id`, `cv_media_id` | Ya | Admin |
| `social_links` | Tautan sosial | `platform`, `label`, `url`, `sort_order`, `status` | Unique `platform` | Published | Admin |
| `site_settings` | Pengaturan kunci-nilai, termasuk `hero_pipeline` | `key`, `value`, `is_public` | PK `key` | Hanya `is_public` | Admin |
| `media_assets` | Metadata berkas | `bucket`, `path`, `kind`, `visibility`, `mime_type`, `size_bytes`, `alt_text` | Unique (`bucket`, `path`). Bucket harus cocok dengan visibility | Hanya `public` | Admin |
| `project_categories` | Kategori proyek | `name`, `slug`, `sort_order` | Unique `name`, `slug` | Ya | Admin |
| `technologies` | Daftar teknologi | `name`, `slug` | Unique `name`, `slug` | Ya | Admin |
| `projects` | Proyek | `slug`, `title`, `summary`, `problem`, `goals`, `solution`, `role`, `context`, `year`, `key_features[]`, `flow_steps[]`, `architecture_mermaid`, `challenges`, `verified_outcomes`, `project_status`, `demo_url`, `repo_url`, `is_featured`, `sort_order` | Unique `slug`. FK `category_id`, `cover_media_id`. Index (`status`, `is_featured`, `sort_order`) | Published | Admin |
| `project_images` | Galeri proyek | `caption`, `sort_order` | FK `project_id` (cascade), `media_id` (restrict). Unique pasangan | Mengikuti proyek | Admin |
| `project_technologies` | Relasi proyek dan teknologi | `sort_order` | PK komposit, FK | Mengikuti proyek | Admin |
| `experiences` | Pengalaman | `kind`, `organization`, `position`, `description`, `contributions[]`, `start_date`, `end_date`, `period_label`, `is_current` | Tanggal selesai tidak boleh sebelum mulai. Tanggal boleh kosong agar tidak dikarang | Published | Admin |
| `experience_technologies` | Relasi pengalaman dan teknologi | | PK komposit, FK | Mengikuti pengalaman | Admin |
| `education` | Pendidikan | `institution`, `faculty`, `program`, `start_year`, `end_year`, `gpa`, `gpa_scale`, `honors` | `gpa` tidak boleh melebihi `gpa_scale`. Kosongkan `gpa` agar tidak tampil | Published | Admin |
| `achievements` | Pencapaian | `title`, `description`, `category`, `organizer`, `achieved_on`, `achieved_year`, `event_period`, `credential_id`, `highlight_value`, `highlight_label`, `source_url`, `is_featured` | FK `proof_media_id`. `achieved_year` dipakai bila tanggal pasti belum ada | Published | Admin |
| `certificates` | Sertifikat | `title`, `issuer`, `issued_on`, `expires_on`, `credential_url`, `credential_id`, `program`, `training_period`, `training_hours` | FK `media_id` | Published | Admin |
| `skill_categories` | Kelompok keterampilan | `name`, `sort_order` | Unique `name` | Ya | Admin |
| `skills` | Keterampilan | `name`, `usage_description`, `evidence` | FK `category_id`. Unique (`category_id`, `name`) | Published | Admin |
| `expertise_areas` | Bidang keahlian homepage, lebih luas dari satu keterampilan | `title`, `description`, `evidence`, `tools[]` | Unique `title` | Published | Admin |
| `articles` | Artikel | `slug`, `title`, `excerpt`, `body_markdown`, `published_at` | Unique `slug`. FK `cover_media_id` | Published | Admin |
| `contact_messages` | Pesan kontak | `name`, `email`, `subject`, `message`, `ip_hash`, `status` | Batas panjang di setiap kolom. Index (`ip_hash`, `created_at`) | Tidak | Hanya service role. Admin baca, ubah, hapus |
| `audit_log` | Jejak perubahan | `actor_id`, `action`, `table_name`, `row_id` | PK identity. Hanya trigger yang menulis | Tidak. Admin baca | Trigger |

`evidence` bernilai `applied`, `project`, atau `learning`, menggantikan persentase keahlian.

## Storage

| Bucket | Akses | Tipe berkas | Batas |
| --- | --- | --- | --- |
| `public-media` | Baca publik, tulis admin | JPEG, PNG, WebP, AVIF, PDF | 10 MB |
| `private-media` | Hanya admin, dibagikan dengan signed URL | JPEG, PNG, WebP, PDF | 10 MB |

SVG sengaja tidak diizinkan karena dapat memuat skrip.

## Mengubah skema

Tambahkan berkas baru di `supabase/migrations`, jalankan `npm test`, lalu terapkan ke proyek staging sebelum produksi. Migration yang sudah diterapkan tidak diedit.
