import { Level } from "@/types/curriculum";
import { UserProgress } from "@/types/user";

export const MAX_HEARTS = 5;
export const HEART_REGEN_INTERVAL_MS = 5 * 60 * 1000; // 5 menit
export const XP_PER_CORRECT_ANSWER = 10;
export const XP_FIRST_TIME_LEVEL_BONUS = 20;
export const XP_REPEAT_LEVEL_BONUS = 5;

export const COST_STREAK_FREEZE_XP = 100;
export const COST_REFILL_HEARTS_XP = 50;

export type ShopItemType = "streak_freeze" | "refill_hearts";

export interface ShopPurchaseResult {
  success: boolean;
  progress: UserProgress;
  message: string;
}

/**
 * Format tanggal hari ini dalam format lokal YYYY-MM-DD.
 */
export function getTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Menghitung selisih hari kalender (date2 - date1) dalam satuan hari penuh.
 */
export function getDayDifference(dateStr1: string, dateStr2: string): number {
  const [y1, m1, d1] = dateStr1.split("-").map(Number);
  const [y2, m2, d2] = dateStr2.split("-").map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / msPerDay);
}

/**
 * Membuat state awal progres pengguna (Default Fresh State).
 */
export function createInitialProgress(): UserProgress {
  return {
    xp: 0,
    streak: 0,
    lastPlayedDate: null,
    streakFreezes: 0,
    hearts: MAX_HEARTS,
    lastHeartLostAt: null,
    unlimitedHeartsUntil: null,
    completedLevels: [],
    redeemedVouchers: [],
  };
}

/**
 * Menghitung total XP yang didapatkan dari satu sesi kuis level.
 * +10 XP per jawaban benar.
 * +20 XP bonus penyelesaian pertama kali, atau +5 XP bonus jika mengulang level.
 */
export function calculateLevelXP(
  levelId: string,
  completedLevels: string[],
  correctAnswersCount: number
): number {
  const baseXP = correctAnswersCount * XP_PER_CORRECT_ANSWER;
  const isFirstTime = !completedLevels.includes(levelId);
  const bonusXP = isFirstTime
    ? XP_FIRST_TIME_LEVEL_BONUS
    : XP_REPEAT_LEVEL_BONUS;

  return baseXP + bonusXP;
}

/**
 * Memperbarui streak harian secara deterministik.
 * - Hari pertama bermain: streak = 1.
 * - Hari yang sama: streak tidak berubah.
 * - Tepat 1 hari setelahnya: streak + 1.
 * - Bolos 1 hari (selisih 2 hari) dan punya Streak Freeze: streak tetap aman (+1) dan Streak Freeze - 1.
 * - Bolos lebih dari itu (atau tanpa freeze): streak reset menjadi 1.
 */
export function updateStreak(
  currentProgress: UserProgress,
  todayStr: string = getTodayDateString()
): { streak: number; streakFreezes: number; lastPlayedDate: string } {
  const { lastPlayedDate, streak, streakFreezes } = currentProgress;

  // Jika baru pertama kali bermain
  if (!lastPlayedDate) {
    return {
      streak: 1,
      streakFreezes,
      lastPlayedDate: todayStr,
    };
  }

  // Jika bermain di hari yang sama
  if (lastPlayedDate === todayStr) {
    return {
      streak,
      streakFreezes,
      lastPlayedDate: todayStr,
    };
  }

  const diffInDays = getDayDifference(lastPlayedDate, todayStr);

  // Jika jam lokal mundur / hari lebih lampau
  if (diffInDays <= 0) {
    return {
      streak,
      streakFreezes,
      lastPlayedDate: todayStr,
    };
  }

  // Tepat berturut-turut (kemarin -> hari ini)
  if (diffInDays === 1) {
    return {
      streak: streak + 1,
      streakFreezes,
      lastPlayedDate: todayStr,
    };
  }

  // Bolos tepat 1 hari (misal Senin ke Rabu, diff = 2) dan memiliki Streak Freeze
  if (diffInDays === 2 && streakFreezes > 0) {
    return {
      streak: streak + 1,
      streakFreezes: streakFreezes - 1,
      lastPlayedDate: todayStr,
    };
  }

  // Bolos tanpa freeze atau lebih dari 1 hari: reset streak ke 1
  return {
    streak: 1,
    streakFreezes,
    lastPlayedDate: todayStr,
  };
}

/**
 * Mengecek apakah pengguna sedang memiliki Unlimited Hearts aktif.
 */
