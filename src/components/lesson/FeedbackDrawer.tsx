"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { ComboMilestone } from "@/lib/combo";

interface FeedbackDrawerProps {
  isCorrect: boolean;
  explanation: string;
  correctAnswerDisplay: string;
  onNext: () => void;
  comboMilestone?: ComboMilestone | null;
}

export function FeedbackDrawer({
  isCorrect,
  explanation,
  correctAnswerDisplay,
  onNext,
  comboMilestone,
}: FeedbackDrawerProps) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 280 }}
      className={`fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto p-5 border-t-2 shadow-2xl rounded-t-3xl ${
        isCorrect
          ? "bg-emerald-100 border-emerald-300 text-emerald-950"
          : "bg-rose-100 border-rose-300 text-rose-950"
      }`}
    >
      <div className="flex flex-col gap-3">
        {/* Badge Selebrasi Combo Streak (jika mencapai milestone 3x, 5x, dst) */}
        {isCorrect && comboMilestone && (
          <motion.div
            initial={{ scale: 0.85, y: -8, opacity: 0 }}
            animate={{ scale: [0.85, 1.06, 1], y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className={`w-full py-2.5 px-3.5 rounded-2xl shadow-md border-b-2 flex items-center justify-between text-white ${
              comboMilestone.theme === "purple"
                ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 border-purple-800"
                : comboMilestone.theme === "orange"
                ? "bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 border-orange-800"
                : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 border-amber-800"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl animate-bounce">{comboMilestone.icon}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-black text-xs uppercase tracking-tight">
                    {comboMilestone.badgeText}
                  </p>
                  <span className="text-[9px] bg-white/25 px-1.5 py-0.2 rounded-full font-extrabold uppercase">
                    Streak 🔥
                  </span>
                </div>
                <p className="text-[11px] text-white/95 font-medium leading-tight">
                  {comboMilestone.subtitle}
                </p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
          </motion.div>
        )}

        {/* Judul & Ikon Status */}
        <div className="flex items-center gap-2.5">
          {isCorrect ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-600 fill-emerald-200" />
          ) : (
            <XCircle className="w-7 h-7 text-rose-600 fill-rose-200" />
          )}
          <span className="text-base sm:text-lg font-black tracking-tight">
            {isCorrect ? "Mantap! Jawabanmu Benar!" : "Kurang Tepat!"}
          </span>
        </div>

        {/* Jika Salah, tampilkan Kunci Jawaban */}
        {!isCorrect && correctAnswerDisplay && (
          <div className="bg-white/80 border border-rose-200 rounded-2xl p-3 text-xs">
            <span className="font-bold text-rose-800 block mb-0.5">
              Jawaban yang Benar:
            </span>
            <code className="font-mono text-xs text-rose-950 font-bold whitespace-pre-wrap">
              {correctAnswerDisplay}
            </code>
          </div>
        )}

        {/* Penjelasan Edukatif */}
        {explanation && (
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {explanation}
          </p>
        )}

        {/* Tombol Lanjut */}
        <button
          type="button"
          onClick={onNext}
          className={`w-full mt-2 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all select-none border-b-4 active:translate-y-1 active:border-b-0 ${
            isCorrect
              ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white shadow-md"
              : "bg-rose-500 hover:bg-rose-600 border-rose-700 text-white shadow-md"
          }`}
        >
          <span>Lanjut</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </motion.div>
  );
}
