import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isSoundMuted,
  setSoundMuted,
  toggleSoundMuted,
  playClick,
  playCorrect,
  playWrong,
  playLevelComplete,
} from "../sound";

describe("Sound Synthesizer Engine (Web Audio API)", () => {
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
    vi.stubGlobal("window", {
      localStorage: mockLocalStorage,
      dispatchEvent: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("harus default ke status unmuted (false)", () => {
    expect(isSoundMuted()).toBe(false);
  });

  it("harus dapat mengubah dan menyimpan status mute ke localStorage", () => {
    setSoundMuted(true);
    expect(isSoundMuted()).toBe(true);
    expect(localStorage.getItem("logikode_sound_muted")).toBe("true");

    setSoundMuted(false);
    expect(isSoundMuted()).toBe(false);
  });

  it("harus membalikkan status mute dengan toggleSoundMuted", () => {
    expect(toggleSoundMuted()).toBe(true);
    expect(isSoundMuted()).toBe(true);

    expect(toggleSoundMuted()).toBe(false);
    expect(isSoundMuted()).toBe(false);
  });

  it("fungsi pemutar suara tidak boleh throw error saat dipanggil di lingkungan SSR/NodeJS", () => {
    expect(() => playClick()).not.toThrow();
    expect(() => playCorrect()).not.toThrow();
    expect(() => playWrong()).not.toThrow();
    expect(() => playLevelComplete()).not.toThrow();
  });
});
