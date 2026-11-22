"use client";

import React from "react";
import Link from "next/link";
import { HeartCrack, ShoppingBag, Home, Clock } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";

export function OutOfHeartsScreen() {
  const { countdownFormatted } = useUserProgress();

  return (
    <div className="w-full flex-1 flex flex-col justify-between p-6 text-center select-none animate-fadeIn">
      {/* Konten Utama */}
      <div className="my-auto flex flex-col items-center">
        <div className="w-24 h-24 rounded-3xl bg-rose-100 text-rose-500 flex items-center justify-center shadow-inner mb-4 border border-rose-200 animate-pulse">
          <HeartCrack className="w-14 h-14" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Nyawamu Habis! 💔
        </h1>
        <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
          Jangan patah semangat! Kesalahan adalah bagian dari proses belajar
          koding. Istirahat sejenak untuk memulihkan nyawa.
        </p>

        {/* Live Countdown & Info Pemulihan Otomatis */}
        <div className="mt-6 bg-slate-100 border border-slate-200 rounded-2xl p-4 max-w-xs w-full text-left flex items-start gap-3">
          <Clock className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          <div className="text-xs flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-slate-800">
                Pemulihan Otomatis Gratis
              </span>
              <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-xs">
                {countdownFormatted}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              +1 Heart pulih otomatis setiap <strong>5 menit</strong>, atau
              pulih penuh (5 Hearts) saat pergantian hari.
            </p>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="w-full flex flex-col gap-2.5 pt-6">
        <Link
          href="/shop"
          className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 border-b-4 border-rose-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
          <span>Isi Ulang di Toko</span>
        </Link>

        <Link
          href="/"
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Peta Belajar</span>
        </Link>
      </div>
    </div>
  );
}
