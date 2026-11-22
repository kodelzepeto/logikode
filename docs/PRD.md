# Product Requirements Document (PRD) — LogiKode

**Versi Dokumen:** 1.0.0  
**Status:** Draf Aktif (Fase 0)  
**Pemilik Produk:** [Core Dev Group](https://core-dev-group.my.id)  
**URL:** [https://core-dev-group.my.id](https://core-dev-group.my.id)  

---

## 1. Ringkasan Eksekutif & Visi Produk

**LogiKode** adalah platform edukasi interaktif berbasis web bergaya Duolingo yang dirancang khusus untuk membantu pelajar Indonesia memahami dasar-dasar logika pemrograman dan konsep fundamental ilmu komputer (IT).

### Visi
Demokratisasi pembelajaran logika koding bagi seluruh generasi muda Indonesia melalui platform web mobile-first yang seru, adiktif, ringan diakses, tanpa biaya server (Modal Rp 0), dan bebas dari hambatan login yang rumit.

### Target Pengguna Utama
1. **Pelajar SMP & SMA/SMK:** Pemula absolut yang ingin mengenal logika komputer tanpa terintimidasi sintaks rumit.
2. **Mahasiswa Baru Jurusan IT/Ilmu Komputer/Sistem Informasi:** Mahasiswa tingkat awal yang membutuhkan latihan pemecahan masalah algoritma secara interaktif.
3. **Pembelajar Mandiri (Self-Taught):** Siapa pun di Indonesia yang ingin mengasah kemampuan berpikir logis komputasional dari perangkat ponsel pintar (*smartphone*).

---

## 2. Prinsip Arsitektur "Modal Rp 0" (Vercel Free Tier)

Untuk memastikan keberlanjutan produk tanpa biaya operasional server bulanan:
- **Framework & Hosting:** Next.js (App Router) dihosting secara gratis di platform **Vercel Free Tier** dengan optimasi *Static Site Generation* (SSG) dan *Client-Side Rendering* (CSR).
- **Styling:** Tailwind CSS untuk efisiensi ukuran berkas CSS dan tampilan responsif mobile-first.
- **Penyimpanan Data Pengguna (Zero Backend DB):** Tidak membutuhkan database server eksternal seperti PostgreSQL atau MongoDB. Seluruh progres belajar, XP, streak harian, sisa nyawa (hearts), serta inventory disimpan secara aman di `localStorage` peramban pengguna.
- **Kurikulum & Bank Soal:** Soal-soal didefinisikan dalam format berkas statis JSON (`src/data/curriculum/`) yang di-bundle bersama aplikasi saat proses kompilasi (*build time*), memastikan kecepatan akses instan tanpa latensi API backend.
- **Tanpa Login Ribet (Instant Play):** Pengguna dapat langsung membuka aplikasi dan mulai belajar dalam 3 detik tanpa form pendaftaran atau verifikasi email/kata sandi.

---

## 3. Mekanisme Gamifikasi (Core Game Loops)

LogiKode mengadopsi loop gamifikasi yang terbukti meningkatkan retensi belajar harian:

1. **Experience Points (XP):**
   - Diperoleh setiap kali menyelesaikan soal dengan benar (+10–15 XP) dan menyelesaikan modul pelajaran (+50 XP bonus).
   - Menentukan peringkat dan pencapaian level akun pengguna.

2. **Daily Streak (Runtutan Hari Belajar):**
   - Bertambah +1 setiap hari pengguna menyelesaikan minimal 1 pelajaran.
   - Menggunakan stempel tanggal lokal (`YYYY-MM-DD`).
   - Jika pengguna melewatkan 1 hari tanpa belajar dan tidak memiliki *Streak Freeze*, streak akan reset kembali ke 0.

3. **5 Hearts (Sistem Nyawa):**
   - Pengguna memiliki batas maksimal 5 nyawa (*Hearts*).
   - Jawaban salah pada kuis akan mengurangi 1 Heart.
   - Jika Heart habis (0), pengguna tidak dapat memulai modul baru hingga nyawa terisi kembali (otomatis 1 Heart per interval waktu, misal 30 menit) atau membeli *Unlimited Hearts* / isi ulang via toko.

4. **Unlock Level Bertahap (Progressive Unlock):**
   - Modul belajar disusun dalam bagan jalur belajar (*learning path/tree*).
   - Modul tingkat lanjut terkunci (*locked*) dan hanya dapat dibuka setelah modul prasyarat diselesaikan dengan tuntas (*completed*).

---

## 4. Tiga (3) Tipe Soal Interaktif

Aplikasi mengimplementasikan 3 format interaksi kuis logika koding:

1. **Pilihan Ganda (`multiple_choice`):**
   - Pertanyaan konsep logika/IT dengan 3–4 opsi jawaban.
   - Pilihan interaktif yang dapat dipilih dengan satu ketukan jari (*single tap*).

2. **Susun Blok Kode (`code_order`):**
   - Pengguna menyusun potongan baris kode atau pseudocode acak ke dalam urutan eksekusi yang benar.
   - Antarmuka drag-and-drop atau tap-to-reorder yang mulus di layar sentuh mobile.

3. **Isi Bagian Kosong (`fill_blank`):**
   - Snippet kode atau ekspresi logika memiliki bagian kosong (`___`).
   - Pengguna memilih token kata kunci atau mengetikkan nilai logika yang tepat untuk melengkapi kode.

---

## 5. Skema Monetisasi Ramah Pelajar

Monetisasi dirancang etis, transparan, dan sangat terjangkau bagi uang saku pelajar Indonesia:

- **Model Pembayaran:** Mikrotransaksi *one-off* (tanpa langganan bulanan yang mengikat).
- **Metode Pembayaran:** QRIS instan & Kode Voucher digital.
- **Katalog Item Toko:**
  - **Streak Freeze:** Rp 2.000 / item (melindungi streak jika pengguna berhalangan belajar 1 hari).
  - **Refill 5 Hearts:** Rp 2.000 (langsung memulihkan 5 nyawa penuh).
  - **Unlimited Hearts (7 Hari):** Rp 3.000 (belajar sepuasnya tanpa batas nyawa selama seminggu penuh).
- **Proses Validasi:** Integrasi form kode voucher / konfirmasi pembayaran ringan yang memvalidasi token lokal.

---

## 6. Branding & Atribut Hak Cipta

- **Nama Produk:** LogiKode
- **Identitas Pengembang:** **Core Dev Group**
- **Situs Resmi:** [https://core-dev-group.my.id](https://core-dev-group.my.id)
- **Penempatan Atribut:**
  - Header aplikasi & footer interaktif bertuliskan: *"Built with ❤️ by Core Dev Group"*.
  - Metadata HTML (title, description, OpenGraph, dan authors).
  - Dialog modal *About* yang memberikan profil dan visi Core Dev Group dalam memajukan literasi teknologi di Indonesia.

---

## 7. Batasan Teknis & Target Performa

- **Ukuran Bundle JavaScript Awal:** < 200 KB gzipped.
- **Target Skor Lighthouse:** Performance > 90, Accessibility 100, Best Practices 100, SEO 100.
- **Kompatibilitas Layar:** Mobile-first (optimal di rentang layar 360px – 430px, responsif hingga desktop/tablet).
- **Offline Readiness:** Dapat diakses secara offline (*PWA ready*) dengan data kuis yang telah tersimpan di browser.
