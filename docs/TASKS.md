# Task Tracker & Implementation Roadmap — LogiKode

Proyek: **LogiKode** oleh **Core Dev Group** ([https://core-dev-group.my.id](https://core-dev-group.my.id))

---

## 📋 Fase 0: Inisialisasi, PRD, & Setup Testing
- [x] Inisialisasi Next.js (App Router), TypeScript, dan Tailwind CSS dalam folder terisolasi (`logikode/`)
- [x] Instalasi dependensi ikon (`lucide-react`) dan animasi (`framer-motion`)
- [x] Konfigurasi unit testing dengan Vitest (`vitest`) dan script `"test": "vitest run"` di `package.json`
- [x] Pembuatan struktur folder proyek (`docs/`, `src/components/`, `src/data/curriculum/`, `src/hooks/`, `src/lib/`, `src/types/`)
- [x] Penyusunan dokumen arsitektur dan spesifikasi produk: `docs/PRD.md`
- [x] Penyusunan tracker tugas: `docs/TASKS.md`
- [x] Konfigurasi metadata aplikasi di `src/app/layout.tsx` dengan atribusi Core Dev Group
- [x] Pembuatan uji coba dummy `src/lib/__tests__/setup.test.ts`
- [x] Verifikasi kelulusan 100% `npm test`, `npm run lint`, dan `npm run build`

---

## 📋 Fase 1: Data Kurikulum & Core Gamification Engine
- [x] Definisi tipe TypeScript untuk kurikulum, user state, kuis, dan inventory (`src/types/curriculum.ts`, `src/types/user.ts`, `src/types/index.ts`)
- [x] Pembuatan bank soal interaktif kurikulum berbahasa Indonesia (`src/data/curriculum/`):
  - [x] Unit 1: Logika Dasar & Variabel (3 Level, 15 Soal dengan penjelasan edukatif)
  - [x] Unit 2: Percabangan (If, Else, & Logika Boolean) (3 Level, 15 Soal dengan penjelasan edukatif)
  - [x] Index & Helper (`getAllLevels()`, `getLevelById()`, `getNextLevelId()`)
- [x] Implementasi Pure Functions Core Gamification Engine (`src/lib/gamification.ts`):
  - [x] `createInitialProgress()`
  - [x] XP Calculation (`calculateLevelXP`: +10 XP per jawaban benar, +20 XP bonus level baru, +5 XP bonus ulang)
  - [x] Daily Streak Calculator & Last Active Date (`updateStreak`, perlindungan Streak Freeze)
  - [x] Hearts System (`loseHeart`, kekebalan `isUnlimitedHeartsActive`, regenerasi `regenerateHearts` per 30 menit & saat ganti hari)
  - [x] Level Unlocking Logic (`isLevelUnlocked` berurutan)
  - [x] Deterministic State Transition (`completeLevelProgress`)
- [x] Implementasi LocalStorage Persistence & Sync Hook:
  - [x] SSR-Safe Storage Helper & multi-tab subscription (`src/lib/storage.ts`)
  - [x] Custom Hook `useUserProgress` dengan React 19 `useSyncExternalStore` (`src/hooks/useUserProgress.ts`)
- [x] Unit Testing & Validasi:
  - [x] Test Gamification Engine (`src/lib/__tests__/gamification.test.ts` - 22 tests)
  - [x] Test Validasi Kurikulum (`src/lib/__tests__/curriculum.test.ts` - 10 tests)
  - [x] Test LocalStorage Persistence (`src/lib/__tests__/storage.test.ts` - 4 tests)
  - [x] Test Setup Baseline (`src/lib/__tests__/setup.test.ts` - 2 tests)
  - [x] Verifikasi kelulusan 100% `npm test` (38/38 tests PASS), `npm run lint` (0 error/warning), dan `npm run build`

---

## 📋 Fase 2: UI/UX Mobile-First & Peta Belajar (Learning Path)
- [x] App Shell Mobile-First (`src/components/layout/MobileShell.tsx` dengan frame responsif terpusat `max-w-md`)
- [x] Header Sticky `TopBar.tsx` terintegrasi langsung dengan `useUserProgress()` (Streak, XP, Hearts, & Unlimited Indicator)
- [x] Sticky `BottomNav.tsx` dengan 3 rute utama (Belajar, Toko, Profil) dan penanda tab aktif
- [x] Komponen Peta Belajar Jalur Duolingo (`src/components/learning/`):
  - [x] `UnitBanner.tsx`: Kartu header unit berwarna dinamis (Emerald/Indigo), deskripsi, dan progress bar tuntas
  - [x] `LevelNode.tsx`: Node 3D taktil bergaya Duolingo dengan 3 status (Terkunci, Aktif dengan speech bubble "MULAI", dan Selesai)
  - [x] `LearningPath.tsx`: Alur berliku (*zigzag path*) dan modal peringatan interaktif jika menekan level terkunci
- [x] Halaman Peta Belajar Beranda (`src/app/page.tsx`)
- [x] Halaman Profil (`src/app/profile/page.tsx`):
  - [x] Kartu statistik (Total XP, Streak Hari, Streak Freeze, dan Progress Bar Kurikulum)
  - [x] Kartu resmi branding **Core Dev Group** dengan link ke `https://core-dev-group.my.id`
  - [x] Tombol & dialog konfirmasi **Reset Progres Belajar**
- [x] Halaman Placeholder Rute (mencegah error 404):
  - [x] `src/app/lesson/[levelId]/page.tsx` (dengan SSG `generateStaticParams`)
  - [x] `src/app/shop/page.tsx` (katalog item ramah pelajar & kredit Core Dev Group)
- [x] Unit Testing & Validasi:
  - [x] Test UI & Status Resolusi Node (`src/lib/__tests__/ui.test.ts` - 3 tests)
  - [x] Verifikasi kelulusan 100% `npm test` (41/41 tests PASS), `npm run lint` (0 error/warning), dan `npm run build` (12 rute statis sukses)

---

## 📋 Fase 3: Interactive Quiz Engine (3 Tipe Soal)
- [x] Pure Function Validator (`src/lib/quizValidator.ts`):
  - [x] Validasi `multiple_choice` dengan pembandingan `correctIndex`
  - [x] Validasi `code_order` dengan pembandingan array urutan blok persis
  - [x] Validasi `fill_blank` dengan pembandingan token string (trimmed)
- [x] Komponen Sesi Latihan Modular (`src/components/lesson/`):
  - [x] `LessonHeader.tsx`: Tombol keluar aman dengan konfirmasi modal, Progress Bar animasi, dan indikator Hearts / Unlimited
  - [x] `MultipleChoiceQuestion.tsx`: Prompt soal, blok kode monospaced rapi, dan kartu opsi taktil A-D
  - [x] `CodeOrderQuestion.tsx`: Area "Susunan Kodemu" & "Pilihan Kepingan Blok" berbasis tap-to-move yang ramah jempol di HP
  - [x] `FillBlankQuestion.tsx`: Template kode dengan slot kosong terisi interaktif dan kumpulan chip token pilihan
  - [x] `FeedbackDrawer.tsx`: Bottom sheet animasi Framer Motion dengan feedback visual (Benar: Hijau, Salah: Merah + Kunci Jawaban) dan penjelasan edukatif
  - [x] `LessonComplete.tsx`: Layar selebrasi (XP, Akurasi %, Streak Hari, tombol Lanjut Level & Kembali ke Beranda)
  - [x] `OutOfHeartsScreen.tsx`: Layar proteksi saat nyawa habis dengan informasi pemulihan otomatis & tautan ke toko
  - [x] `LessonRunner.tsx`: State machine orkestrator sesi kuis terintegrasi dengan `useUserProgress`, proteksi level terkunci, dan konsumsi nyawa
- [x] Integrasi Halaman Rute (`src/app/lesson/[levelId]/page.tsx` dengan SSG `generateStaticParams`)
- [x] Unit Testing & Validasi:
  - [x] Test Validator Kuis (`src/lib/__tests__/quizValidator.test.ts` - 12 tests)
  - [x] Verifikasi kelulusan 100% `npm test` (53/53 tests PASS), `npm run lint` (0 error/warning), dan `npm run build` (12 rute statis sukses)

---

## 📋 Fase 4: Toko (Monetisasi Rp 0), SEO, & Persiapan Deploy Vercel
- [x] Ekstensi State & Voucher Engine:
  - [x] `UserProgress.redeemedVouchers: string[]` di `src/types/user.ts`
  - [x] Migrasi dan fallback backward-compatible data lama di `src/lib/storage.ts`
  - [x] Pure function `buyItemWithXP` di `src/lib/gamification.ts` (Streak Freeze 100 XP, Refill 5 Hearts 50 XP)
  - [x] Pure function `validateAndApplyVoucher` di `src/lib/vouchers.ts` (`LOGIFREEZE2K`, `LOGIHEART2K`, `LOGIPRO7D`, anti-double-claim, env override)
  - [x] Integrasi aksi `buyWithXP` & `redeem` di `src/hooks/useUserProgress.ts`
- [x] Halaman & Komponen Toko Pelajar:
  - [x] `QrisPaymentModal.tsx`: Modal popup instruksi QRIS Mayar.id / Lynk.id dengan tautan checkout
  - [x] `VoucherRedeemCard.tsx`: Input penukaran kode voucher ramah jempol dengan tombol copy kode demo
  - [x] `src/app/shop/page.tsx`: Katalog item XP & QRIS (Streak Freeze Rp 2.000, 5 Hearts Rp 2.000, Unlimited 7 Hari Rp 3.000) dan kredit aktif Core Dev Group
- [x] SEO, Metadata, & Aset Branding:
  - [x] `src/app/layout.tsx`: OpenGraph, Twitter Cards, metadata deskripsi, dan kredit author Core Dev Group (`https://core-dev-group.my.id`)
  - [x] `src/app/icon.svg`: Favicon dan App Icon SVG dinamis
  - [x] `.env.example`: Dokumentasi variabel lingkungan Vercel untuk link pembayaran dan voucher promo
  - [x] `README.md`: Panduan setup, daftar demo voucher, dan petunjuk 1-click Vercel deployment
- [x] Unit Testing & Validasi:
  - [x] Unit test voucher engine (`src/lib/__tests__/vouchers.test.ts` - 10 tests)
  - [x] Unit test pembelian item XP (`src/lib/__tests__/gamification.test.ts` - 6 tests tambahan)
  - [x] Unit test backward-compatibility storage (`src/lib/__tests__/storage.test.ts` - 5 tests)
  - [x] Verifikasi mandiri 100% lulus: `npm test` (70/70 tests PASS di 7 file test), `npm run lint` (0 error, 0 warning), dan `npm run build` (13 rute SSG sukses).

---

## 📋 Fase 5: Growth, Retention, & Polish (LogiKode by Core Dev Group)
- [x] Logo Branding & Aset Visual:
  - [x] Menghapus background hitam dari logo pengguna menggunakan pemrosesan piksel Python (PIL) dengan anti-aliasing halus
  - [x] Menyimpan varian logo transparan: `public/logo.png`, `public/icon-512.png`, `public/icon-192.png`, `src/app/icon.png`, `public/favicon.ico`
  - [x] Memasang logo di `TopBar.tsx`, `ProfilePage`, dan Manifest PWA
- [x] Refresh Nyawa 5 Menit & Live Countdown:
  - [x] Interval regenerasi `HEART_REGEN_INTERVAL_MS = 5 * 60 * 1000` (5 menit) di `src/lib/gamification.ts`
  - [x] Helper murni `getNextHeartCountdownMs()` dan `formatCountdown()` (format "mm:ss")
  - [x] Live ticking 1 detik di `useUserProgress.ts` saat nyawa < 5
  - [x] Live countdown pill di `TopBar.tsx` dan countdown box di `OutOfHeartsScreen.tsx`
- [x] Audio Engine (Web Audio API) & Mute Controller:
  - [x] Modul murni client-side `src/lib/sound.ts` dengan 4 efek nada (Correct Chime, Wrong Buzzer, Fanfare Complete, Soft Click)
  - [x] Sinkronisasi status mute ke `localStorage` (`isSoundMuted`, `setSoundMuted`, `toggleSoundMuted`)
  - [x] Tombol Mute/Unmute dinamis di `TopBar.tsx` (`Volume2` / `VolumeX`) menggunakan `useSyncExternalStore`
  - [x] Integrasi efek suara ke `LessonRunner.tsx` dan `PracticePage`
- [x] Penambahan Kurikulum & Mode Latihan Acak (Endless):
  - [x] `unit3.ts` (Perulangan: For, While, & Pola Loop - 3 Level, 15 Soal)
  - [x] `unit4.ts` (Dasar SQL & Database: SELECT, WHERE, INSERT - 3 Level, 15 Soal)
  - [x] Total kurikulum sekarang: 4 Unit, 12 Level, 60 Soal
  - [x] Rute `/practice` (`src/app/practice/page.tsx`) untuk mode latihan acak 5 soal tanpa menguras nyawa (+5 XP per soal)
  - [x] Kartu banner akses cepat "⚡ Latihan Cepat (Acak)" di atas `LearningPath.tsx`
- [x] Fitur Viral "Pamer ke Story" (1080x1920 PNG):
  - [x] Generator canvas resolusi tinggi `generateStoryShareImage()` di `src/lib/canvasGenerator.ts`
  - [x] Tombol "Pamer ke Story (Download PNG)" di `LessonComplete.tsx`, `PracticePage`, dan `src/app/profile/page.tsx`
- [x] Sertifikat Digital Kelulusan Unit (1600x1130 PNG):
  - [x] Generator sertifikat mewah landscape `generateUnitCertificate()` di `src/lib/canvasGenerator.ts`
  - [x] Modal input nama `CertificateModal.tsx` dengan live feedback download
  - [x] Tombol emas "🏆 Klaim Sertifikat Unit" di `UnitBanner.tsx` saat seluruh level unit tuntas (3/3)
- [x] PWA (Web App Manifest):
  - [x] `src/app/manifest.ts` dengan icons 192px, 512px, 1024px maskable & any
  - [x] Konfigurasi manifest link di `src/app/layout.tsx`
- [x] Unit Testing & Validasi:
  - [x] Update test kurikulum 4 unit, 12 level, 60 soal di `src/lib/__tests__/curriculum.test.ts`
  - [x] Update test gamifikasi interval 5 menit & countdown di `src/lib/__tests__/gamification.test.ts`
  - [x] Unit test audio synthesizer di `src/lib/__tests__/sound.test.ts`
  - [x] 100% lulus: `npm test` (78/78 tests PASS di 8 test suites), `npm run lint` (0 error, 0 warning), dan `npm run build` (21 rute SSG sukses).
