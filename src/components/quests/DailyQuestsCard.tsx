"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DAILY_QUEST_DEFINITIONS,
  getOrResetDailyQuestProgress,
  calculateQuestStatus,
  getDailyQuestsSummary,
  getTimeUntilMidnight,
  QuestStatus,
} from "@/lib/quests";
import { useUserProgress } from "@/hooks/useUserProgress";
import { playQuestClaim } from "@/lib/sound";

interface DailyQuestsCardProps {
  className?: string;
  defaultCollapsed?: boolean;
}

export function DailyQuestsCard({
  className = "",
  defaultCollapsed = false,
}: DailyQuestsCardProps) {
  const { progress, isLoaded, claimQuest } = useUserProgress();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(() => getTimeUntilMidnight().formatted);

  // Countdown timer reset tengah malam
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight().formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isLoaded) {
    return null;
  }

  const dailyProgress = getOrResetDailyQuestProgress(progress);
  const summary = getDailyQuestsSummary(progress);
  const questStatuses: QuestStatus[] = DAILY_QUEST_DEFINITIONS.map((q) =>
    calculateQuestStatus(q, dailyProgress)
  );

  const claimableCount = questStatuses.filter((s) => s.isClaimable).length;

  const handleClaim = (questId: string, questTitle: string, rewardXP: number) => {
    playQuestClaim();
    const result = claimQuest(questId);
    if (result.success) {
      setClaimedNotice(`+${rewardXP} XP dari "${questTitle}" berhasil diklaim! 🎉`);
      setTimeout(() => {
        setClaimedNotice(null);
      }, 3500);
    }
  };

  return (
    <div
      className={`w-full max-w-sm bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-4 shadow-sm transition-all relative overflow-hidden ${className}`}
    >
      {/* Toast Notifikasi Berhasil Klaim */}
      <AnimatePresence>
        {claimedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-2 left-2 right-2 z-20 bg-emerald-600 text-white text-xs font-black px-3 py-2 rounded-xl shadow-md flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>{claimedNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Kartu */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200/80 flex items-center justify-center text-base shadow-2xs">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black text-sm text-slate-800 tracking-tight">
                Misi Harian
              </h2>
              {claimableCount > 0 ? (
                <span className="text-[10px] font-black bg-amber-500 text-white px-1.5 py-0.2 rounded-full animate-bounce shadow-2xs">
                  {claimableCount} Siap Klaim!
                </span>
              ) : summary.allClaimed ? (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full border border-emerald-200">
                  Tuntas! ✨
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Reset dalam {timeLeft}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
            {summary.completedCount}/{summary.totalQuests}
          </span>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title={isCollapsed ? "Buka rincian misi" : "Tutup rincian misi"}
            aria-label="Toggle rincian misi harian"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Body: Daftar 3 Misi Harian */}
      {!isCollapsed && (
        <div className="space-y-2.5 pt-1 border-t border-slate-100">
          {questStatuses.map((item) => {
            const { quest, current, target, percent, isCompleted, isClaimed, isClaimable } = item;

            return (
              <div
                key={quest.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  isClaimable
                    ? "bg-amber-50/70 border-amber-300 shadow-2xs"
                    : isClaimed
                    ? "bg-slate-50/80 border-slate-200/60 opacity-85"
                    : "bg-white border-slate-200/80"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl flex-shrink-0">{quest.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-slate-800 truncate">
                        {quest.title}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {quest.description}
                      </p>
                    </div>
                  </div>

                  {/* Tombol Aksi / Status */}
                  <div className="flex-shrink-0">
                    {isClaimed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Selesai</span>
                      </span>
                    ) : isClaimable ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => handleClaim(quest.id, quest.title, quest.rewardXP)}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[11px] font-black rounded-xl shadow-xs border-b-2 border-amber-700 active:border-b-0 cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-200" />
                        <span>Klaim +{quest.rewardXP} XP</span>
                      </motion.button>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">
                        +{quest.rewardXP} XP
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar Mini */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isClaimed
                          ? "bg-slate-400"
                          : isCompleted
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 flex-shrink-0">
                    {current}/{target} {quest.unitLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
