import { DailyQuestProgress, UserProgress } from "@/types/user";

export interface QuestDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  rewardXP: number;
  metric: "levelsCompleted" | "correctAnswers" | "xpEarned";
  unitLabel: string;
}

export const DAILY_QUEST_DEFINITIONS: QuestDefinition[] = [
  {
    id: "quest_complete_level",
    title: "Selesaikan 1 Level",
    description: "Tuntaskan minimal 1 level pembelajaran logika koding",
    icon: "🏆",
    target: 1,
    rewardXP: 15,
    metric: "levelsCompleted",
    unitLabel: "level",
  },
  {
    id: "quest_correct_answers",
    title: "Jawab 10 Soal Benar",
    description: "Buktikan ketajaman logikamu dengan 10 jawaban benar",
    icon: "🎯",
    target: 10,
    rewardXP: 20,
    metric: "correctAnswers",
    unitLabel: "soal",
  },
  {
    id: "quest_earn_xp",
    title: "Raih 50 XP Hari Ini",
    description: "Kumpulkan 50 XP dari aktivitas kuis dan latihan logika",
    icon: "⚡",
    target: 50,
    rewardXP: 25,
    metric: "xpEarned",
    unitLabel: "XP",
  },
];

/**
 * Format tanggal hari ini dalam format lokal YYYY-MM-DD.
 */
export function getQuestDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Membuat state awal progres misi harian untuk tanggal tertentu.
 */
export function createInitialDailyQuestProgress(
  todayStr: string = getQuestDateString()
): DailyQuestProgress {
  return {
    date: todayStr,
    levelsCompleted: 0,
    correctAnswers: 0,
    xpEarned: 0,
    claimedQuests: [],
  };
}

/**
 * Mengambil progres misi harian aktif, atau otomatis mereset jika berganti hari (midnight reset).
 */
export function getOrResetDailyQuestProgress(
  progress: UserProgress,
  todayStr: string = getQuestDateString()
): DailyQuestProgress {
  if (!progress.dailyQuestProgress || progress.dailyQuestProgress.date !== todayStr) {
    return createInitialDailyQuestProgress(todayStr);
  }
  return progress.dailyQuestProgress;
}

export interface QuestStatus {
  quest: QuestDefinition;
  current: number;
  target: number;
  percent: number;
  isCompleted: boolean;
  isClaimed: boolean;
  isClaimable: boolean;
}

/**
 * Menghitung status lengkap untuk satu misi harian (current, target, percent, isClaimable, dll).
 */
export function calculateQuestStatus(
  quest: QuestDefinition,
  questProgress: DailyQuestProgress
): QuestStatus {
  let rawValue = 0;
  if (quest.metric === "levelsCompleted") {
    rawValue = questProgress.levelsCompleted;
  } else if (quest.metric === "correctAnswers") {
    rawValue = questProgress.correctAnswers;
  } else if (quest.metric === "xpEarned") {
    rawValue = questProgress.xpEarned;
  }

  const current = Math.max(0, rawValue);
  const target = quest.target;
  const percent = Math.min(100, Math.round((current / target) * 100));
  const isCompleted = current >= target;
  const isClaimed = questProgress.claimedQuests.includes(quest.id);
  const isClaimable = isCompleted && !isClaimed;

  return {
    quest,
    current,
    target,
    percent,
    isCompleted,
    isClaimed,
    isClaimable,
  };
}

/**
 * Memperbarui akumulator metrik harian (levels, correct answers, xp) secara aman.
 */
export function updateDailyQuestMetrics(
  progress: UserProgress,
  update: {
    levelsCompletedDelta?: number;
    correctAnswersDelta?: number;
    xpEarnedDelta?: number;
  },
  todayStr: string = getQuestDateString()
): UserProgress {
  const currentDaily = getOrResetDailyQuestProgress(progress, todayStr);

  const updatedDaily: DailyQuestProgress = {
    date: todayStr,
    levelsCompleted: currentDaily.levelsCompleted + Math.max(0, update.levelsCompletedDelta ?? 0),
    correctAnswers: currentDaily.correctAnswers + Math.max(0, update.correctAnswersDelta ?? 0),
    xpEarned: currentDaily.xpEarned + Math.max(0, update.xpEarnedDelta ?? 0),
    claimedQuests: currentDaily.claimedQuests,
  };

  return {
    ...progress,
    dailyQuestProgress: updatedDaily,
  };
}

