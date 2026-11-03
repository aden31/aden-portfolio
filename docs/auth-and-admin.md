# Autentikasi dan admin

Halaman login belum dibuat (tahap 5). Kebijakan database yang mengandalkannya sudah aktif.

## Cara kerja

- Login dan reset password memakai Supabase Auth, yang memiliki rate limit bawaan.
- Akun yang login belum tentu admin. Hanya `user_id` di `admin_users` yang lolos `is_admin()`.
- Pemeriksaan terjadi di RLS, jadi tetap berlaku walaupun frontend dilewati.
- `admin_users` tidak bisa diubah lewat API, sehingga pengguna tidak dapat mengangkat dirinya sendiri.

## Membuat akun admin pertama

Tidak ada password bawaan.

1. Di dasbor Supabase, buka **Authentication > Sign In / Providers**, lalu matikan pendaftaran publik.
2. Buka **Authentication > Users > Add user**. Masukkan email Anda dan password yang kuat dan unik.
3. Salin UUID pengguna tersebut.
4. Di **SQL Editor**, jalankan:

   ```sql
   insert into public.admin_users (user_id) values ('UUID-PENGGUNA');
   ```

Mematikan pendaftaran publik wajib, karena halaman admin tidak butuh akun baru dari luar.

## Secret

- `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` aman dikirim ke browser, karena dibatasi RLS.
- Service-role key hanya boleh menjadi secret Edge Function. Jangan pernah memberinya awalan `VITE_`.
