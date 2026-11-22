# LogiKode ⚡

> **Platform Edukasi Logika Koding & Dasar IT Berbahasa Indonesia Bergaya Duolingo**  
> Dibangun dengan ❤️ oleh [**Core Dev Group**](https://core-dev-group.my.id) — Mobile-First, Ringan, Modal Rp 0 (Vercel Free Tier), dan Ramah Kantong Pelajar.

---

## 🚀 Sekilas Tentang LogiKode

**LogiKode** dirancang khusus untuk memecahkan hambatan terbesar pelajar SMP, SMA/SMK, dan mahasiswa baru Indonesia dalam belajar koding: rasa terintimidasi oleh sintaks rumit dan minimnya akses komputer.

### Fitur Utama:
- 📱 **Mobile-First & Ramah Jempol:** Semua interaksi kuis berbasis ketukan (*tap-only*), tanpa drag-and-drop yang sering bermasalah di layar ponsel.
- 🎮 **Gamifikasi Adiktif:** XP, Daily Streak, 5 Hearts (Nyawa), dan jalur belajar berliku (*winding learning path*) dengan pembukaan level linier.
- 🧩 **3 Format Soal Interaktif:**
  1. **Pilihan Ganda (`multiple_choice`)** dengan kartu opsi taktil 3D.
  2. **Susun Blok Kode (`code_order`)** dengan area susunan dan kepingan kode interaktif.
  3. **Isi Bagian Kosong (`fill_blank`)** dengan slot kode dinamis dan pilihan token.
- 💸 **Arsitektur Modal Rp 0 (Zero Server Cost):**
  - Next.js (App Router) + Tailwind CSS + Framer Motion di-hosting gratis di **Vercel Free Tier**.
  - Progres belajar, XP, nyawa, dan inventory tersimpan aman di `localStorage` peramban (tanpa database berbayar & tanpa login ribet).
- 🛍️ **Toko Ramah Pelajar (Monetisasi Mikrotransaksi Rp 2.000 – Rp 3.000):**
  - Beli *Streak Freeze* dan *Refill Hearts* gratis menggunakan XP hasil belajar, atau via QRIS instan (Mayar/Lynk.id) dan kode voucher digital.

---

## 🛠️ Menjalankan Proyek Secara Lokal

Pastikan Node.js (>= v18 atau v20+) dan npm telah terpasang di komputermu:

```bash
# 1. Masuk ke direktori proyek
cd logikode

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🧪 Menjalankan Pengujian Mandiri (*Unit Test*)

LogiKode dilengkapi rangkaian pengujian unit otomatis komprehensif menggunakan **Vitest**:

```bash
# Menjalankan seluruh unit test
npm test

# Menjalankan linter ESLint
npm run lint

# Menguji build produksi Next.js
npm run build
```

---

## 🎟️ Kode Voucher Demo (Siap Ditest)

Kamu dapat menguji fitur penukaran voucher di tab **Toko (`/shop`)** menggunakan kode bawaan berikut:
- `LOGIFREEZE2K`: Memberikan hadiah **+1 Streak Freeze** ❄️
- `LOGIHEART2K`: Memulihkan **5 Hearts Penuh** seketika ❤️
- `LOGIPRO7D`: Mengaktifkan **Unlimited Hearts selama 7 Hari Penuh** ♾️

---

## 🌐 Panduan Deploy 1-Klik ke Vercel

1. **Push Repository ke GitHub / GitLab:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete LogiKode MVP (Phase 0 - Phase 4)"
   git branch -M main
   git remote add origin <URL_REPOSITORY_ANDA>
   git push -u origin main
   ```
2. **Impor ke Vercel:**
   - Masuk ke dashboard [vercel.com](https://vercel.com).
   - Klik **"Add New Project"** dan pilih repositori `logikode`.
   - Konfigurasi Framework Preset: **Next.js**.
   - (Opsional) Tambahkan Environment Variables dari berkas `.env.example`:
     - `NEXT_PUBLIC_QRIS_FREEZE_URL`
     - `NEXT_PUBLIC_QRIS_REFILL_URL`
     - `NEXT_PUBLIC_QRIS_UNLIMITED_URL`
     - `NEXT_PUBLIC_VOUCHER_FREEZE`
     - `NEXT_PUBLIC_VOUCHER_REFILL`
     - `NEXT_PUBLIC_VOUCHER_UNLIMITED`
3. **Deploy:**
   - Klik tombol **"Deploy"**. Vercel akan otomatis mengompilasi rute SSG dalam hitungan menit dan aplikasi LogiKode langsung aktif live!

---

## 📜 Hak Cipta & Kredit

Dibuat dengan dedikasi penuh oleh **Core Dev Group**  
Situs Web Resmi: [https://core-dev-group.my.id](https://core-dev-group.my.id)
