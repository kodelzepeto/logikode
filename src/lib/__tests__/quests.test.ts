import { describe, it, expect } from "vitest";
import {
  DAILY_QUEST_DEFINITIONS,
  createInitialDailyQuestProgress,
  getOrResetDailyQuestProgress,
  calculateQuestStatus,
  updateDailyQuestMetrics,
  claimQuestReward,
  getClaimableQuestsCount,
  getDailyQuestsSummary,
  getTimeUntilMidnight,
  getQuestDateString,
} from "../quests";
import { UserProgress } from "@/types/user";

function createMockProgress(overrides: Partial<UserProgress> = {}): UserProgress {
  return {
    xp: 100,
    streak: 3,
    lastPlayedDate: "2026-11-26",
    streakFreezes: 1,
    hearts: 5,
    lastHeartLostAt: null,
    unlimitedHeartsUntil: null,
    completedLevels: ["level-1-1"],
    redeemedVouchers: [],
    userName: "Amin",
    dailyGoal: "regular",
    onboardingCompleted: true,
    ...overrides,
  };
}

describe("Daily Quests System — Logic & Mechanics", () => {
  it("harus membuat state awal DailyQuestProgress dengan nilai default 0 dan tanggal hari ini", () => {
    const today = "2026-11-26";
    expect(getQuestDateString(new Date("2026-11-26T10:00:00"))).toBe(today);
    const initial = createInitialDailyQuestProgress(today);

    expect(initial.date).toBe(today);
    expect(initial.levelsCompleted).toBe(0);
    expect(initial.correctAnswers).toBe(0);
    expect(initial.xpEarned).toBe(0);
    expect(initial.claimedQuests).toEqual([]);
  });

  it("harus mereset progres harian jika tanggal berbeda (Midnight Reset)", () => {
    const oldProgress = createMockProgress({
      dailyQuestProgress: {
        date: "2026-11-25",
        levelsCompleted: 2,
        correctAnswers: 15,
        xpEarned: 80,
        claimedQuests: ["quest_complete_level"],
      },
    });

    const activeToday = getOrResetDailyQuestProgress(oldProgress, "2026-11-26");

    expect(activeToday.date).toBe("2026-11-26");
    expect(activeToday.levelsCompleted).toBe(0);
    expect(activeToday.correctAnswers).toBe(0);
    expect(activeToday.xpEarned).toBe(0);
    expect(activeToday.claimedQuests).toEqual([]);
  });

  it("harus mempertahankan progres harian jika tanggal sama", () => {
    const existingProgress = createMockProgress({
      dailyQuestProgress: {
        date: "2026-11-26",
        levelsCompleted: 1,
        correctAnswers: 8,
        xpEarned: 40,
        claimedQuests: ["quest_complete_level"],
      },
    });

    const active = getOrResetDailyQuestProgress(existingProgress, "2026-11-26");
    expect(active.levelsCompleted).toBe(1);
    expect(active.correctAnswers).toBe(8);
    expect(active.claimedQuests).toContain("quest_complete_level");
  });

  it("harus menghitung status misi dengan persentase dan kondisi claimable yang tepat", () => {
    const quest = DAILY_QUEST_DEFINITIONS.find((q) => q.id === "quest_correct_answers")!;
    expect(quest).toBeDefined();

    // Skenario 1: Baru 5 dari 10 soal benar (50%, belum completed)
    const status1 = calculateQuestStatus(quest, {
      date: "2026-11-26",
      levelsCompleted: 0,
      correctAnswers: 5,
      xpEarned: 25,
      claimedQuests: [],
    });
    expect(status1.current).toBe(5);
    expect(status1.target).toBe(10);
    expect(status1.percent).toBe(50);
    expect(status1.isCompleted).toBe(false);
    expect(status1.isClaimable).toBe(false);
    expect(status1.isClaimed).toBe(false);

    // Skenario 2: Sudah 12 dari 10 soal benar (100% cap, siap klaim)
    const status2 = calculateQuestStatus(quest, {
      date: "2026-11-26",
      levelsCompleted: 1,
      correctAnswers: 12,
      xpEarned: 60,
      claimedQuests: [],
    });
    expect(status2.current).toBe(12);
    expect(status2.percent).toBe(100);
    expect(status2.isCompleted).toBe(true);
    expect(status2.isClaimable).toBe(true);
    expect(status2.isClaimed).toBe(false);

    // Skenario 3: Sudah diklaim
    const status3 = calculateQuestStatus(quest, {
      date: "2026-11-26",
      levelsCompleted: 1,
      correctAnswers: 12,
      xpEarned: 60,
      claimedQuests: ["quest_correct_answers"],
    });
    expect(status3.isCompleted).toBe(true);
    expect(status3.isClaimable).toBe(false);
    expect(status3.isClaimed).toBe(true);
  });

  it("harus mengupdate akumulator metrik harian (levels, correct answers, xp) secara aman", () => {
    const initial = createMockProgress();
    const updated = updateDailyQuestMetrics(
      initial,
      {
        levelsCompletedDelta: 1,
        correctAnswersDelta: 5,
        xpEarnedDelta: 35,
      },
      "2026-11-26"
    );

    expect(updated.dailyQuestProgress?.levelsCompleted).toBe(1);
    expect(updated.dailyQuestProgress?.correctAnswers).toBe(5);
    expect(updated.dailyQuestProgress?.xpEarned).toBe(35);

    // Akumulasi kedua di hari yang sama
    const updatedSecond = updateDailyQuestMetrics(
      updated,
      {
        levelsCompletedDelta: 1,
        correctAnswersDelta: 5,
        xpEarnedDelta: 20,
      },
      "2026-11-26"
    );
    expect(updatedSecond.dailyQuestProgress?.levelsCompleted).toBe(2);
    expect(updatedSecond.dailyQuestProgress?.correctAnswers).toBe(10);
    expect(updatedSecond.dailyQuestProgress?.xpEarned).toBe(55);
  });

  it("harus berhasil mengklaim hadiah XP misi jika target tercapai", () => {
    const progress = createMockProgress({
      xp: 100,
      dailyQuestProgress: {
        date: "2026-11-26",
        levelsCompleted: 1,
        correctAnswers: 10,
        xpEarned: 50,
        claimedQuests: [],
      },
    });

    const result = claimQuestReward(progress, "quest_complete_level", "2026-11-26");

    expect(result.success).toBe(true);
    expect(result.rewardXP).toBe(15);
    expect(result.progress.xp).toBe(115); // 100 + 15 bonus XP
    expect(result.progress.dailyQuestProgress?.claimedQuests).toContain("quest_complete_level");
  });

  it("harus MENOLAK klaim jika target misi belum tercapai", () => {
    const progress = createMockProgress({
      dailyQuestProgress: {
        date: "2026-11-26",
        levelsCompleted: 0,
        correctAnswers: 2,
        xpEarned: 10,
        claimedQuests: [],
      },
    });

    const result = claimQuestReward(progress, "quest_complete_level", "2026-11-26");

    expect(result.success).toBe(false);
    expect(result.rewardXP).toBe(0);
    expect(result.message).toContain("Misi belum selesai");
    expect(result.progress.xp).toBe(progress.xp);
  });

  it("harus MENOLAK klaim ganda (Anti-Double Claim) untuk misi yang sama pada hari yang sama", () => {
    const progress = createMockProgress({
      xp: 100,
      dailyQuestProgress: {
        date: "2026-11-26",
        levelsCompleted: 1,
        correctAnswers: 10,
        xpEarned: 50,
        claimedQuests: ["quest_complete_level"],
      },
    });

    const result = claimQuestReward(progress, "quest_complete_level", "2026-11-26");

    expect(result.success).toBe(false);
    expect(result.message).toContain("sudah kamu klaim");
    expect(result.progress.xp).toBe(100);
  });

  it("harus menghitung jumlah misi siap klaim dan ringkasan penyelesaian dengan akurat", () => {
    const progress = createMockProgress({
      dailyQuestProgress: {
        date: "2026-11-26",
        levelsCompleted: 1, // quest 1 complete
        correctAnswers: 10, // quest 2 complete
        xpEarned: 20, // quest 3 belum (20/50)
        claimedQuests: ["quest_complete_level"], // quest 1 sudah diklaim
      },
    });

    // Quest 1: complete & claimed -> not claimable
    // Quest 2: complete & not claimed -> CLAIMABLE!
    // Quest 3: not complete -> not claimable
    const claimableCount = getClaimableQuestsCount(progress, "2026-11-26");
    expect(claimableCount).toBe(1);

    const summary = getDailyQuestsSummary(progress, "2026-11-26");
    expect(summary.completedCount).toBe(2);
    expect(summary.totalQuests).toBe(3);
    expect(summary.claimedCount).toBe(1);
    expect(summary.allCompleted).toBe(false);
    expect(summary.allClaimed).toBe(false);
  });

  it("harus menghitung sisa waktu hingga tengah malam dalam format HH:MM:SS", () => {
    const mockTime = new Date("2026-11-26T21:45:30");
    const remaining = getTimeUntilMidnight(mockTime);

    // 21:45:30 -> midnight (24:00:00) is 2 hours, 14 minutes, 30 seconds
    expect(remaining.hours).toBe(2);
    expect(remaining.minutes).toBe(14);
    expect(remaining.seconds).toBe(30);
    expect(remaining.formatted).toBe("02:14:30");
  });
});
