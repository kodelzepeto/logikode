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
}
