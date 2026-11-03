# Sumber konten

Catatan asal setiap fakta di situs. Bila dokumen berbeda, sertifikat asli yang dipakai.

## Sumber

| Kode | Dokumen |
| --- | --- |
| R | Resume PDF |
| S | Sertifikat asli |
| P | Pernyataan pemilik di percakapan |
| B | Brief awal |

## Fakta yang dipublikasikan

| Konten | Sumber |
| --- | --- |
| Nama, IPK 3,72/4,00, Cumlaude, Teknik Informatika 2022–2026 | B, R |
| Asisten Dosen Basis Data, Sep–Des 2025 | R |
| Magang Divisi Humas Feb–Mar 2025, dua aplikasi | P, R. Tidak ada sertifikat |
| Inready Workgroup, Divisi Humas, Apr 2024–Jul 2026 | R |
| Gold Medal dan 3rd Winner, International Student Summit, 18–19 Okt 2025 | S |
| Silver Medal, International Future Leaders Competition, 25–26 Jul 2026 | S |
| Lima sertifikat pelatihan Digital Talent Scholarship | S |
| Peran dan tahun proyek TIEC-ID, JASUDA, KPM FST | R |
| Skripsi: selesai, GPT-4, EMA, n8n, judul | P |
| Stack dan tautan semua proyek, SIMANIS = sistem persuratan | P |
| Autovizu: Flutter, n8n, GPT, fitur, Figma di Malaysia, aplikasi jadi di Yogyakarta | P |
| Deskripsi JASUDA, ARLI, TIEC-ID, KPM FST, Yapensa, irsyadi.com, LMS | Isi situs masing-masing, dibaca 3 November 2026 |
| Daftar keterampilan yang dipublikasikan | R dan P. Moodle dari B dan P |
| LinkedIn dan email | P |

## Perbedaan yang ditemukan

| Item | Dokumen lain | Sertifikat atau keputusan |
| --- | --- | --- |
| Tahun medali perak | B dan satu baris R: 2025. Baris lain R: 2026 | **25–26 Juli 2026.** Perbaiki resume |
| "Juara 1" | R | Sertifikat hanya menyebut Gold Medal, dan ada 3rd Winner pada acara yang sama. Situs memakai "Gold Medal" |
| "Juara 2" | R | Sertifikat hanya menyebut Silver Medal |
| "Kompetisi esai" | B, P | Tidak tertulis di sertifikat. Pemilik mengonfirmasi, jadi situs menyebutnya |
| 3rd Winner | Tidak ada di R | Ada sertifikatnya, ditambahkan ke halaman Achievements |
| "Jasuda Net" | B | R menulis JASUDA. Situs memakai JASUDA |
| URL LinkedIn | R: `/in/aden-lutfil-0827b12b9` | Pemilik mengonfirmasi `/in/aden-lutfil-irsyadi-0827b12b9`. Perbaiki resume |
| SIMANIS memakai Laravel | B | Pemilik: CodeIgniter. Laravel dipakai di sistem survei |
| React, Bootstrap, Chart.js | B | Tidak ada di R dan belum dikonfirmasi. Disimpan sebagai draft |
| Software testing, QA | B | Tidak ada di R. Disimpan sebagai draft |
| Sertifikat "Associate Data Scientist" | | Sertifikat pelatihan 30 jam, bukan lisensi profesi. Situs menyatakannya dengan jelas |

## Sengaja tidak dipublikasikan

- Nomor telepon dan alamat rumah dari resume.
- Berkas CV. Tombol Download CV muncul setelah CV diunggah ke CMS. Sebelum itu, hapus alamat dan telepon, lalu perbaiki tahun medali perak dan URL LinkedIn di resume.
- GitHub. Akunnya masih kosong, jadi disimpan sebagai draft di `social_links`. Ubah ke published setelah ada repository.

## Berkas untuk diunggah ke CMS

Ada di `src/data/assets`. Setelah CMS jadi, unggah dan hubungkan:

| Berkas | Tujuan |
| --- | --- |
| `portrait.webp` | Foto profil. Hasil olahan: latar merah diganti, hitam-putih, wajah tidak diretus |
| `certificates/iss-gold-medal.webp` | Bukti Gold Medal |
| `certificates/iss-3rd-winner.webp` | Bukti 3rd Winner |
| `certificates/iflc-silver-medal.webp` | Bukti Silver Medal |
| `certificates/network.webp`, `data-scientist.webp`, `operator.webp`, `entrepreneurship.webp`, `mindset.webp` | Gambar sertifikat pelatihan |

## Masih menunggu pemilik

- Screenshot yang aman untuk setiap proyek.
- Perbaikan resume sebelum diunggah sebagai CV: URL LinkedIn, tahun medali perak, alamat, dan nomor telepon.

Pemilik sudah menyetujui nama Autovizu, penulisan GPT-4, rumusan masalah, tautan irsyadi.com, dan tautan gudang.jasuda.net untuk JASUDA.
