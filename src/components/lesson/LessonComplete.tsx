"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Zap,
  Target,
  Flame,
  ArrowRight,
  Home,
  Share2,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { Level } from "@/types/curriculum";
import { useUserProgress } from "@/hooks/useUserProgress";
import { getAllLevels } from "@/data/curriculum";
import {
  generateStoryShareImage,
  downloadDataUrl,
} from "@/lib/canvasGenerator";

interface LessonCompleteProps {
  level: Level;
  earnedXP: number;
  accuracy: number;
  streak: number;
  nextLevelId: string | null;
}

export function LessonComplete({
  level,
  earnedXP,
  accuracy,
  streak,
  nextLevelId,
}: LessonCompleteProps) {
  const { progress } = useUserProgress();
  const allLevels = getAllLevels();
  const [isSharing, setIsSharing] = useState(false);

  const handleShareStory = async () => {
    setIsSharing(true);
    try {
      const dataUrl = await generateStoryShareImage({
        streak,
        xp: progress.xp,
        completedCount: progress.completedLevels.length,
        totalLevels: allLevels.length,
        levelTitle: level.title,
      });
      downloadDataUrl(
        dataUrl,
        `LogiKode-${level.id.replace(/\s+/g, "-")}-Story.png`
      );
    } catch (err) {
      console.error("Gagal men-generate story:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between p-6 text-center select-none animate-fadeIn">
      {/* Bagian Atas: Animasi Selebrasi & Judul */}
      <div className="my-auto flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-24 h-24 rounded-3xl bg-amber-400 text-white flex items-center justify-center shadow-lg mb-4 border-b-4 border-amber-600"
        >
          <Trophy className="w-14 h-14" />
        </motion.div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Latihan Selesai! 🎉
        </h1>

        {/* Badge Akurasi ala Duolingo */}
        <div className="mt-2 mb-1">
          {accuracy >= 100 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-xs font-black shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>✨ Sempurna!</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full text-xs font-black shadow-2xs">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>👍 Bagus!</span>
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Hebat! Kamu telah menuntaskan tantangan logika pada{" "}
          <strong className="text-slate-700">&ldquo;{level.title}&rdquo;</strong>.
        </p>

        {/* Kartu Ringkasan Hasil Belajar */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mt-6">
          {/* XP Didapat */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex flex-col items-center shadow-xs">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500 mb-1" />
            <span className="text-lg font-black text-slate-900">
              +{earnedXP}
            </span>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              Total XP
            </span>
          </div>

          {/* Akurasi */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex flex-col items-center shadow-xs">
            <Target className="w-5 h-5 text-emerald-500 mb-1" />
            <span className="text-lg font-black text-slate-900">
              {accuracy}%
            </span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              Akurasi
            </span>
          </div>

          {/* Streak */}
          <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-3 flex flex-col items-center shadow-xs">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500 mb-1" />
            <span className="text-lg font-black text-slate-900">
              {streak}
            </span>
            <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
              Hari Streak
            </span>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Tombol Navigasi & Share */}
      <div className="w-full flex flex-col gap-2.5 pt-6">
        {nextLevelId ? (
          <Link
            href={`/lesson/${nextLevelId}`}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all text-center"
          >
            <span>Lanjut Level Berikutnya</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-2xl text-center mb-1">
            🌟 Luar biasa! Seluruh kurikulum saat ini telah kamu tuntaskan!
          </div>
        )}

        <button
          type="button"
          onClick={handleShareStory}
          disabled={isSharing}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-b-4 border-indigo-800 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {isSharing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Merender Story PNG...</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Bagikan ke Story (Download PNG)</span>
            </>
          )}
        </button>

        <Link
          href="/"
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-center"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Peta Belajar</span>
        </Link>
      </div>
    </div>
  );
}
