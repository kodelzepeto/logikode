import { describe, it, expect, beforeEach, vi } from "vitest";
import packageJson from "../../../package.json";
import {
  APP_VERSION,
  APP_NAME,
  APP_AUTHOR,
  RELEASE_NOTES,
  CHANGELOG_ENTRIES,
  getAppVersion,
  getAppVersionBadge,
  getLatestReleaseNote,
  isNewerVersion,
  shouldShowWhatsNew,
  markVersionAsSeen,
  getLastSeenVersion,
  LAST_SEEN_VERSION_KEY,
} from "../version";

describe("Sistem Versioning & SemVer Sync Gate", () => {
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

  it("harus sinkron 100% antara APP_VERSION di version.ts dan version di package.json", () => {
    expect(APP_VERSION).toBe(packageJson.version);
    expect(getAppVersion()).toBe(packageJson.version);
  });

  it("harus mematuhi format Semantic Versioning (SemVer: X.Y.Z)", () => {
    const semVerRegex = /^\d+\.\d+\.\d+$/;
    expect(APP_VERSION).toMatch(semVerRegex);
    expect(packageJson.version).toMatch(semVerRegex);
  });

  it("harus memiliki entri catatan rilis terbaru yang cocok dengan APP_VERSION", () => {
    expect(RELEASE_NOTES.length).toBeGreaterThan(0);
    const latest = getLatestReleaseNote();
    expect(latest.version).toBe(APP_VERSION);
    expect(latest.highlights.length).toBeGreaterThan(0);
  });

  it("CHANGELOG_ENTRIES harus identik dengan RELEASE_NOTES", () => {
    expect(CHANGELOG_ENTRIES).toBe(RELEASE_NOTES);
  });

  it("badge versi harus memuat nama aplikasi, nomor versi, dan Core Dev Group", () => {
    const badge = getAppVersionBadge();
    expect(badge).toContain(APP_NAME);
    expect(badge).toContain(`v${APP_VERSION}`);
    expect(badge).toContain(APP_AUTHOR);
  });

  it("isNewerVersion harus dapat membandingkan SemVer dengan akurat", () => {
    expect(isNewerVersion("1.0.2", "1.0.1")).toBe(true);
    expect(isNewerVersion("1.1.0", "1.0.9")).toBe(true);
    expect(isNewerVersion("2.0.0", "1.9.9")).toBe(true);
    expect(isNewerVersion("1.0.1", "1.0.1")).toBe(false);
    expect(isNewerVersion("1.0.0", "1.0.1")).toBe(false);
  });

  describe("Modal Apa yang Baru (What's New Helper)", () => {
    it("shouldShowWhatsNew harus true jika belum pernah membuka versi apapun (null)", () => {
      expect(shouldShowWhatsNew("1.0.2", null)).toBe(true);
    });

    it("shouldShowWhatsNew harus true jika versi saat ini lebih baru dari versi tersimpan", () => {
      expect(shouldShowWhatsNew("1.0.2", "1.0.1")).toBe(true);
      expect(shouldShowWhatsNew("1.1.0", "1.0.2")).toBe(true);
    });

    it("shouldShowWhatsNew harus false jika versi saat ini sama atau lebih lama dari versi tersimpan", () => {
      expect(shouldShowWhatsNew("1.0.2", "1.0.2")).toBe(false);
      expect(shouldShowWhatsNew("1.0.1", "1.0.2")).toBe(false);
    });

    it("markVersionAsSeen dan getLastSeenVersion harus menyimpan & membaca dari localStorage", () => {
      expect(getLastSeenVersion()).toBeNull();
      markVersionAsSeen("1.0.2");
      expect(getLastSeenVersion()).toBe("1.0.2");
      expect(localStorage.getItem(LAST_SEEN_VERSION_KEY)).toBe("1.0.2");
    });
  });
});
