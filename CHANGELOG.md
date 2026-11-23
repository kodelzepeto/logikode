# Changelog

Semua perubahan penting pada proyek **LogiKode** oleh **Core Dev Group** didokumentasikan di berkas ini.
Format penulisan mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan proyek ini mematuhi prinsip [Semantic Versioning](https://semver.org/lang/id/).

## [1.0.1] - 2026-11-23

### Added
- **Sistem Versioning Terpusat (`src/lib/version.ts`)**: Sinkronisasi konstan versi aplikasi SemVer (`APP_VERSION`), riwayat changelog terstruktur, dan helper utilities.
- **Badge Versi di Halaman Profil**: Menampilkan identitas versi resmi `LogiKode v1.0.1 • Core Dev Group` dengan animasi pulse indikator status aktif.
- **Unit Test Sinkronisasi SemVer (`src/lib/__tests__/version.test.ts`)**: Gerbang pengujian otomatis yang menjamin versi di `package.json` dan `src/lib/version.ts` selalu 100% sinkron.
- **Roadmap 30 Hari (`docs/ROADMAP_30_DAYS.md`)**: Rencana aksi rilis harian terstruktur (v1.0.1 → v2.0.0).

### Changed
- Menyesuaikan nomor versi proyek di `package.json` menjadi `1.0.1`.
- Mempercantik antarmuka halaman profil dengan info metadata aplikasi resmi.

---

## [1.0.0] - 2026-11-23

### Added
- **Rilis Perdana LogiKode**: Platform edukasi logika pemrograman dan dasar IT berbahasa Indonesia bergaya Duolingo modal Rp 0.
- **Kurikulum Interaktif 4 Unit**:
  - Unit 1: Logika Dasar & Variabel
  - Unit 2: Kondisional (If - Else)
  - Unit 3: Perulangan (Looping)
  - Unit 4: Logika Lanjutan & Debugging
- **Gamifikasi Duolingo-Style**:
  - Sistem Hearts (5 nyawa dengan pemulihan otomatis)
  - Sistem XP dan Daily Streak
  - Peta Level Interaktif dengan status Terkunci/Aktif/Selesai
- **Sistem Kuis Interaktif**:
  - Tipe Pilihan Ganda
  - Tipe Lengkapi Kode (*Fill in the blanks*)
  - Tipe Urutkan Baris Kode (*Reorder code blocks*)
- **Toko & Monetisasi Mikrotransaksi Ramah Pelajar**:
  - Streak Freeze, Refill Nyawa Penuh, Unlimited Hearts 7 Hari
  - Integrasi QRIS Lynk.id & Upstash Redis Cloud Ledger (Anti-Double Claim & Anti-Curang)
- **Audio & Visual Delight**: Sound effect synthesized Web Audio API (*Correct, Wrong, Click, Level Complete*).
- **Offline PWA Support**: Manifest Web App dan instalasi layar utama mobile.
