import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadProgress,
  saveProgress,
  clearProgress,
  PROGRESS_STORAGE_KEY,
} from "../storage";
import { createInitialProgress } from "../gamification";
import { UserProgress } from "@/types/user";

describe("Storage Engine — localStorage Persistence", () => {
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};

    const mockLocalStorage = {
      getItem: vi.fn((key: string) => mockStore[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockStore[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStore[key];
      }),
      clear: vi.fn(() => {
        mockStore = {};
      }),
      length: 0,
      key: vi.fn(() => null),
    };

    vi.stubGlobal("localStorage", mockLocalStorage);
    vi.stubGlobal("window", { localStorage: mockLocalStorage });
  });

  it("harus mengembalikan state default jika localStorage masih kosong", () => {
    const loaded = loadProgress();
    const initial = createInitialProgress();

    expect(loaded.xp).toBe(initial.xp);
    expect(loaded.streak).toBe(initial.streak);
    expect(loaded.hearts).toBe(initial.hearts);
    expect(loaded.completedLevels).toEqual([]);
  });

  it("harus menyimpan dan memuat progres pengguna dengan benar", () => {
    const progressToSave: UserProgress = {
      xp: 150,
      streak: 3,
      lastPlayedDate: "2026-11-23",
      streakFreezes: 1,
      hearts: 4,
      lastHeartLostAt: null,
      unlimitedHeartsUntil: null,
      completedLevels: ["level-1-1", "level-1-2"],
      redeemedVouchers: ["LOGIFREEZE2K"],
    };

    saveProgress(progressToSave);
    expect(mockStore[PROGRESS_STORAGE_KEY]).toBeDefined();

    const loaded = loadProgress();
    expect(loaded.xp).toBe(150);
    expect(loaded.streak).toBe(3);
    expect(loaded.completedLevels).toEqual(["level-1-1", "level-1-2"]);
    expect(loaded.streakFreezes).toBe(1);
    expect(loaded.redeemedVouchers).toEqual(["LOGIFREEZE2K"]);
  });

  it("harus backward-compatible dengan data localStorage lama tanpa redeemedVouchers", () => {
    // Data JSON lama dari Fase 1-3 tanpa properti redeemedVouchers
    const legacyData = {
      xp: 200,
      streak: 5,
      lastPlayedDate: "2026-11-23",
      streakFreezes: 2,
      hearts: 5,
      lastHeartLostAt: null,
      unlimitedHeartsUntil: null,
      completedLevels: ["level-1-1"],
    };
    mockStore[PROGRESS_STORAGE_KEY] = JSON.stringify(legacyData);

    const loaded = loadProgress();
    expect(loaded.xp).toBe(200);
    expect(loaded.redeemedVouchers).toEqual([]);
  });

  it("harus fallback ke state default jika data di localStorage corrupt (invalid JSON)", () => {
    mockStore[PROGRESS_STORAGE_KEY] = "{ corrupt_json: ";

    const loaded = loadProgress();
    expect(loaded.xp).toBe(0);
    expect(loaded.streak).toBe(0);
    expect(loaded.hearts).toBe(5);
  });

  it("harus membersihkan data di localStorage saat clearProgress dipanggil", () => {
    saveProgress({
      ...createInitialProgress(),
      xp: 100,
    });
    expect(mockStore[PROGRESS_STORAGE_KEY]).toBeDefined();

    clearProgress();
    expect(mockStore[PROGRESS_STORAGE_KEY]).toBeUndefined();
  });
});
