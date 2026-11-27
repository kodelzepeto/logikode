/**
 * ===================================================================
 * LogiKode — Sistem Versioning & Release Notes Terpusat
 * Dikembangkan oleh Core Dev Group (https://core-dev-group.my.id)
 * ===================================================================
 */

export const APP_VERSION = "1.0.5";
export const APP_NAME = "LogiKode";
export const APP_AUTHOR = "Core Dev Group";
export const APP_AUTHOR_URL = "https://core-dev-group.my.id";

export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  highlights: string[];
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "1.0.5",
    date: "2026-11-27",
    title: "Efek Combo Streak Kuis & Efek Suara Spesial Web Audio",
    highlights: [
      "Pelacak rentetan jawaban benar beruntun (Combo Streak) di dalam kuis & latihan acak",
      "Badge selebrasi animasi '3x Combo! 🔥' dan '5x Combo! ⚡' di bilah feedback jawaban",
      "Efek suara arpeggio khusus Web Audio API bertingkat untuk combo 3x dan 5x+",
      "Pill indikator api aktif di LessonHeader saat combo minimal 2x",
      "Penghargaan Combo Terbaik di layar rangkuman akhir penyelesaian level",
    ],
  },
  {
    version: "1.0.4",
    date: "2026-11-26",
    title: "Sistem Misi Harian (Daily Quests) & Klaim Bonus XP",
    highlights: [
      "3 misi harian otomatis reset tiap tengah malam (Selesaikan 1 Level, 10 Soal Benar, 50 XP)",
      "Tombol klaim bonus XP interaktif dengan efek suara ceria chime Web Audio",
      "Indikator progress bar interaktif & badge siap klaim dengan animasi visual",
      "Widget Misi Harian di halaman Beranda Belajar dan halaman Profil",
    ],
  },
  {
    version: "1.0.3",
    date: "2026-11-25",
    title: "Onboarding 3-Slide Pelajar & Pemilihan Target Belajar Harian",
    highlights: [
      "Onboarding interaktif 3-slide ramah pelajar dengan opsi lewati (skip)",
      "Personalisasi nama panggilan pelajar di beranda, profil, dan sertifikat",
      "Pemilihan target ritme belajar harian (Santai, Biasa, Serius, Gila Koding)",
      "Menu ubah profil & ritme target belajar kapan saja di halaman Profil",
    ],
  },
  {
    version: "1.0.2",
    date: "2026-11-24",
    title: "Modal 'Apa yang Baru' & Antrean Pengulangan Soal Duolingo",
    highlights: [
      "Modal otomatis 'Apa yang Baru' (What's New) untuk update versi aplikasi",
      "Tombol 'Lihat Riwayat Update' di halaman Profil",
      "Mekanik antrean pengulangan soal salah (retry queue) di akhir sesi kuis",
      "Kalkulasi akurasi jujur anti-100% dan proteksi anti-farming XP",
      "Badge selebrasi akurasi '✨ Sempurna!' vs '👍 Bagus!' di layar akhir",
    ],
  },
  {
    version: "1.0.1",
    date: "2026-11-23",
    title: "Fondasi Sistem Versioning & Roadmap 30 Hari",
    highlights: [
      "Setup sistem versioning terpusat dan SemVer test gate",
      "Badge versi aplikasi resmi di halaman Profil",
      "Inisialisasi roadmap 30 hari pembaruan berkelanjutan",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-11-23",
    title: "Rilis Perdana LogiKode (Genesis)",
    highlights: [
      "4 Unit kurikulum logika pemrograman interaktif",
      "Sistem gamifikasi Hearts, XP, dan Daily Streak",
      "Integrasi QRIS Lynk.id & Upstash Redis Cloud anti-curang",
    ],
  },
];

export const CHANGELOG_ENTRIES = RELEASE_NOTES;

export const LAST_SEEN_VERSION_KEY = "logikode_last_seen_version";

/**
 * Menentukan apakah modal "Apa yang Baru" harus ditampilkan secara otomatis.
 * Bernilai true jika belum pernah tersimpan di localStorage atau jika versi saat ini
 * lebih baru dari versi yang tersimpan di localStorage.
 */
export function shouldShowWhatsNew(
  currentVersion: string,
  lastSeenVersion: string | null
): boolean {
  if (!lastSeenVersion) return true;
  return isNewerVersion(currentVersion, lastSeenVersion);
}

/**
 * Mengambil versi terakhir yang sudah dilihat pengguna dari localStorage.
 */
export function getLastSeenVersion(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(LAST_SEEN_VERSION_KEY);
  } catch {
    return null;
  }
}

/**
 * Menyimpan versi saat ini ke localStorage agar modal tidak muncul berulang kali.
 */
export function markVersionAsSeen(version: string = APP_VERSION): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_SEEN_VERSION_KEY, version);
  } catch (err) {
    console.warn("Gagal menyimpan last seen version:", err);
  }
}

/**
 * Mengembalikan versi aplikasi saat ini
 */
export function getAppVersion(): string {
  return APP_VERSION;
}

/**
 * Format string display badge versi resmi
 */
export function getAppVersionBadge(): string {
  return `${APP_NAME} v${APP_VERSION} • ${APP_AUTHOR}`;
}

/**
 * Mengambil catatan rilis versi terbaru
 */
export function getLatestReleaseNote(): ReleaseNote {
  return RELEASE_NOTES[0];
}

/**
 * Memeriksa apakah versi A lebih baru daripada versi B
 */
export function isNewerVersion(vA: string, vB: string): boolean {
  const partsA = vA.split(".").map((n) => parseInt(n, 10) || 0);
  const partsB = vB.split(".").map((n) => parseInt(n, 10) || 0);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const a = partsA[i] || 0;
    const b = partsB[i] || 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return false;
}