export function isUnlimitedHeartsActive(
  progress: UserProgress,
  nowTimestamp: number = Date.now()
): boolean {
  return (
    progress.unlimitedHeartsUntil !== null &&
    progress.unlimitedHeartsUntil > nowTimestamp
  );
}

/**
 * Mengurangi 1 Heart ketika pengguna menjawab salah.
 * Jika Unlimited Hearts aktif, nyawa tidak akan berkurang.
 */
export function loseHeart(
  currentProgress: UserProgress,
  nowTimestamp: number = Date.now()
): { hearts: number; lastHeartLostAt: number | null } {
  // Jika Unlimited Hearts aktif, kebal dari pengurangan nyawa
  if (isUnlimitedHeartsActive(currentProgress, nowTimestamp)) {
    return {
      hearts: currentProgress.hearts,
      lastHeartLostAt: currentProgress.lastHeartLostAt,
    };
  }

  const newHearts = Math.max(0, currentProgress.hearts - 1);
  const newLastHeartLostAt =
    currentProgress.lastHeartLostAt ?? nowTimestamp;

  return {
    hearts: newHearts,
    lastHeartLostAt: newHearts < MAX_HEARTS ? newLastHeartLostAt : null,
  };
}

/**
 * Meregenerasi Heart secara otomatis (+1 Heart setiap 30 menit).
 * Atau penuh kembali (5) jika berganti hari.
 */
export function regenerateHearts(
  currentProgress: UserProgress,
  nowTimestamp: number = Date.now(),
  todayStr: string = getTodayDateString()
): { hearts: number; lastHeartLostAt: number | null } {
  if (currentProgress.hearts >= MAX_HEARTS) {
    return {
      hearts: MAX_HEARTS,
      lastHeartLostAt: null,
    };
  }

  // Reset penuh jika berganti hari berdasarkan lastPlayedDate atau hari saat kehilangan nyawa
  if (
    currentProgress.lastPlayedDate &&
    currentProgress.lastPlayedDate !== todayStr
  ) {
    return {
      hearts: MAX_HEARTS,
      lastHeartLostAt: null,
    };
  }

  if (currentProgress.lastHeartLostAt) {
    const lostDate = getTodayDateString(new Date(currentProgress.lastHeartLostAt));
    if (lostDate !== todayStr) {
      return {
        hearts: MAX_HEARTS,
        lastHeartLostAt: null,
      };
    }
  }

  if (!currentProgress.lastHeartLostAt) {
    return {
      hearts: currentProgress.hearts,
      lastHeartLostAt: null,
    };
  }

  const elapsed = nowTimestamp - currentProgress.lastHeartLostAt;

  if (elapsed < HEART_REGEN_INTERVAL_MS) {
    return {
      hearts: currentProgress.hearts,
      lastHeartLostAt: currentProgress.lastHeartLostAt,
    };
  }

  const heartsToAdd = Math.floor(elapsed / HEART_REGEN_INTERVAL_MS);
  const updatedHearts = Math.min(MAX_HEARTS, currentProgress.hearts + heartsToAdd);

  if (updatedHearts >= MAX_HEARTS) {
    return {
      hearts: MAX_HEARTS,
      lastHeartLostAt: null,
    };
  }

  // Majukan lastHeartLostAt sesuai kelipatan interval yang sudah terkonsumsi
  const remainingElapsed = elapsed % HEART_REGEN_INTERVAL_MS;
  const updatedLastLost = nowTimestamp - remainingElapsed;

  return {
    hearts: updatedHearts,
    lastHeartLostAt: updatedLastLost,
  };
}

/**
 * Menghitung sisa waktu (ms) hingga regenerasi +1 Heart berikutnya.
 * Mengembalikan 0 jika hearts sudah penuh (>= 5), sedang Unlimited Hearts, atau belum pernah kehilangan nyawa.
 */
export function getNextHeartCountdownMs(
  progress: UserProgress,
  nowTimestamp: number = Date.now()
): number {
  if (isUnlimitedHeartsActive(progress, nowTimestamp)) return 0;
  if (progress.hearts >= MAX_HEARTS) return 0;
  if (!progress.lastHeartLostAt) return 0;

  const elapsed = nowTimestamp - progress.lastHeartLostAt;
  if (elapsed >= HEART_REGEN_INTERVAL_MS) {
    return 0;
  }
  return Math.max(0, HEART_REGEN_INTERVAL_MS - (elapsed % HEART_REGEN_INTERVAL_MS));
}

