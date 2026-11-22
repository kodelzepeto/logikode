"use client";

import { useSyncExternalStore, useEffect, useState, useCallback } from "react";
import {
  createInitialProgress,
  completeLevelProgress,
  loseHeart,
  regenerateHearts,
  buyItemWithXP,
  getNextHeartCountdownMs,
  formatCountdown,
  updateStreak,
  getTodayDateString,
  MAX_HEARTS,
  ShopItemType,
} from "@/lib/gamification";
import { UserProgress } from "@/types/user";
import {
  validateAndApplyVoucher,
  VoucherRewardType,
} from "@/lib/vouchers";
import {
  getProgressSnapshot,
  setProgressSnapshot,
  subscribeProgress,
  clearProgress,
} from "@/lib/storage";
import { getAllLevels } from "@/data/curriculum";

const serverInitialProgress = createInitialProgress();

// External store untuk status client hydration
const emptySubscribe = () => () => {};
const getClientLoaded = () => true;
const getServerLoaded = () => false;

export function useUserProgress() {
  // Cegah hydration mismatch secara aman dengan useSyncExternalStore
  const isLoaded = useSyncExternalStore(
    emptySubscribe,
    getClientLoaded,
    getServerLoaded
  );

  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    () => serverInitialProgress
  );

  // Aksi: Menyelesaikan satu level kuis
  const completeLevel = useCallback(
    (levelId: string, correctAnswersCount: number) => {
      const current = getProgressSnapshot();
      const allLevels = getAllLevels();
      const updated = completeLevelProgress(
        current,
        levelId,
        allLevels,
        correctAnswersCount
      );
      setProgressSnapshot(updated);
    },
    []
  );

  // Aksi: Mengurangi 1 nyawa saat salah menjawab
  const consumeHeart = useCallback(() => {
    const current = getProgressSnapshot();
    const { hearts, lastHeartLostAt } = loseHeart(current);
    setProgressSnapshot({
      ...current,
      hearts,
      lastHeartLostAt,
    });
  }, []);

  // Aksi: Membeli item menggunakan XP yang dimiliki
  const buyWithXP = useCallback(
    (itemType: ShopItemType): { success: boolean; message: string } => {
      const current = getProgressSnapshot();
      const result = buyItemWithXP(current, itemType);
      if (result.success) {
        setProgressSnapshot(result.progress);
      }
      return {
        success: result.success,
        message: result.message,
      };
    },
    []
  );

  // Aksi: Redeem / klaim kode voucher
  const redeem = useCallback(
    (
      rawCode: string
    ): {
      success: boolean;
      message: string;
      rewardType?: VoucherRewardType;
    } => {
      const current = getProgressSnapshot();
      const result = validateAndApplyVoucher(current, rawCode);
      if (result.success) {
        setProgressSnapshot(result.progress);
      }
      return {
        success: result.success,
        message: result.message,
        rewardType: result.rewardType,
      };
    },
    []
  );

  // Aksi: Menambah item Streak Freeze (misal dari toko / reward)
  const addStreakFreeze = useCallback((count: number = 1) => {
    const current = getProgressSnapshot();
    setProgressSnapshot({
      ...current,
      streakFreezes: current.streakFreezes + Math.max(1, count),
    });
  }, []);

  // Aksi: Mengaktifkan Unlimited Hearts selama durasi tertentu (ms)
  const activateUnlimitedHearts = useCallback((durationMs: number) => {
    const current = getProgressSnapshot();
    const now = Date.now();
    const currentUntil = current.unlimitedHeartsUntil ?? now;
    const newUntil = Math.max(now, currentUntil) + durationMs;

    setProgressSnapshot({
      ...current,
      unlimitedHeartsUntil: newUntil,
      hearts: 5, // Otomatis penuhi hearts saat unlimited aktif
      lastHeartLostAt: null,
    });
  }, []);

  // Aksi: Reset progres pengguna (kembali ke awal)
  const resetProgress = useCallback(() => {
    clearProgress();
    const fresh = createInitialProgress();
    setProgressSnapshot(fresh);
  }, []);

  // Aksi: Menyelesaikan sesi Latihan Acak (Endless Practice)
  const completePractice = useCallback((xpEarned: number) => {
    const current = getProgressSnapshot();
    const now = Date.now();
    const todayStr = getTodayDateString(new Date(now));
    const streakUpdate = updateStreak(current, todayStr);

    const updated: UserProgress = {
      ...current,
      xp: current.xp + xpEarned,
      streak: streakUpdate.streak,
      streakFreezes: streakUpdate.streakFreezes,
      lastPlayedDate: streakUpdate.lastPlayedDate,
    };
    setProgressSnapshot(updated);
  }, []);

  // Live timer tick setiap detik saat hearts < 5 & tidak unlimited
  const [nowTime, setNowTime] = useState<number>(() => Date.now());

  useEffect(() => {
    if (
      progress.hearts >= MAX_HEARTS ||
      (progress.unlimitedHeartsUntil !== null &&
        progress.unlimitedHeartsUntil > Date.now())
    ) {
      return;
    }

    const interval = setInterval(() => {
      const currentNow = Date.now();
      setNowTime(currentNow);

      const current = getProgressSnapshot();
      const regen = regenerateHearts(current, currentNow);
      if (
        regen.hearts !== current.hearts ||
        regen.lastHeartLostAt !== current.lastHeartLostAt
      ) {
        setProgressSnapshot({
          ...current,
          hearts: regen.hearts,
          lastHeartLostAt: regen.lastHeartLostAt,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [progress.hearts, progress.unlimitedHeartsUntil]);

  const countdownMs = getNextHeartCountdownMs(progress, nowTime);
  const countdownFormatted = formatCountdown(countdownMs);

  return {
    progress,
    isLoaded,
    completeLevel,
    completePractice,
    consumeHeart,
    buyWithXP,
    redeem,
    addStreakFreeze,
    activateUnlimitedHearts,
    resetProgress,
    countdownMs,
    countdownFormatted,
  };
}
