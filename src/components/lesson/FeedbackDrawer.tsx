"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface FeedbackDrawerProps {
  isCorrect: boolean;
  explanation: string;
  correctAnswerDisplay: string;
  onNext: () => void;
}

export function FeedbackDrawer({
  isCorrect,
  explanation,
  correctAnswerDisplay,
  onNext,
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
