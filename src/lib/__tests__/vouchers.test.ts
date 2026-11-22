import { describe, it, expect, beforeEach } from "vitest";
import {
  validateAndApplyVoucher,
  getActiveVouchers,
  SEVEN_DAYS_MS,
} from "../vouchers";
import { createInitialProgress } from "../gamification";
import { UserProgress } from "@/types/user";

describe("Voucher Engine — Pure Functions", () => {
  let baseProgress: UserProgress;

  beforeEach(() => {
    baseProgress = createInitialProgress();
  });

  describe("getActiveVouchers", () => {
    it("harus menyertakan 3 voucher default MVP", () => {
      const vouchers = getActiveVouchers();
      const codes = vouchers.map((v) => v.code);

      expect(codes).toContain("LOGIFREEZE2K");
      expect(codes).toContain("LOGIHEART2K");
      expect(codes).toContain("LOGIPRO7D");
    });

    it("harus menyertakan voucher kustom dari environment variables jika diset", () => {
      const origEnv = process.env.NEXT_PUBLIC_VOUCHER_FREEZE;
      process.env.NEXT_PUBLIC_VOUCHER_FREEZE = "CUSTOMFREEZE";

      const vouchers = getActiveVouchers();
      const codes = vouchers.map((v) => v.code);
      expect(codes).toContain("CUSTOMFREEZE");

      process.env.NEXT_PUBLIC_VOUCHER_FREEZE = origEnv;
    });
  });

  describe("validateAndApplyVoucher", () => {
    it("harus menolak input kosong atau hanya spasi", () => {
      const res1 = validateAndApplyVoucher(baseProgress, "");
      expect(res1.success).toBe(false);
      expect(res1.message).toContain("Masukkan kode voucher");

      const res2 = validateAndApplyVoucher(baseProgress, "   ");
      expect(res2.success).toBe(false);
      expect(res2.message).toContain("Masukkan kode voucher");
    });

    it("harus menolak kode voucher yang tidak terdaftar", () => {
      const res = validateAndApplyVoucher(baseProgress, "KODE_PALSU_123");
      expect(res.success).toBe(false);
      expect(res.message).toContain("tidak valid");
      expect(res.progress).toEqual(baseProgress);
    });

    it("harus berhasil menukarkan LOGIFREEZE2K (+1 Streak Freeze)", () => {
      const res = validateAndApplyVoucher(baseProgress, "LOGIFREEZE2K");

      expect(res.success).toBe(true);
      expect(res.rewardType).toBe("FREEZE");
      expect(res.progress.streakFreezes).toBe(1);
      expect(res.progress.redeemedVouchers).toContain("LOGIFREEZE2K");
      expect(res.message).toContain("Streak Freeze");
    });

    it("harus mendukung case-insensitivity dan trim spasi", () => {
      const res = validateAndApplyVoucher(baseProgress, "   logifreeze2k   ");

      expect(res.success).toBe(true);
      expect(res.progress.streakFreezes).toBe(1);
      expect(res.progress.redeemedVouchers).toContain("LOGIFREEZE2K");
    });

    it("harus berhasil menukarkan LOGIHEART2K (Isi ulang 5 Hearts penuh)", () => {
      const damagedProgress: UserProgress = {
        ...baseProgress,
        hearts: 1,
        lastHeartLostAt: Date.now() - 10000,
      };

      const res = validateAndApplyVoucher(damagedProgress, "LOGIHEART2K");

      expect(res.success).toBe(true);
      expect(res.rewardType).toBe("REFILL");
      expect(res.progress.hearts).toBe(5);
      expect(res.progress.lastHeartLostAt).toBeNull();
      expect(res.progress.redeemedVouchers).toContain("LOGIHEART2K");
    });

    it("harus berhasil menukarkan LOGIPRO7D (Unlimited Hearts selama 7 Hari)", () => {
      const fixedNow = 1700000000000;
      const res = validateAndApplyVoucher(baseProgress, "LOGIPRO7D", fixedNow);

      expect(res.success).toBe(true);
      expect(res.rewardType).toBe("UNLIMITED_7D");
      expect(res.progress.unlimitedHeartsUntil).toBe(fixedNow + SEVEN_DAYS_MS);
      expect(res.progress.hearts).toBe(5);
      expect(res.progress.lastHeartLostAt).toBeNull();
      expect(res.progress.redeemedVouchers).toContain("LOGIPRO7D");
    });

    it("harus memperpanjang durasi Unlimited Hearts jika sudah memiliki durasi aktif", () => {
      const fixedNow = 1700000000000;
      const existingUntil = fixedNow + 3 * 24 * 60 * 60 * 1000; // masih sisa 3 hari
      const progressWithSub: UserProgress = {
        ...baseProgress,
        unlimitedHeartsUntil: existingUntil,
      };

      const res = validateAndApplyVoucher(progressWithSub, "LOGIPRO7D", fixedNow);

      expect(res.success).toBe(true);
      // Diperpanjang 7 hari dari sisa waktu sebelumnya (bukan dari fixedNow)
      expect(res.progress.unlimitedHeartsUntil).toBe(existingUntil + SEVEN_DAYS_MS);
    });

    it("harus menolak voucher yang sudah pernah digunakan sebelumnya (anti-double-claim)", () => {
      const claimedProgress: UserProgress = {
        ...baseProgress,
        redeemedVouchers: ["LOGIFREEZE2K"],
        streakFreezes: 1,
      };

      const res = validateAndApplyVoucher(claimedProgress, "logifreeze2k");

      expect(res.success).toBe(false);
      expect(res.message).toContain("sudah pernah kamu gunakan");
      expect(res.progress.streakFreezes).toBe(1); // tidak bertambah
    });
  });
});
