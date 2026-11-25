import { describe, it, expect } from "vitest";
import {
  DAILY_GOAL_OPTIONS,
  getDailyGoalConfig,
  shouldShowOnboarding,
  formatDailyGoalBadge,
  ONBOARDING_STORAGE_KEY,
} from "../onboarding";

describe("Onboarding Pelajar & Target Harian (Hari 3)", () => {
  it("harus memiliki 4 pilihan target ritme belajar yang valid", () => {
    expect(DAILY_GOAL_OPTIONS.length).toBe(4);
    const ids = DAILY_GOAL_OPTIONS.map((g) => g.id);
    expect(ids).toEqual(["casual", "regular", "serious", "intense"]);

    for (const option of DAILY_GOAL_OPTIONS) {
      expect(option.targetXp).toBeGreaterThan(0);
      expect(option.levelsPerDay).toBeGreaterThan(0);
      expect(option.icon.length).toBeGreaterThan(0);
    }
  });

  describe("getDailyGoalConfig", () => {
    it("harus mengembalikan konfigurasi yang sesuai dengan ID target", () => {
      const casual = getDailyGoalConfig("casual");
      expect(casual.title).toBe("Santai");
      expect(casual.targetXp).toBe(30);

      const serious = getDailyGoalConfig("serious");
      expect(serious.title).toBe("Serius");
      expect(serious.targetXp).toBe(100);

      const intense = getDailyGoalConfig("intense");
      expect(intense.title).toBe("Gila Koding");
      expect(intense.targetXp).toBe(150);
    });

    it("harus fallback ke 'regular' jika id tidak valid atau undefined", () => {
      // @ts-expect-error test fallback
      const fallback = getDailyGoalConfig("unknown_goal");
      expect(fallback.id).toBe("regular");
      expect(fallback.title).toBe("Biasa");
    });
  });

  describe("shouldShowOnboarding", () => {
    it("harus TRUE untuk pengguna baru (belum selesai onboarding & level selesai 0)", () => {
      expect(shouldShowOnboarding(false, 0, false)).toBe(true);
      expect(shouldShowOnboarding(undefined, 0, false)).toBe(true);
    });

    it("harus FALSE jika onboarding sudah selesai di data progress", () => {
      expect(shouldShowOnboarding(true, 0, false)).toBe(false);
    });

    it("harus FALSE jika flag di localStorage sudah ada", () => {
      expect(shouldShowOnboarding(false, 0, true)).toBe(false);
    });

    it("harus FALSE untuk pengguna lama yang sudah pernah menamatkan level", () => {
      expect(shouldShowOnboarding(false, 2, false)).toBe(false);
      expect(shouldShowOnboarding(false, 1, false)).toBe(false);
    });
  });

  describe("formatDailyGoalBadge", () => {
    it("harus memformat badge target harian secara informatif", () => {
      const badge = formatDailyGoalBadge("regular");
      expect(badge).toContain("🚀");
      expect(badge).toContain("Biasa");
      expect(badge).toContain("60 XP/hari");
    });
  });

  it("memiliki storage key yang konsisten", () => {
    expect(ONBOARDING_STORAGE_KEY).toBe("logikode_onboarding_completed");
  });
});