export interface ClaimQuestResult {
  success: boolean;
  progress: UserProgress;
  message: string;
  rewardXP: number;
}

/**
 * Mengklaim bonus XP dari misi harian yang telah selesai.
 */
export function claimQuestReward(
  progress: UserProgress,
  questId: string,
  todayStr: string = getQuestDateString()
): ClaimQuestResult {
  const quest = DAILY_QUEST_DEFINITIONS.find((q) => q.id === questId);
  if (!quest) {
    return {
      success: false,
      progress,
      message: "Misi tidak ditemukan.",
      rewardXP: 0,
    };
  }

  const currentDaily = getOrResetDailyQuestProgress(progress, todayStr);
  const status = calculateQuestStatus(quest, currentDaily);

  if (status.isClaimed) {
    return {
      success: false,
      progress,
      message: "Hadiah misi ini sudah kamu klaim hari ini!",
      rewardXP: 0,
    };
  }

  if (!status.isCompleted) {
    return {
      success: false,
      progress,
      message: `Misi belum selesai (${status.current}/${status.target} ${quest.unitLabel}). Selesaikan tantangan untuk klaim bonus!`,
      rewardXP: 0,
    };
  }

  const updatedDaily: DailyQuestProgress = {
    ...currentDaily,
    claimedQuests: [...currentDaily.claimedQuests, quest.id],
  };

  const updatedProgress: UserProgress = {
    ...progress,
    xp: progress.xp + quest.rewardXP,
    dailyQuestProgress: updatedDaily,
  };

  return {
    success: true,
    progress: updatedProgress,
    message: `Selamat! Kamu berhasil mengklaim bonus +${quest.rewardXP} XP dari misi "${quest.title}"! 🎉`,
    rewardXP: quest.rewardXP,
  };
}

/**
 * Menghitung berapa misi harian yang siap diklaim saat ini.
 */
export function getClaimableQuestsCount(
  progress: UserProgress,
  todayStr: string = getQuestDateString()
): number {
  const currentDaily = getOrResetDailyQuestProgress(progress, todayStr);
  return DAILY_QUEST_DEFINITIONS.filter((quest) => {
    const status = calculateQuestStatus(quest, currentDaily);
    return status.isClaimable;
  }).length;
}

/**
 * Menghitung ringkasan penyelesaian misi harian (contoh: 2 dari 3 selesai).
 */
export function getDailyQuestsSummary(
  progress: UserProgress,
  todayStr: string = getQuestDateString()
): {
  completedCount: number;
  totalQuests: number;
  claimedCount: number;
  allCompleted: boolean;
  allClaimed: boolean;
} {
  const currentDaily = getOrResetDailyQuestProgress(progress, todayStr);
  let completedCount = 0;
  let claimedCount = 0;

  for (const quest of DAILY_QUEST_DEFINITIONS) {
    const status = calculateQuestStatus(quest, currentDaily);
    if (status.isCompleted) completedCount++;
    if (status.isClaimed) claimedCount++;
  }

  const totalQuests = DAILY_QUEST_DEFINITIONS.length;

  return {
    completedCount,
    totalQuests,
    claimedCount,
    allCompleted: completedCount >= totalQuests,
    allClaimed: claimedCount >= totalQuests,
  };
}

/**
 * Menghitung sisa waktu hingga tengah malam (reset misi harian).
 */
export function getTimeUntilMidnight(nowDate: Date = new Date()): {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
} {
  const midnight = new Date(nowDate);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = Math.max(0, midnight.getTime() - nowDate.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return {
    hours,
    minutes,
    seconds,
    formatted: `${hh}:${mm}:${ss}`,
  };
}
