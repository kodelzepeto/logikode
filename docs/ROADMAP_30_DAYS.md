# Roadmap Update Harian 30 Hari (v1.0.1 → v2.0.0) — LogiKode
**Developer:** Core Dev Group (https://core-dev-group.my.id)  
**Standard:** Semantic Versioning (SemVer), Zero-Cost Vercel Free Tier, 100% Automated Testing Gate.

---

### MINGGU 1: Fondasi Profesional & UX Polish (v1.0.1 → v1.1.0)
- [x] **Hari 1 (`v1.0.1`)**: Setup sistem versioning (`src/lib/version.ts`, `CHANGELOG.md`, sync `package.json`) + tampilkan badge versi aplikasi (`v1.0.1`) di halaman Profil.
- [ ] **Hari 2 (`v1.0.2`)**: Modal **"Apa yang Baru" (*What's New*)** — otomatis muncul 1x saat user membuka versi lebih baru dari yang tersimpan di `localStorage`, plus tombol "Lihat Riwayat Update" di Profil.
- [ ] **Hari 3 (`v1.0.3`)**: **Onboarding 3-Slide** ramah pelajar untuk pengguna baru (isi nama panggilan & pilih target santai/serius harian, bisa di-skip).
- [ ] **Hari 4 (`v1.0.4`)**: Sistem **Misi Harian (*Daily Quests*)** — 3 misi otomatis reset tiap hari (contoh: Selesaikan 1 level, Jawab 10 soal benar, Raih 50 XP) dengan klaim bonus XP.
- [ ] **Hari 5 (`v1.0.5`)**: Efek **Combo Streak di dalam Kuis** (3x, 5x benar beruntun memunculkan badge animasi "🔥 Combo!" + suara khusus).
- [ ] **Hari 6 (`v1.0.6`)**: Halaman **Kamus Koding Mini (`/glossary`)** dengan fitur pencarian cepat istilah IT (Variabel, Boolean, Loop, SQL, dll) tanpa server.
- [ ] **Hari 7 (`v1.1.0` - MINOR)**: **Dark Mode / Light Mode Toggle** dengan persistensi `localStorage` + audit kontras seluruh halaman.

### MINGGU 2: Ekspansi Konten & Belajar Cerdas (v1.1.1 → v1.2.0)
- [ ] **Hari 8 (`v1.1.1`)**: Fitur **Review Kesalahan (*Mistake Bank*)** — mencatat soal yang pernah dijawab salah dan menyediakan sesi latihan khusus memperbaiki kesalahan.
- [ ] **Hari 9 (`v1.1.2`)**: Tambah **Unit 5: Fungsi & Modularitas (Function, Parameter, Return)** — 3 Level, 15 soal.
- [ ] **Hari 10 (`v1.1.3`)**: Fitur **Petunjuk Soal (*Hint*)** — tombol lampu di kuis (1x gratis per level atau tukar 10 XP) untuk membantu pelajar yang buntu.
- [ ] **Hari 11 (`v1.1.4`)**: **Grafik Statistik Belajar 7 Hari Terakhir** di Profil (grafik batang XP harian murni CSS/SVG ringan tanpa library berat).
- [ ] **Hari 12 (`v1.1.5`)**: Tambah **Unit 6: Array & List Dasar (Indeks, Panjang, Iterasi)** — 3 Level, 15 soal.
- [ ] **Hari 13 (`v1.1.6`)**: Sistem **Lencana / Achievements** (8 lencana pencapaian seperti *Langkah Pertama*, *Streak 7 Hari*, *Sempurna Tanpa Salah*, *Master SQL*).
- [ ] **Hari 14 (`v1.2.0` - MINOR)**: Mode **Tantangan Waktu (*Time Attack* 60 Detik)** di `/practice` dengan pencatatan skor tertinggi pribadi (*High Score*).

### MINGGU 3: Retensi & Pengalaman Native App (v1.2.1 → v1.3.0)
- [ ] **Hari 15 (`v1.2.1`)**: Fitur **Backup & Restore Progres (Export/Import Kode JSON)** di Profil agar progres aman saat ganti HP/browser (tetap Rp 0 tanpa database).
- [ ] **Hari 16 (`v1.2.2`)**: Tambah **Unit 7: Dasar HTML & Struktur Web** — 3 Level, 15 soal.
- [ ] **Hari 17 (`v1.2.3`)**: Sistem **Tier / Liga Lokal** (*Perunggu → Perak → Emas → Berlian → Master*) berdasarkan total XP dengan badge keren di TopBar & Profil.
- [ ] **Hari 18 (`v1.2.4`)**: **Kustomisasi Avatar & Bingkai Profil** (koleksi avatar lucu berbasis SVG/emoji yang bisa dibuka pakai XP di Toko).
- [ ] **Hari 19 (`v1.2.5`)**: Tambah **Unit 8: Logika Algoritma & Dasar Debugging** — 3 Level, 15 soal.
- [ ] **Hari 20 (`v1.2.6`)**: Optimasi **Offline-First PWA** (tambahkan halaman `/offline` ramah pengguna + indikator status offline ringan di layar).
- [ ] **Hari 21 (`v1.3.0` - MINOR)**: Tipe Soal Interaktif ke-4: **Cari Bug (`find_bug`)** — pengguna mengetuk baris kode yang mengandung error di dalam potongan kode.

### MINGGU 4: Viralitas, Monetisasi, & Rilis Besar (v1.3.1 → v2.0.0)
- [ ] **Hari 22 (`v1.3.1`)**: Fitur **Link Ajak Teman (`?ref=nama`)** — pengguna baru yang masuk via link teman otomatis dapat bonus +50 XP selamat datang.
- [ ] **Hari 23 (`v1.3.2`)**: Generator **Share Card Lencana & High Score Time Attack** (PNG 1080x1920 via HTML Canvas) siap pamer ke TikTok/IG Story.
- [ ] **Hari 24 (`v1.3.3`)**: Peningkatan Toko — tambah **Paket Bundling Hemat**, FAQ pembayaran QRIS Lynk.id, dan animasi konfeti saat redeem voucher sukses.
- [ ] **Hari 25 (`v1.3.4`)**: **Ringkasan Materi (*Cheat Sheet*)** 30 detik sebelum memulai level (tombol "Baca Materi Dulu" opsional sebelum kuis).
- [ ] **Hari 26 (`v1.3.5`)**: Tambah **Unit 9: Pengenalan Sintaks Python Populer** — 3 Level, 15 soal.
- [ ] **Hari 27 (`v1.3.6`)**: **Pengingat Belajar Harian** (tombol unduh pengingat jadwal `.ics` ke kalender HP agar streak tidak putus).
- [ ] **Hari 28 (`v1.3.7`)**: **Audit Performa & Aksesibilitas** (optimasi navigasi keyboard, `aria-label`, metadata OpenGraph dinamis, dan kecepatan render).
- [ ] **Hari 29 (`v1.3.8`)**: **Ujian Akhir Sertifikasi LogiKode** (20 soal acak lintas unit, lulus ≥ 80% berhak klaim **Sertifikat Master LogiKode** PNG).
- [ ] **Hari 30 (`v2.0.0` - MAJOR)**: **Major Release v2.0.0** — Pemolesan final UI/UX, sinkronisasi penuh `CHANGELOG.md`, `README.md`, `docs/PRD.md`, dan verifikasi 100% seluruh test suite.
