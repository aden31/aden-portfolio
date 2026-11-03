# Deploy, backup, dan restore

## Menyiapkan Supabase

1. Buat proyek di supabase.com.
2. Pasang Supabase CLI, lalu hubungkan: `supabase link --project-ref <ref>`.
3. Terapkan skema: `supabase db push`.
4. Masukkan data awal dengan menjalankan `supabase/seed.sql` di SQL Editor, satu kali saja.
5. Buat akun admin sesuai docs/auth-and-admin.md.
6. Tinjau **Advisors** di dasbor Supabase.

## Formulir kontak

```bash
supabase secrets set CONTACT_IP_HASH_SALT=<nilai-acak-panjang> SITE_URL=https://domain-anda
supabase functions deploy contact --no-verify-jwt
```

`SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` sudah tersedia otomatis di Edge Function. Pesan tersimpan di tabel `contact_messages`.

## Deploy ke Vercel

`vercel.json` sudah mengatur rute dan header keamanan.

1. Impor repository di Vercel. Preset: Vite. Perintah build `npm run build`, folder keluaran `dist`.
2. Sebelum Supabase ada: isi `VITE_CONTENT_SOURCE=static`. Situs memakai konten bawaan, dan formulir kontak diganti arahan ke email.
3. Setelah Supabase siap: isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`, lalu redeploy. Supabase otomatis diutamakan. Hapus `VITE_CONTENT_SOURCE`.

Variabel `VITE_` tertanam saat build, jadi perubahannya baru berlaku setelah redeploy.

## Backup

Sebelum mengubah skema produksi:

```bash
supabase db dump -f backup-schema.sql
supabase db dump --data-only -f backup-data.sql
```

Unduh juga isi bucket Storage, karena dump database tidak menyertakan berkasnya. Simpan backup di luar repository, karena berisi pesan kontak.

## Restore

Uji di proyek kosong terlebih dahulu:

```bash
psql "$DATABASE_URL" -f backup-schema.sql
psql "$DATABASE_URL" -f backup-data.sql
```

Lalu unggah kembali berkas Storage dengan path yang sama.
