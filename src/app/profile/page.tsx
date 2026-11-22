"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MobileShell } from "@/components/layout/MobileShell";
import { useUserProgress } from "@/hooks/useUserProgress";
import { getAllLevels } from "@/data/curriculum";
import {
  generateStoryShareImage,
  downloadDataUrl,
} from "@/lib/canvasGenerator";
import {
  Flame,
  Zap,
  Snowflake,
  Trophy,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Code2,
  Share2,
  Sparkles,
} from "lucide-react";

export default function ProfilePage() {
  const { progress, resetProgress, isLoaded } = useUserProgress();
  const allLevels = getAllLevels();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const totalLevels = allLevels.length;
  const completedCount = isLoaded ? progress.completedLevels.length : 0;
  const progressPercent = Math.round((completedCount / totalLevels) * 100);

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const handleShareStory = async () => {
    setIsSharing(true);
    try {
      const dataUrl = await generateStoryShareImage({
        streak: progress.streak,
        xp: progress.xp,
        completedCount,
        totalLevels,
      });
      downloadDataUrl(dataUrl, "LogiKode-Progres-Story.png");
    } catch (err) {
      console.error("Gagal men-generate story:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <MobileShell showTopBar={true} showBottomNav={true}>
      <div className="w-full px-4 py-6 flex flex-col gap-5">
        {/* User Header Avatar dengan Logo Resmi */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-slate-900 shrink-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="LogiKode"
              width={64}
              height={64}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-black text-slate-800 tracking-tight">
              Pelajar LogiKode
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Mode Belajar Tanpa Login (Penyimpanan Lokal)
            </p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <CheckCircle2 className="w-3 h-3" /> Akun Aktif
            </span>
          </div>
        </div>

        {/* Notifikasi Sukses Reset */}
        {resetSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold p-3 rounded-2xl text-center animate-fadeIn">
            ✅ Progres belajar berhasil di-reset ke awal!
          </div>
        )}

        {/* Kartu Statistik & Tombol Pamer ke Story */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Statistik Belajar
            </h2>
            <span className="text-[11px] font-bold text-slate-500">
              Total {totalLevels} Level
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {/* Stat: Total XP */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3 text-center">
              <Zap className="w-5 h-5 mx-auto text-amber-500 fill-amber-500 mb-1" />
              <div className="text-lg font-black text-slate-800">
                {isLoaded ? progress.xp : 0}
              </div>
              <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                Total XP
              </div>
            </div>

            {/* Stat: Streak */}
            <div className="bg-orange-50/70 border border-orange-200/60 rounded-2xl p-3 text-center">
              <Flame className="w-5 h-5 mx-auto text-orange-500 fill-orange-500 mb-1" />
              <div className="text-lg font-black text-slate-800">
                {isLoaded ? progress.streak : 0}
              </div>
              <div className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                Streak Hari
              </div>
            </div>

            {/* Stat: Streak Freeze */}
            <div className="bg-sky-50/70 border border-sky-200/60 rounded-2xl p-3 text-center">
              <Snowflake className="w-5 h-5 mx-auto text-sky-500 mb-1" />
              <div className="text-lg font-black text-slate-800">
                {isLoaded ? progress.streakFreezes : 0}
              </div>
              <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                Freeze
              </div>
            </div>
          </div>

          {/* Progress Kurikulum */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-3.5">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-700">Penyelesaian Kurikulum</span>
              <span className="text-emerald-600">
                {completedCount} / {totalLevels} Level ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Tombol Bagikan ke Story */}
          <button
            type="button"
            onClick={handleShareStory}
            disabled={isSharing}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-b-4 border-indigo-800 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
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
        </section>

        {/* Kartu Branding Resmi Core Dev Group (WAJIB) */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-sm border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-500 rounded-xl text-white">
              <Code2 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-black tracking-tight text-white">
              LogiKode by Core Dev Group
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            LogiKode adalah platform edukasi logika koding mobile-first bergaya
            Duolingo, dirancang khusus oleh <strong>Core Dev Group</strong> untuk
            membantu pelajar dan mahasiswa baru Indonesia memahami cara berpikir
            komputasional secara gratis, ringan, dan menyenangkan.
          </p>
          <a
            href="https://core-dev-group.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all select-none"
          >
            <span>Kunjungi core-dev-group.my.id</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>

        {/* Zona Pengujian & Pengaturan Data */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <h2 className="text-sm font-black text-slate-800 tracking-tight mb-2">
            Zona Pengujian Aplikasi
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Ingin menguji alur belajar dari level 1 lagi? Kamu dapat menghapus
            seluruh progres lokal sewaktu-waktu.
          </p>

          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold rounded-2xl text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Progres Belajar
            </button>
          ) : (
            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-rose-700 font-black text-xs mb-1">
                <ShieldAlert className="w-4 h-4" /> Yakin Ingin Mereset Data?
              </div>
              <p className="text-[11px] text-rose-600 mb-3">
                XP, streak, dan level yang terbuka akan dikembalikan ke kondisi awal.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Ya, Reset Sekarang
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </MobileShell>
  );
}
