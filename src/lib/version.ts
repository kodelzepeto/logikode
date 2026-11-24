/**
 * ===================================================================
 * LogiKode — Sistem Versioning & Release Notes Terpusat
 * Dikembangkan oleh Core Dev Group (https://core-dev-group.my.id)
 * ===================================================================
 */

export const APP_VERSION = "1.0.2";
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
    version: "1.0.2",
    date: "2026-11-24",
    title: "Mekanik Pengulangan Soal Salah ala Duolingo (Retry Queue)",
    highlights: [
      "Mekanik antrean pengulangan soal salah (retry queue) di akhir sesi",
      "Kalkulasi akurasi akhir jujur (anti-100% jika pernah salah)",
      "Badge 'Kesalahan Sebelumnya — Coba Lagi!' dan selebrasi akurasi di layar akhir",
      "Proteksi anti-farming XP untuk soal yang diulang",
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
