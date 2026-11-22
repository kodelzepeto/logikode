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

export interface DynamicVoucherInfo {
  isDynamic: true;
  rewardType: VoucherRewardType;
  orderId: string;
  canonicalCode: string;
}

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Daftar voucher aktif standar (Promo / Giveaway / Demo) beserta opsi membaca dari Environment Variables.
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
 * Mendeteksi dan memvalidasi apakah sebuah kode merupakan voucher dinamis berbasis Order ID Lynk.id.
 * Contoh format yang didukung:
 * - FRZ-CDG-12345 / FREEZE-CDG-12345 / FRZ-12345 (Streak Freeze)
 * - RFL-CDG-12345 / REFILL-CDG-12345 / RFL-12345 (Refill 5 Hearts)
 * - UNL-CDG-12345 / UNLIMITED-CDG-12345 / UNL-12345 / PRO-CDG-12345 (Unlimited Hearts 7 Hari)
 */
export function parseDynamicOrderVoucher(
  rawCode: string
): DynamicVoucherInfo | { error: string } | null {
  const normalized = rawCode.trim().toUpperCase();
  const salt = (process.env.NEXT_PUBLIC_VOUCHER_SALT || "CDG")
    .trim()
    .toUpperCase();

  const freezePrefixes = [
    `FRZ-${salt}-`,
    `FREEZE-${salt}-`,
    "FRZ-CDG-",
    "FREEZE-CDG-",
    "FRZ-",
    "FREEZE-",
  ];
  const refillPrefixes = [
    `RFL-${salt}-`,
    `REFILL-${salt}-`,
    "RFL-CDG-",
    "REFILL-CDG-",
    "RFL-",
    "REFILL-",
    `HEART-${salt}-`,
    "HEART-CDG-",
    "HEART-",
  ];
  const unlimitedPrefixes = [
    `UNL-${salt}-`,
    `UNLIMITED-${salt}-`,
    "UNL-CDG-",
    "UNLIMITED-CDG-",
    "UNL-",
    "UNLIMITED-",
    `PRO-${salt}-`,
    "PRO-CDG-",
    "PRO-",
  ];

  let matchedReward: VoucherRewardType | null = null;
  let matchedPrefix = "";

  for (const prefix of freezePrefixes) {
    if (normalized.startsWith(prefix)) {
      matchedReward = "FREEZE";
      matchedPrefix = prefix;
      break;
    }
  }

  if (!matchedReward) {
    for (const prefix of refillPrefixes) {
      if (normalized.startsWith(prefix)) {
        matchedReward = "REFILL";
        matchedPrefix = prefix;
        break;
      }
    }
  }

  if (!matchedReward) {
    for (const prefix of unlimitedPrefixes) {
      if (normalized.startsWith(prefix)) {
        matchedReward = "UNLIMITED_7D";
        matchedPrefix = prefix;
        break;
      }
    }
  }

  if (!matchedReward) {
    return null; // Bukan format voucher dinamis, lanjut ke pencocokan voucher statis
  }

  // Bersihkan ID Order dari simbol # atau spasi
  const rawOrderId = normalized
    .substring(matchedPrefix.length)
    .replace(/^#+/, "")
    .trim();

  // Validasi panjang minimum nomor order
  if (rawOrderId.length < 3) {
    return {
      error: `Format nomor order pada kode "${normalized}" terlalu pendek. Pastikan menyertakan Nomor Order minimal 3 karakter dari bukti transaksi Lynk.id.`,
    };
  }

  // Tolak kata-kata dummy / contoh
  const dummyKeywords = [
    "TEST",
    "CONTOH",
    "SAMPLE",
    "DUMMY",
    "ORDERID",
    "ORDER",
    "NOMORORDER",
    "XXXX",
    "0000",
  ];
  if (dummyKeywords.includes(rawOrderId)) {
    return {
      error: `Nomor order "${rawOrderId}" adalah teks contoh. Masukkan Nomor Order asli yang kamu dapatkan di bukti transaksi Lynk.id!`,
    };
  }

  return {
    isDynamic: true,
    rewardType: matchedReward,
    orderId: rawOrderId,
    canonicalCode: `${matchedReward}_ORDER_${rawOrderId}`,
  };
}

/**
 * Memvalidasi dan menerapkan hadiah voucher ke UserProgress secara murni (pure function).
 * Mendukung voucher promo statis DAN voucher dinamis berbasis Order ID Lynk.id (bisa dibeli berkali-kali).
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

  // 1. Cek apakah ini format voucher dinamis berbasis Order ID Lynk.id
  const dynamicParsed = parseDynamicOrderVoucher(normalizedCode);

  if (dynamicParsed && "error" in dynamicParsed) {
    return {
      success: false,
      progress,
      message: dynamicParsed.error,
    };
  }

  if (dynamicParsed && "isDynamic" in dynamicParsed) {
    const { rewardType, orderId, canonicalCode } = dynamicParsed;

    // Periksa apakah order ID ini sudah pernah diklaim sebelumnya di browser ini
    if (
      redeemedList.includes(canonicalCode) ||
      redeemedList.includes(normalizedCode)
    ) {
      return {
        success: false,
        progress,
        message: `Nomor Order #${orderId} sudah pernah kamu klaim sebelumnya! Jika baru saja membeli lagi di Lynk.id, silakan masukkan Nomor Order dari transaksi terbarumu.`,
      };
    }

    const updatedRedeemed = [...redeemedList, canonicalCode, normalizedCode];

    switch (rewardType) {
      case "FREEZE": {
        return {
          success: true,
          progress: {
            ...progress,
            streakFreezes: progress.streakFreezes + 1,
            redeemedVouchers: updatedRedeemed,
          },
          rewardType: "FREEZE",
          message: `Selamat! Transaksi #${orderId} berhasil diverifikasi. Kamu mendapatkan +1 Streak Freeze! ❄️`,
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
          message: `Selamat! Transaksi #${orderId} berhasil diverifikasi. 5 Hearts kamu telah terisi penuh! ❤️`,
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
          message: `Luar biasa! Transaksi #${orderId} berhasil diverifikasi. Unlimited Hearts aktif selama 7 hari penuh! ♾️`,
        };
      }
    }
  }

  // 2. Jika bukan format dinamis, validasi terhadap daftar voucher statis (Demo / Promo)
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
      message: `Kode voucher "${normalizedCode}" tidak valid. Jika membeli via Lynk.id, gunakan format: PREFIX-ORDERID (contoh: FRZ-CDG-12345).`,
    };
  }

  const updatedRedeemed = [...redeemedList, normalizedCode];

  // Terapkan efek hadiah sesuai tipe voucher statis
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
