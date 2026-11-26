import { UserProgress } from "@/types/user";
import { createInitialProgress, regenerateHearts } from "./gamification";

export const PROGRESS_STORAGE_KEY = "logikode_user_progress_v1";

let memorySnapshot: UserProgress | null = null;
const storeListeners = new Set<() => void>();

/**
 * Memuat progres pengguna dari localStorage secara aman (SSR safe).
 * Jika belum ada data atau data corrupt/rusak, mengembalikan state default.
 */
export function loadProgress(): UserProgress {
  if (typeof window === "undefined") {
    return createInitialProgress();
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return createInitialProgress();
    }

    const parsed = JSON.parse(raw) as Partial<UserProgress>;

    // Validasi struktur minimal
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.xp !== "number" ||
      typeof parsed.streak !== "number" ||
      typeof parsed.hearts !== "number" ||
      !Array.isArray(parsed.completedLevels)
    ) {
      return createInitialProgress();
    }

    const progress: UserProgress = {
      xp: Math.max(0, parsed.xp),
      streak: Math.max(0, parsed.streak),
      lastPlayedDate: typeof parsed.lastPlayedDate === "string" ? parsed.lastPlayedDate : null,
      streakFreezes: Math.max(0, parsed.streakFreezes ?? 0),
      hearts: Math.min(5, Math.max(0, parsed.hearts)),
      lastHeartLostAt: typeof parsed.lastHeartLostAt === "number" ? parsed.lastHeartLostAt : null,
      unlimitedHeartsUntil: typeof parsed.unlimitedHeartsUntil === "number" ? parsed.unlimitedHeartsUntil : null,
      completedLevels: parsed.completedLevels.filter((id) => typeof id === "string"),
      redeemedVouchers: Array.isArray(parsed.redeemedVouchers)
        ? parsed.redeemedVouchers.filter((c) => typeof c === "string")
        : [],
      userName: typeof parsed.userName === "string" ? parsed.userName.trim() : "",
      dailyGoal:
        parsed.dailyGoal &&
        ["casual", "regular", "serious", "intense"].includes(
          parsed.dailyGoal as string
        )
          ? parsed.dailyGoal
          : "regular",
      onboardingCompleted: Boolean(parsed.onboardingCompleted),
      dailyQuestProgress:
        parsed.dailyQuestProgress &&
        typeof parsed.dailyQuestProgress.date === "string" &&
        typeof parsed.dailyQuestProgress.levelsCompleted === "number" &&
        typeof parsed.dailyQuestProgress.correctAnswers === "number" &&
        typeof parsed.dailyQuestProgress.xpEarned === "number" &&
        Array.isArray(parsed.dailyQuestProgress.claimedQuests)
          ? {
              date: parsed.dailyQuestProgress.date,
              levelsCompleted: Math.max(
                0,
                parsed.dailyQuestProgress.levelsCompleted
              ),
              correctAnswers: Math.max(
                0,
                parsed.dailyQuestProgress.correctAnswers
              ),
              xpEarned: Math.max(0, parsed.dailyQuestProgress.xpEarned),
              claimedQuests: parsed.dailyQuestProgress.claimedQuests.filter(
                (id) => typeof id === "string"
              ),
            }
          : undefined,
    };

    // Otomatis regenerasi hearts saat dimuat jika ada jeda waktu berlalu
    const regen = regenerateHearts(progress);
    progress.hearts = regen.hearts;
    progress.lastHeartLostAt = regen.lastHeartLostAt;

    return progress;
  } catch (error) {
    console.error("Gagal memuat progres pengguna dari localStorage:", error);
    return createInitialProgress();
  }
}

/**
 * Menyimpan progres pengguna ke localStorage secara aman.
 */
export function saveProgress(progress: UserProgress): void {
  memorySnapshot = progress;
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error("Gagal menyimpan progres pengguna ke localStorage:", error);
  }
}

/**
 * Menghapus progres pengguna dari localStorage (Reset data).
 */
export function clearProgress(): void {
  memorySnapshot = createInitialProgress();
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
  } catch (error) {
    console.error("Gagal menghapus progres pengguna dari localStorage:", error);
  }
}

/**
 * Mengambil snapshot progres terbaru untuk useSyncExternalStore.
 */
export function getProgressSnapshot(): UserProgress {
  if (!memorySnapshot) {
    memorySnapshot = loadProgress();
  }
  return memorySnapshot;
}

/**
 * Memperbarui snapshot memori, menyimpan ke localStorage, dan memberitahu subscribers.
 */
export function setProgressSnapshot(progress: UserProgress): void {
  memorySnapshot = progress;
  saveProgress(progress);
  for (const listener of storeListeners) {
    listener();
  }
}

/**
 * Berlangganan perubahan progres (sinkronisasi antar komponen dan antar tab browser).
 */
export function subscribeProgress(onStoreChange: () => void): () => void {
  storeListeners.add(onStoreChange);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === PROGRESS_STORAGE_KEY) {
      memorySnapshot = loadProgress();
      onStoreChange();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    storeListeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}
