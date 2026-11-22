import { UserProgress } from "@/types/user";
import { MAX_HEARTS } from "./gamification";

export type VoucherRewardType = "FREEZE" | "REFILL" | "UNLIMITED_7D";

export interface VoucherDefinition {
  code: string;
  rewardType: VoucherRewardType;
  title: string;
  description: string;
}

export interface VoucherRedeemResult {
  success: boolean;
  progress: UserProgress;
  message: string;
  rewardType?: VoucherRewardType;
}

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Daftar voucher aktif standar (Demo/MVP) beserta opsi membaca dari Environment Variables.
 */
export function getActiveVouchers(): VoucherDefinition[] {
  const baseVouchers: VoucherDefinition[] = [
    {
      code: "LOGIFREEZE2K",
      rewardType: "FREEZE",
      title: "1x Streak Freeze",
      description: "Melindungi streak harianmu selama 1 hari.",
    },
    {
      code: "LOGIHEART2K",
      rewardType: "REFILL",
      title: "Isi Ulang 5 Hearts",
      description: "Memulihkan 5 nyawa penuh seketika.",
    },
    {
      code: "LOGIPRO7D",
      rewardType: "UNLIMITED_7D",
      title: "Unlimited Hearts (7 Hari)",
      description: "Akses tanpa batas nyawa selama seminggu penuh.",
    },
  ];

  // Tambahkan voucher kustom dari environment variable jika tersedia
  if (process.env.NEXT_PUBLIC_VOUCHER_FREEZE) {
    baseVouchers.push({
      code: process.env.NEXT_PUBLIC_VOUCHER_FREEZE.trim().toUpperCase(),
      rewardType: "FREEZE",
      title: "1x Streak Freeze (Kustom)",
      description: "Melindungi streak harianmu selama 1 hari.",
    });
  }

  if (process.env.NEXT_PUBLIC_VOUCHER_REFILL) {
    baseVouchers.push({
      code: process.env.NEXT_PUBLIC_VOUCHER_REFILL.trim().toUpperCase(),
      rewardType: "REFILL",
      title: "Isi Ulang 5 Hearts (Kustom)",
      description: "Memulihkan 5 nyawa penuh seketika.",
    });
  }

  if (process.env.NEXT_PUBLIC_VOUCHER_UNLIMITED) {
    baseVouchers.push({
      code: process.env.NEXT_PUBLIC_VOUCHER_UNLIMITED.trim().toUpperCase(),
      rewardType: "UNLIMITED_7D",
      title: "Unlimited Hearts 7 Hari (Kustom)",
      description: "Akses tanpa batas nyawa selama seminggu penuh.",
    });
  }

  return baseVouchers;
}

/**
 * Memvalidasi dan menerapkan hadiah voucher ke UserProgress secara murni (pure function).
 */
export function validateAndApplyVoucher(
  progress: UserProgress,
  rawCode: string,
  nowTimestamp: number = Date.now()
): VoucherRedeemResult {
  if (!rawCode || rawCode.trim().length === 0) {
    return {
      success: false,
      progress,
      message: "Masukkan kode voucher terlebih dahulu.",
    };
  }

  const normalizedCode = rawCode.trim().toUpperCase();
  const redeemedList = progress.redeemedVouchers ?? [];

  // Pengecekan apakah voucher sudah pernah digunakan
  if (redeemedList.includes(normalizedCode)) {
    return {
      success: false,
      progress,
      message: `Kode voucher "${normalizedCode}" sudah pernah kamu gunakan sebelumnya!`,
    };
  }

  const activeVouchers = getActiveVouchers();
  const matchedVoucher = activeVouchers.find(
    (v) => v.code === normalizedCode
  );

  if (!matchedVoucher) {
    return {
      success: false,
      progress,
      message: `Kode voucher "${normalizedCode}" tidak valid atau tidak terdaftar.`,
    };
  }

  const updatedRedeemed = [...redeemedList, normalizedCode];

  // Terapkan efek hadiah sesuai tipe voucher
  switch (matchedVoucher.rewardType) {
    case "FREEZE": {
      return {
        success: true,
        progress: {
          ...progress,
          streakFreezes: progress.streakFreezes + 1,
          redeemedVouchers: updatedRedeemed,
        },
        rewardType: "FREEZE",
        message: "Selamat! Kamu berhasil menukarkan 1x Streak Freeze! ❄️",
      };
    }

    case "REFILL": {
      return {
        success: true,
        progress: {
          ...progress,
          hearts: MAX_HEARTS,
          lastHeartLostAt: null,
          redeemedVouchers: updatedRedeemed,
        },
        rewardType: "REFILL",
        message: "Selamat! 5 Hearts kamu telah dipulihkan penuh! ❤️",
      };
    }

    case "UNLIMITED_7D": {
      const currentUntil = progress.unlimitedHeartsUntil ?? nowTimestamp;
      const baseStart = Math.max(nowTimestamp, currentUntil);
      const newUntil = baseStart + SEVEN_DAYS_MS;

      return {
        success: true,
        progress: {
          ...progress,
          unlimitedHeartsUntil: newUntil,
          hearts: MAX_HEARTS,
          lastHeartLostAt: null,
          redeemedVouchers: updatedRedeemed,
        },
        rewardType: "UNLIMITED_7D",
        message: "Luar biasa! Unlimited Hearts aktif selama 7 hari penuh! ♾️",
      };
    }

    default: {
      return {
        success: false,
        progress,
        message: "Tipe hadiah voucher tidak dikenali.",
      };
    }
  }
}
