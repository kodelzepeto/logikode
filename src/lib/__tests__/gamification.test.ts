import { describe, it, expect } from "vitest";
import {
  createInitialProgress,
  calculateLevelXP,
  updateStreak,
  loseHeart,
  regenerateHearts,
  isLevelUnlocked,
  isUnlimitedHeartsActive,
  completeLevelProgress,
  buyItemWithXP,
  getNextHeartCountdownMs,
  formatCountdown,
  MAX_HEARTS,
  HEART_REGEN_INTERVAL_MS,
  getTodayDateString,
} from "../gamification";
import { Level } from "@/types/curriculum";
import { UserProgress } from "@/types/user";

describe("Gamification Engine — Pure Functions", () => {
  describe("createInitialProgress", () => {
    it("harus membuat state awal yang benar dan bersih", () => {
      const initial = createInitialProgress();

      expect(initial.xp).toBe(0);
      expect(initial.streak).toBe(0);
      expect(initial.lastPlayedDate).toBeNull();
      expect(initial.streakFreezes).toBe(0);
      expect(initial.hearts).toBe(MAX_HEARTS);
      expect(initial.lastHeartLostAt).toBeNull();
      expect(initial.unlimitedHeartsUntil).toBeNull();
      expect(initial.completedLevels).toEqual([]);
    });
  });

  describe("calculateLevelXP", () => {
    it("harus menghitung XP untuk level yang pertama kali diselesaikan (+20 bonus)", () => {
      const levelId = "level-1-1";
      const completedLevels: string[] = [];
      const correctAnswers = 5;

      // 5 * 10 (jawaban benar) + 20 (bonus pertama kali) = 70 XP
      const xp = calculateLevelXP(levelId, completedLevels, correctAnswers);
      expect(xp).toBe(70);
    });

    it("harus menghitung XP untuk level yang diulang (+5 bonus)", () => {
      const levelId = "level-1-1";
      const completedLevels: string[] = ["level-1-1"];
      const correctAnswers = 5;

      // 5 * 10 (jawaban benar) + 5 (bonus mengulang) = 55 XP
      const xp = calculateLevelXP(levelId, completedLevels, correctAnswers);
      expect(xp).toBe(55);
    });

    it("harus menangani kasus jika 0 jawaban benar", () => {
      const levelId = "level-1-2";
      const completedLevels: string[] = [];
      const correctAnswers = 0;

      // 0 * 10 + 20 = 20 XP
      const xp = calculateLevelXP(levelId, completedLevels, correctAnswers);
      expect(xp).toBe(20);
    });
  });

  describe("updateStreak", () => {
    it("harus menginisialisasi streak = 1 saat pertama kali bermain", () => {
      const progress = createInitialProgress();
      const today = "2026-11-23";

      const result = updateStreak(progress, today);
      expect(result.streak).toBe(1);
      expect(result.lastPlayedDate).toBe(today);
      expect(result.streakFreezes).toBe(0);
    });

    it("tidak boleh mengubah streak jika bermain di hari yang sama", () => {
      const progress: UserProgress = {
        ...createInitialProgress(),
        streak: 5,
        lastPlayedDate: "2026-11-23",
      };
      const today = "2026-11-23";

      const result = updateStreak(progress, today);
      expect(result.streak).toBe(5);
      expect(result.lastPlayedDate).toBe(today);
    });

    it("harus menambah streak +1 jika bermain tepat 1 hari setelahnya", () => {
      const progress: UserProgress = {
        ...createInitialProgress(),
        streak: 5,
        lastPlayedDate: "2026-11-22",
      };
      const today = "2026-11-23";

      const result = updateStreak(progress, today);
      expect(result.streak).toBe(6);
      expect(result.lastPlayedDate).toBe(today);
    });

    it("harus menyelamatkan streak jika bolos 1 hari dan memiliki Streak Freeze", () => {
      const progress: UserProgress = {
        ...createInitialProgress(),
        streak: 7,
        streakFreezes: 2,
        lastPlayedDate: "2026-11-21", // Bolos tanggal 22, main tanggal 23 (selisih 2 hari)
      };
      const today = "2026-11-23";

      const result = updateStreak(progress, today);
      expect(result.streak).toBe(8); // Streak berlanjut
      expect(result.streakFreezes).toBe(1); // Freeze berkurang 1
      expect(result.lastPlayedDate).toBe(today);
    });

    it("harus mereset streak menjadi 1 jika bolos 1 hari tanpa Streak Freeze", () => {
      const progress: UserProgress = {
        ...createInitialProgress(),
        streak: 7,
        streakFreezes: 0,
        lastPlayedDate: "2026-11-21", // Selisih 2 hari
      };
      const today = "2026-11-23";

      const result = updateStreak(progress, today);
      expect(result.streak).toBe(1);
      expect(result.lastPlayedDate).toBe(today);
    });

    it("harus mereset streak jika bolos lebih dari 1 hari meskipun punya Streak Freeze", () => {
      const progress: UserProgress = {
        ...createInitialProgress(),
        streak: 10,
        streakFreezes: 1,
        lastPlayedDate: "2026-11-19", // Selisih 4 hari
      };
      const today = "2026-11-23";

      const result = updateStreak(progress, today);
      expect(result.streak).toBe(1);
      expect(result.lastPlayedDate).toBe(today);
    });
  });

  describe("Hearts / Nyawa Logic", () => {
    it("harus mengurangi nyawa sebanyak 1 saat menjawab salah", () => {
      const progress = createInitialProgress(); // hearts = 5
      const now = new Date("2026-11-23T10:00:00").getTime();

      const result = loseHeart(progress, now);
      expect(result.hearts).toBe(4);
      expect(result.lastHeartLostAt).toBe(now);
    });

    it("tidak boleh mengurangi nyawa di bawah 0", () => {
      const now = new Date("2026-11-23T10:00:00").getTime();
      const progress: UserProgress = {
        ...createInitialProgress(),
        hearts: 0,
        lastHeartLostAt: now,
      };

      const result = loseHeart(progress, now + 5000);
      expect(result.hearts).toBe(0);
    });

    it("harus kebal dari pengurangan nyawa saat Unlimited Hearts aktif", () => {
      const now = new Date("2026-11-23T10:00:00").getTime();
      const progress: UserProgress = {
        ...createInitialProgress(),
        hearts: 3,
        unlimitedHeartsUntil: now + 3600000, // aktif 1 jam ke depan
      };

      expect(isUnlimitedHeartsActive(progress, now)).toBe(true);

      const result = loseHeart(progress, now + 1000);
      expect(result.hearts).toBe(3); // Tetap 3, tidak berkurang
    });

    it("harus meregenerasi +1 Heart setelah 5 menit berlalu di hari yang sama", () => {
      const baseDate = new Date("2026-11-23T10:00:00");
      const lostTime = baseDate.getTime();
      const todayStr = getTodayDateString(baseDate);

      const progress: UserProgress = {
        ...createInitialProgress(),
        hearts: 3,
        lastHeartLostAt: lostTime,
        lastPlayedDate: todayStr,
      };

      // Tepat 5 menit kemudian di hari yang sama
      const now = lostTime + HEART_REGEN_INTERVAL_MS;
      const result = regenerateHearts(progress, now, todayStr);

      expect(result.hearts).toBe(4);
      expect(result.lastHeartLostAt).toBe(now);
    });

    it("harus meregenerasi penuh (5) dan mereset lastHeartLostAt jika waktu cukup di hari yang sama", () => {
      const baseDate = new Date("2026-11-23T10:00:00");
      const lostTime = baseDate.getTime();
      const todayStr = getTodayDateString(baseDate);

      const progress: UserProgress = {
        ...createInitialProgress(),
        hearts: 3,
        lastHeartLostAt: lostTime,
        lastPlayedDate: todayStr,
      };

      // 2 jam kemudian (4 interval * 30 menit)
      const now = lostTime + 4 * HEART_REGEN_INTERVAL_MS;
      const result = regenerateHearts(progress, now, todayStr);

      expect(result.hearts).toBe(5);
      expect(result.lastHeartLostAt).toBeNull();
    });

    it("harus memulihkan nyawa penuh (5) saat berganti hari", () => {
      const yesterday = new Date("2026-11-22T20:00:00");
      const lostTime = yesterday.getTime();
      const progress: UserProgress = {
        ...createInitialProgress(),
        hearts: 1,
        lastHeartLostAt: lostTime,
        lastPlayedDate: "2026-11-22",
      };

      // Hari berikutnya (23 November 2026)
      const result = regenerateHearts(
        progress,
        lostTime + 3600000,
        "2026-11-23"
      );
      expect(result.hearts).toBe(5);
      expect(result.lastHeartLostAt).toBeNull();
    });
  });

  describe("getNextHeartCountdownMs & formatCountdown", () => {
    it("harus mengembalikan 0 ms jika hearts sudah 5 (penuh)", () => {
      const progress = createInitialProgress();
      expect(getNextHeartCountdownMs(progress)).toBe(0);
    });

    it("harus mengembalikan 0 ms jika Unlimited Hearts aktif", () => {
      const now = 1700000000000;
      const progress: UserProgress = {
        ...createInitialProgress(),
        hearts: 2,
        unlimitedHeartsUntil: now + 60000,
      };
      expect(getNextHeartCountdownMs(progress, now)).toBe(0);
    });

    it("harus menghitung sisa waktu mundur secara tepat saat hearts < 5", () => {
      const now = 1700000000000;
      // Kehilangan nyawa 2 menit lalu (sisa 3 menit = 180.000 ms)
      const progress: UserProgress = {
        ...createInitialProgress(),
        hearts: 4,
        lastHeartLostAt: now - 2 * 60 * 1000,
      };

      const ms = getNextHeartCountdownMs(progress, now);
      expect(ms).toBe(3 * 60 * 1000);
      expect(formatCountdown(ms)).toBe("03:00");
    });

    it("harus memformat countdown ke format mm:ss", () => {
      expect(formatCountdown(0)).toBe("00:00");
      expect(formatCountdown(65 * 1000)).toBe("01:05");
      expect(formatCountdown(299 * 1000)).toBe("04:59");
    });
  });

  describe("isLevelUnlocked", () => {
    const mockLevels: Level[] = [
      { id: "lvl-1", title: "Lvl 1", description: "", questions: [] },
      { id: "lvl-2", title: "Lvl 2", description: "", questions: [] },
      { id: "lvl-3", title: "Lvl 3", description: "", questions: [] },
    ];

    it("harus selalu membuka level pertama (index 0)", () => {
      const unlocked = isLevelUnlocked("lvl-1", mockLevels, []);
      expect(unlocked).toBe(true);
    });

    it("harus mengunci level kedua jika level pertama belum selesai", () => {
      const unlocked = isLevelUnlocked("lvl-2", mockLevels, []);
      expect(unlocked).toBe(false);
    });

    it("harus membuka level kedua jika level pertama sudah selesai", () => {
      const unlocked = isLevelUnlocked("lvl-2", mockLevels, ["lvl-1"]);
      expect(unlocked).toBe(true);
    });

    it("harus mengunci level ketiga jika level kedua belum selesai", () => {
      const unlocked = isLevelUnlocked("lvl-3", mockLevels, ["lvl-1"]);
      expect(unlocked).toBe(false);
    });

    it("harus mengembalikan false untuk level yang tidak terdaftar", () => {
      const unlocked = isLevelUnlocked("lvl-unknown", mockLevels, ["lvl-1"]);
      expect(unlocked).toBe(false);
    });
  });

  describe("completeLevelProgress", () => {
    const mockLevels: Level[] = [
      { id: "lvl-1", title: "Lvl 1", description: "", questions: [] },
      { id: "lvl-2", title: "Lvl 2", description: "", questions: [] },
    ];

    it("harus menghasilkan UserProgress yang terupdate secara utuh", () => {
      const baseDate = new Date("2026-11-23T10:00:00");
      const initial = createInitialProgress();
      const updated = completeLevelProgress(
        initial,
        "lvl-1",
        mockLevels,
        5,
        baseDate.getTime(),
        "2026-11-23"
      );

      expect(updated.xp).toBe(70); // 50 + 20
      expect(updated.streak).toBe(1);
      expect(updated.lastPlayedDate).toBe("2026-11-23");
      expect(updated.completedLevels).toContain("lvl-1");
      expect(updated.hearts).toBe(5);
    });
  });

  describe("buyItemWithXP", () => {
    it("harus berhasil membeli Streak Freeze jika XP mencukupi (>= 100 XP)", () => {
      const initial = { ...createInitialProgress(), xp: 150, streakFreezes: 0 };
      const res = buyItemWithXP(initial, "streak_freeze");

      expect(res.success).toBe(true);
      expect(res.progress.xp).toBe(50);
      expect(res.progress.streakFreezes).toBe(1);
      expect(res.message).toContain("Streak Freeze");
    });

    it("harus gagal membeli Streak Freeze jika XP kurang dari 100", () => {
      const initial = { ...createInitialProgress(), xp: 80, streakFreezes: 0 };
      const res = buyItemWithXP(initial, "streak_freeze");

      expect(res.success).toBe(false);
      expect(res.progress.xp).toBe(80);
      expect(res.progress.streakFreezes).toBe(0);
      expect(res.message).toContain("XP kamu belum cukup");
    });

    it("harus berhasil membeli Refill 5 Hearts jika XP cukup dan hearts < 5", () => {
      const initial = {
        ...createInitialProgress(),
        xp: 100,
        hearts: 2,
        lastHeartLostAt: Date.now() - 5000,
      };
      const res = buyItemWithXP(initial, "refill_hearts");

      expect(res.success).toBe(true);
      expect(res.progress.xp).toBe(50);
      expect(res.progress.hearts).toBe(5);
      expect(res.progress.lastHeartLostAt).toBeNull();
      expect(res.message).toContain("5 Hearts");
    });

    it("harus gagal membeli Refill Hearts jika hearts sudah 5 (maksimal)", () => {
      const initial = { ...createInitialProgress(), xp: 100, hearts: 5 };
      const res = buyItemWithXP(initial, "refill_hearts");

      expect(res.success).toBe(false);
      expect(res.progress.xp).toBe(100);
      expect(res.progress.hearts).toBe(5);
      expect(res.message).toContain("sudah penuh");
    });

    it("harus gagal membeli Refill Hearts jika Unlimited Hearts sedang aktif", () => {
      const now = Date.now();
      const initial = {
        ...createInitialProgress(),
        xp: 100,
        hearts: 2,
        unlimitedHeartsUntil: now + 60000,
      };
      const res = buyItemWithXP(initial, "refill_hearts", now);

      expect(res.success).toBe(false);
      expect(res.progress.xp).toBe(100);
      expect(res.message).toContain("Unlimited Hearts aktif");
    });

    it("harus gagal membeli Refill Hearts jika XP kurang dari 50", () => {
      const initial = { ...createInitialProgress(), xp: 30, hearts: 2 };
      const res = buyItemWithXP(initial, "refill_hearts");

      expect(res.success).toBe(false);
      expect(res.progress.xp).toBe(30);
      expect(res.progress.hearts).toBe(2);
      expect(res.message).toContain("XP kamu belum cukup");
    });
  });
});
