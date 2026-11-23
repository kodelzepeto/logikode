import { describe, it, expect } from "vitest";
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
} from "../version";

describe("Sistem Versioning & SemVer Sync Gate", () => {
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
});
