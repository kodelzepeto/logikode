"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CURRICULUM_UNITS, getAllLevels } from "@/data/curriculum";
import { useUserProgress } from "@/hooks/useUserProgress";
import { isLevelUnlocked } from "@/lib/gamification";
import { UnitBanner } from "./UnitBanner";
import { LevelNode, LevelStatus } from "./LevelNode";
import { Level } from "@/types/curriculum";
import { Lock, X, ArrowRight } from "lucide-react";

export function LearningPath() {
  const { progress } = useUserProgress();
  const allLevels = getAllLevels();

  const [lockedModalLevel, setLockedModalLevel] = useState<Level | null>(null);

  // Pola berliku zigzag Duolingo
  const zigzagOffsets = [
    "translate-x-0",
    "-translate-x-10 sm:-translate-x-12",
    "translate-x-0",
    "translate-x-10 sm:translate-x-12",
  ];

  let cumulativeLevelIndex = 0;

  return (
    <div className="w-full px-4 py-5 flex flex-col items-center">
      {/* Kartu Akses Cepat Mode Latihan Acak */}
      <Link
        href="/practice"
        className="w-full max-w-sm mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm border-b-4 border-amber-700 active:translate-y-1 active:border-b-0 flex items-center justify-between group transition-all select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight">
                Latihan Cepat (Acak)
              </span>
              <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-full font-bold uppercase">
                Endless
              </span>
            </div>
            <p className="text-[11px] text-white/90 mt-0.5">
              Asah terus kemampuan & raih +5 XP tanpa batas!
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
      </Link>

      {CURRICULUM_UNITS.map((unit, unitIdx) => {
        // Hitung berapa level yang selesai di unit ini
        const completedInThisUnit = unit.levels.filter((l) =>
          progress.completedLevels.includes(l.id)
        ).length;

        const themeColor = unitIdx === 0 ? "emerald" : "indigo";

        return (
          <section key={unit.id} className="w-full max-w-sm flex flex-col items-center mb-8">
            {/* Header Banner Unit */}
            <UnitBanner
              unit={unit}
              unitIndex={unitIdx}
              completedInUnit={completedInThisUnit}
            />

            {/* Winding Level Path */}
            <div className="w-full flex flex-col items-center py-2 relative">
              {unit.levels.map((level) => {
                const isCompleted = progress.completedLevels.includes(level.id);
                const unlocked = isLevelUnlocked(
                  level.id,
                  allLevels,
                  progress.completedLevels
                );

                let status: LevelStatus = "locked";
                if (isCompleted) {
                  status = "completed";
                } else if (unlocked) {
                  status = "current";
                }

                const offsetClass =
                  zigzagOffsets[cumulativeLevelIndex % zigzagOffsets.length];
                cumulativeLevelIndex++;

                return (
                  <LevelNode
                    key={level.id}
                    level={level}
                    status={status}
                    offsetClass={offsetClass}
                    unitThemeColor={themeColor}
                    onLockedClick={(lvl) => setLockedModalLevel(lvl)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Modal Dialog jika menekan Level yang Terkunci */}
      {lockedModalLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-slate-200 text-center relative animate-scaleUp">
            <button
              type="button"
              onClick={() => setLockedModalLevel(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-base font-black text-slate-800">
              Level Masih Terkunci!
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Kamu harus menuntaskan level sebelumnya terlebih dahulu untuk
              membuka modul{" "}
              <span className="font-bold text-slate-700">
                &ldquo;{lockedModalLevel.title}&rdquo;
              </span>
              .
            </p>

            <button
              type="button"
              onClick={() => setLockedModalLevel(null)}
              className="w-full mt-5 py-2.5 bg-slate-800 hover:bg-slate-900 border-b-4 border-slate-950 active:translate-y-1 active:border-b-0 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Footer Branding Resmi Core Dev Group */}
      <footer className="mt-8 mb-4 text-center">
        <p className="text-xs text-slate-400 font-medium">
          Dibangun dengan ❤️ oleh{" "}
          <a
            href="https://core-dev-group.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-emerald-600 hover:underline"
          >
            Core Dev Group
          </a>
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Platform Belajar Logika Koding Modal Rp 0 untuk Pelajar Indonesia
        </p>
      </footer>
    </div>
  );
}