/**
 * Format milidetik countdown ke format string ramah pengguna "mm:ss" (contoh: "04:59").
 */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Mengecek apakah suatu level sudah terbuka (unlocked) berdasarkan urutan kurikulum.
 * Level 1 di awal selalu terbuka. Level berikutnya terbuka jika level sebelumnya sudah ada di completedLevels.
 */
export function isLevelUnlocked(
  levelId: string,
  allLevels: Level[],
  completedLevels: string[]
): boolean {
  const index = allLevels.findIndex((l) => l.id === levelId);

  // Jika level tidak ditemukan
  if (index === -1) {
    return false;
  }

  // Level pertama selalu terbuka
  if (index === 0) {
    return true;
  }

  // Level terbuka jika level sebelumnya telah diselesaikan
  const previousLevel = allLevels[index - 1];
  return completedLevels.includes(previousLevel.id);
}

/**
 * Membeli item toko menggunakan XP yang diperoleh dari hasil belajar.
 */
export function buyItemWithXP(
  progress: UserProgress,
  itemType: ShopItemType,
  nowTimestamp: number = Date.now()
): ShopPurchaseResult {
  if (itemType === "streak_freeze") {
    if (progress.xp < COST_STREAK_FREEZE_XP) {
      return {
        success: false,
        progress,
        message: `XP kamu belum cukup (${progress.xp}/${COST_STREAK_FREEZE_XP} XP). Selesaikan kuis untuk mengumpulkan lebih banyak XP!`,
      };
    }

    return {
      success: true,
      progress: {
        ...progress,
        xp: progress.xp - COST_STREAK_FREEZE_XP,
        streakFreezes: progress.streakFreezes + 1,
      },
      message: "Berhasil membeli 1 Streak Freeze! Streak harianmu kini terlindungi.",
    };
  }

  if (itemType === "refill_hearts") {
    if (isUnlimitedHeartsActive(progress, nowTimestamp)) {
      return {
        success: false,
        progress,
        message: "Kamu sedang memiliki Unlimited Hearts aktif! Tidak perlu mengisi ulang nyawa.",
      };
    }

    if (progress.hearts >= MAX_HEARTS) {
      return {
        success: false,
        progress,
        message: "Nyawa kamu sudah penuh (5 Hearts)!",
      };
    }

    if (progress.xp < COST_REFILL_HEARTS_XP) {
      return {
        success: false,
        progress,
        message: `XP kamu belum cukup (${progress.xp}/${COST_REFILL_HEARTS_XP} XP). Selesaikan kuis untuk mengumpulkan lebih banyak XP!`,
      };
    }

    return {
      success: true,
      progress: {
        ...progress,
        xp: progress.xp - COST_REFILL_HEARTS_XP,
        hearts: MAX_HEARTS,
        lastHeartLostAt: null,
      },
      message: "Berhasil mengisi ulang 5 Hearts! Kamu siap melanjutkan latihan.",
    };
  }

  return {
    success: false,
    progress,
    message: "Item tidak dikenali.",
  };
}

/**
 * Mengkombinasikan penyelesaian level dan menghasilkan state UserProgress terbaru secara murni.
 */
export function completeLevelProgress(
  currentProgress: UserProgress,
  levelId: string,
  allLevels: Level[],
  correctAnswersCount: number,
  nowTimestamp: number = Date.now(),
  todayStr: string = getTodayDateString()
): UserProgress {
  const earnedXP = calculateLevelXP(
    levelId,
    currentProgress.completedLevels,
    correctAnswersCount
  );

  const streakUpdate = updateStreak(currentProgress, todayStr);
  const heartsUpdate = regenerateHearts(currentProgress, nowTimestamp, todayStr);

  const isAlreadyCompleted = currentProgress.completedLevels.includes(levelId);
  const updatedCompletedLevels = isAlreadyCompleted
    ? currentProgress.completedLevels
    : [...currentProgress.completedLevels, levelId];

  return {
    ...currentProgress,
    xp: currentProgress.xp + earnedXP,
    streak: streakUpdate.streak,
    streakFreezes: streakUpdate.streakFreezes,
    lastPlayedDate: streakUpdate.lastPlayedDate,
    hearts: heartsUpdate.hearts,
    lastHeartLostAt: heartsUpdate.lastHeartLostAt,
    completedLevels: updatedCompletedLevels,
    redeemedVouchers: currentProgress.redeemedVouchers ?? [],
  };
}
