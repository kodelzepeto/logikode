export type DailyGoalType = "casual" | "regular" | "serious" | "intense";

export interface DailyQuestProgress {
  date: string; // format YYYY-MM-DD
  levelsCompleted: number;
  correctAnswers: number;
  xpEarned: number;
  claimedQuests: string[]; // daftar ID quest yang sudah diklaim hari ini
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastPlayedDate: string | null; // format YYYY-MM-DD
  streakFreezes: number;
  hearts: number; // 0 - 5
  lastHeartLostAt: number | null; // timestamp epoch ms
  unlimitedHeartsUntil: number | null; // timestamp epoch ms
  completedLevels: string[]; // daftar ID level yang telah diselesaikan
  redeemedVouchers: string[]; // daftar kode voucher yang sudah pernah digunakan
  userName?: string; // nama panggilan pengguna (opsional / default: "Pelajar LogiKode")
  dailyGoal?: DailyGoalType; // target ritme belajar harian (default: "regular")
  onboardingCompleted?: boolean; // status penyelesaian onboarding 3-slide
  dailyQuestProgress?: DailyQuestProgress; // progres misi harian yang di-reset tiap hari
}
