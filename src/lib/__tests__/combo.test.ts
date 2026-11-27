import { describe, it, expect } from "vitest";
import {
  getComboMilestone,
  updateCombo,
  formatComboLabel,
  getComboSoundType,
} from "../combo";
import { playCombo3, playCombo5, playComboSound } from "../sound";

describe("Quiz Combo Streak System — Logic & Milestones", () => {
  it("harus mengembalikan null untuk combo di bawah 3 atau non-milestone", () => {
    expect(getComboMilestone(0)).toBeNull();
    expect(getComboMilestone(1)).toBeNull();
    expect(getComboMilestone(2)).toBeNull();
    expect(getComboMilestone(4)).toBeNull();
    expect(getComboMilestone(6)).toBeNull();
  });

  it("harus mendeteksi milestone 3x Combo dengan benar", () => {
    const milestone3 = getComboMilestone(3);
    expect(milestone3).not.toBeNull();
    expect(milestone3?.count).toBe(3);
    expect(milestone3?.badgeText).toBe("3x Combo!");
    expect(milestone3?.icon).toBe("🔥");
    expect(milestone3?.theme).toBe("amber");
  });

  it("harus mendeteksi milestone 5x Combo dengan benar", () => {
    const milestone5 = getComboMilestone(5);
    expect(milestone5).not.toBeNull();
    expect(milestone5?.count).toBe(5);
    expect(milestone5?.badgeText).toBe("5x Combo!");
    expect(milestone5?.icon).toBe("⚡");
    expect(milestone5?.theme).toBe("orange");
  });

  it("harus mendeteksi milestone 7x Super Combo dan kelipatan 5 berikutnya", () => {
    const milestone7 = getComboMilestone(7);
    expect(milestone7).not.toBeNull();
    expect(milestone7?.count).toBe(7);
    expect(milestone7?.badgeText).toBe("7x Super Combo!");

    const milestone10 = getComboMilestone(10);
    expect(milestone10).not.toBeNull();
    expect(milestone10?.count).toBe(10);
    expect(milestone10?.badgeText).toContain("10x Mega Combo!");
  });

  it("harus menambah combo saat jawaban benar dan memicu milestone", () => {
    // 0 -> 1 (Benar, belum milestone)
    const step1 = updateCombo(0, true);
    expect(step1.newCombo).toBe(1);
    expect(step1.milestone).toBeNull();

    // 1 -> 2 (Benar, belum milestone)
    const step2 = updateCombo(step1.newCombo, true);
    expect(step2.newCombo).toBe(2);
    expect(step2.milestone).toBeNull();

    // 2 -> 3 (Benar, memicu 3x combo milestone!)
    const step3 = updateCombo(step2.newCombo, true);
    expect(step3.newCombo).toBe(3);
    expect(step3.milestone).not.toBeNull();
    expect(step3.milestone?.badgeText).toBe("3x Combo!");

    // 3 -> 4 (Benar, tidak ada milestone)
    const step4 = updateCombo(step3.newCombo, true);
    expect(step4.newCombo).toBe(4);
    expect(step4.milestone).toBeNull();

    // 4 -> 5 (Benar, memicu 5x combo milestone!)
    const step5 = updateCombo(step4.newCombo, true);
    expect(step5.newCombo).toBe(5);
    expect(step5.milestone).not.toBeNull();
    expect(step5.milestone?.badgeText).toBe("5x Combo!");
  });

  it("harus mereset combo ke 0 saat jawaban salah", () => {
    const wrongAfterStreak = updateCombo(4, false);
    expect(wrongAfterStreak.newCombo).toBe(0);
    expect(wrongAfterStreak.milestone).toBeNull();

    const wrongAtZero = updateCombo(0, false);
    expect(wrongAtZero.newCombo).toBe(0);
    expect(wrongAtZero.milestone).toBeNull();
  });

  it("harus memformat label combo dengan benar", () => {
    expect(formatComboLabel(0)).toBe("");
    expect(formatComboLabel(1)).toBe("");
    expect(formatComboLabel(2)).toBe("2x Combo");
    expect(formatComboLabel(5)).toBe("5x Combo");
  });

  it("harus menentukan tipe efek suara yang sesuai berdasarkan hitungan combo", () => {
    expect(getComboSoundType(0)).toBe("correct");
    expect(getComboSoundType(1)).toBe("correct");
    expect(getComboSoundType(2)).toBe("correct");
    expect(getComboSoundType(3)).toBe("combo_3");
    expect(getComboSoundType(4)).toBe("combo_3");
    expect(getComboSoundType(5)).toBe("combo_5");
    expect(getComboSoundType(8)).toBe("combo_5");
  });

  it("fungsi suara combo tidak boleh throw error saat dijalankan di lingkungan NodeJS/SSR", () => {
    expect(() => playCombo3()).not.toThrow();
    expect(() => playCombo5()).not.toThrow();
    expect(() => playComboSound(1)).not.toThrow();
    expect(() => playComboSound(3)).not.toThrow();
    expect(() => playComboSound(5)).not.toThrow();
  });
});
