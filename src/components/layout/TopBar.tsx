"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Zap,
  Heart,
  Infinity as InfinityIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { isUnlimitedHeartsActive } from "@/lib/gamification";
import { isSoundMuted, toggleSoundMuted } from "@/lib/sound";

function subscribeSound(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("logikode_sound_toggle", callback);
  return () => window.removeEventListener("logikode_sound_toggle", callback);
}

export function TopBar() {
  const { progress, isLoaded, countdownFormatted } = useUserProgress();
  const muted = useSyncExternalStore(
    subscribeSound,
    isSoundMuted,
    () => false
  );

  const isUnlimited = isLoaded ? isUnlimitedHeartsActive(progress) : false;
  const streak = isLoaded ? progress.streak : 0;
  const xp = isLoaded ? progress.xp : 0;
  const hearts = isLoaded ? progress.hearts : 5;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 px-3.5 py-2 shadow-xs transition-all">
      <div className="flex items-center justify-between">
        {/* Brand / Logo dengan logo resmi tanpa background hitam */}
        <Link
          href="/"
          className="flex items-center gap-2 group select-none"
          title="LogiKode by Core Dev Group"
        >
          <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform bg-slate-900 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="LogiKode Logo"
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
          <span className="font-black text-lg text-slate-800 tracking-tight hidden xs:inline">
            Logi<span className="text-emerald-500">Kode</span>
          </span>
        </Link>

        {/* Gamification Stats & Sound Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Streak Indicator */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50/80 border border-orange-200/60 text-orange-600 font-bold text-xs select-none"
            title={`Daily Streak: ${streak} Hari`}
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{streak}</span>
          </div>

          {/* XP Indicator */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50/80 border border-amber-200/60 text-amber-600 font-bold text-xs select-none"
            title={`Total XP: ${xp}`}
          >
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{xp}</span>
          </div>

          {/* Hearts / Nyawa Indicator dengan Live Countdown */}
          <Link
            href="/shop"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50/80 border border-rose-200/60 text-rose-600 font-bold text-xs hover:bg-rose-100 transition-colors select-none"
            title={
              isUnlimited
                ? "Unlimited Hearts Aktif!"
                : `Sisa Nyawa: ${hearts} / 5 (Pulih dalam ${countdownFormatted})`
            }
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            {isUnlimited ? (
              <InfinityIcon className="w-4 h-4 text-rose-600" />
            ) : (
              <div className="flex items-center gap-1">
                <span>{hearts}</span>
                {hearts < 5 && (
                  <span className="text-[10px] font-mono text-rose-500 bg-rose-100/80 px-1 py-0.5 rounded leading-none hidden xxs:inline">
                    {countdownFormatted}
                  </span>
                )}
              </div>
            )}
          </Link>

          {/* Tombol Mute / Unmute Suara */}
          <button
            type="button"
            onClick={() => {
              toggleSoundMuted();
            }}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors select-none"
            title={muted ? "Nyalakan Suara" : "Bisukan Suara (Mute)"}
            aria-label={muted ? "Nyalakan Suara" : "Bisukan Suara"}
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
