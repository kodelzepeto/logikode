import { describe, it, expect } from "vitest";
import { getAllLevels } from "@/data/curriculum";
import { isLevelUnlocked } from "@/lib/gamification";
import { LevelStatus } from "@/components/learning/LevelNode";

describe("UI Logic & Learning Path Calculations", () => {
  const allLevels = getAllLevels();

  it("harus menghitung status node dengan benar untuk user baru (hanya level 1 yang current)", () => {
    const completedLevels: string[] = [];

    const statuses: LevelStatus[] = allLevels.map((lvl) => {
      const isCompleted = completedLevels.includes(lvl.id);
      const unlocked = isLevelUnlocked(lvl.id, allLevels, completedLevels);

      if (isCompleted) return "completed";
      if (unlocked) return "current";
      return "locked";
    });

    // Level pertama harus 'current'
    expect(statuses[0]).toBe("current");
    // Seluruh level berikutnya harus 'locked'
    for (let i = 1; i < statuses.length; i++) {
      expect(statuses[i]).toBe("locked");
    }
  });

  it("harus memperbarui status node saat level 1 dan 2 telah diselesaikan", () => {
    const completedLevels = ["level-1-1", "level-1-2"];

    const statuses: LevelStatus[] = allLevels.map((lvl) => {
      const isCompleted = completedLevels.includes(lvl.id);
      const unlocked = isLevelUnlocked(lvl.id, allLevels, completedLevels);

      if (isCompleted) return "completed";
      if (unlocked) return "current";
      return "locked";
    });

    expect(statuses[0]).toBe("completed");
    expect(statuses[1]).toBe("completed");
    expect(statuses[2]).toBe("current"); // level-1-3 aktif
    expect(statuses[3]).toBe("locked"); // level-2-1 masih terkunci
  });

  it("semua level harus memiliki URL tujuan yang valid", () => {
    for (const level of allLevels) {
      expect(level.id).toBeTruthy();
      const expectedHref = `/lesson/${level.id}`;
      expect(expectedHref.startsWith("/lesson/level-")).toBe(true);
    }
  });
});
