"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Heart, Infinity as InfinityIcon, AlertTriangle } from "lucide-react";

interface LessonHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  hearts: number;
  isUnlimited: boolean;
  progressPercentOverride?: number;
}

export function LessonHeader({
  currentQuestionIndex,
  totalQuestions,
  hearts,
  isUnlimited,
  progressPercentOverride,
}: LessonHeaderProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Progress percentage (mulai dari sebagian kecil saat index 0 hingga 100%)
  const progressPercent =
    progressPercentOverride !== undefined
      ? Math.min(100, Math.max(0, progressPercentOverride))
      : Math.min(
          100,
          Math.round((currentQuestionIndex / totalQuestions) * 100)
        );

  return (
    <>
      <header className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200 select-none">
        {/* Tombol Tutup / Keluar */}
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          title="Keluar dari sesi latihan"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Progress Bar di Tengah */}
        <div className="flex-1 h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 relative">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-out shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Indikator Hearts */}
        <div
          className="flex items-center gap-1 font-black text-sm text-rose-500 bg-rose-50 border border-rose-200/70 px-2.5 py-1 rounded-xl"
          title={isUnlimited ? "Unlimited Hearts Aktif" : `Sisa Nyawa: ${hearts}`}
        >
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          {isUnlimited ? (
            <InfinityIcon className="w-4 h-4 text-rose-600" />
          ) : (
            <span>{hearts}</span>
          )}
        </div>
      </header>

      {/* Modal Konfirmasi Keluar */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-slate-200 text-center animate-scaleUp">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-base font-black text-slate-900">
              Yakin Mau Keluar?
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Semua progres dari sesi kuis ini tidak akan disimpan jika kamu
              keluar sekarang.
            </p>

            <div className="flex flex-col gap-2 mt-5">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
              >
                Lanjutkan Belajar
              </button>
              <Link
                href="/"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-colors"
              >
                Tetap Keluar
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
