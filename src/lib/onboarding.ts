/**
 * Helper & Data Konfigurasi Onboarding Pelajar LogiKode (3-Slide Onboarding)
 * Dikembangkan oleh Core Dev Group (https://core-dev-group.my.id)
 */

import { DailyGoalType } from "@/types/user";

export interface DailyGoalOption {
  id: DailyGoalType;
  title: string;
  subtitle: string;
  targetXp: number;
  levelsPerDay: number;
  icon: string;
  badge?: string;
}

export const ONBOARDING_STORAGE_KEY = "logikode_onboarding_completed";

export const DAILY_GOAL_OPTIONS: DailyGoalOption[] = [
  {
    id: "casual",
    title: "Santai",
    subtitle: "1 level per hari (~30 XP)",
    targetXp: 30,
    levelsPerDay: 1,
    icon: "🌱",
  },
  {
    id: "regular",
    title: "Biasa",
    subtitle: "2 level per hari (~60 XP)",
    targetXp: 60,
    levelsPerDay: 2,
    icon: "🚀",
    badge: "Rekomendasi",
  },
  {
    id: "serious",
    title: "Serius",
    subtitle: "3 level per hari (~100 XP)",
    targetXp: 100,
    levelsPerDay: 3,
    icon: "🔥",
  },
  {
    id: "intense",
    title: "Gila Koding",
    subtitle: "5 level per hari (~150 XP)",
    targetXp: 150,
    levelsPerDay: 5,
    icon: "⚡",
  },
];

/**
 * Mengambil metadata konfigurasi target belajar berdasarkan ID.
 */
export function getDailyGoalConfig(id: DailyGoalType = "regular"): DailyGoalOption {
  return (
    DAILY_GOAL_OPTIONS.find((opt) => opt.id === id) || DAILY_GOAL_OPTIONS[1]
  );
}

/**
 * Menentukan apakah onboarding harus ditampilkan untuk pengguna saat ini.
 * Ditampilkan hanya jika belum pernah menyelesaikan onboarding dan belum pernah menamatkan level.
 */
export function shouldShowOnboarding(
  onboardingCompleted: boolean | undefined,
  completedLevelsCount: number,
  hasLocalStorageFlag: boolean = false
): boolean {
  if (onboardingCompleted || hasLocalStorageFlag) {
    return false;
  }
  // Pengguna lama yang sudah punya level tuntas dilewati otomatis
  if (completedLevelsCount > 0) {
    return false;
  }
  return true;
}

/**
 * Format string label badge target belajar untuk ditampilkan di UI.
 */
export function formatDailyGoalBadge(goalId: DailyGoalType = "regular"): string {
  const config = getDailyGoalConfig(goalId);
  return `${config.icon} ${config.title} (${config.targetXp} XP/hari)`;
}
