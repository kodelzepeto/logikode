"use client";

import React, { useState } from "react";
import { Unit } from "@/types/curriculum";
import { BookOpen, Award } from "lucide-react";
import { CertificateModal } from "@/components/certificate/CertificateModal";

interface UnitBannerProps {
  unit: Unit;
  unitIndex: number;
  completedInUnit: number;
}

export function UnitBanner({
  unit,
  unitIndex,
  completedInUnit,
}: UnitBannerProps) {
  const [isCertOpen, setIsCertOpen] = useState(false);
  const totalLevels = unit.levels.length;
  const isAllCompleted = completedInUnit >= totalLevels;

  // Tema warna khas tiap unit (Unit 1: Emerald, Unit 2: Indigo, Unit 3: Amber, Unit 4: Cyan)
  const colorThemes = [
    {
      bg: "bg-emerald-500",
      border: "border-emerald-600",
      badge: "bg-emerald-600/40 text-emerald-100",
      progressBg: "bg-emerald-900/30",
      progressFill: "bg-emerald-200",
    },
    {
      bg: "bg-indigo-500",
      border: "border-indigo-600",
      badge: "bg-indigo-600/40 text-indigo-100",
      progressBg: "bg-indigo-900/30",
      progressFill: "bg-indigo-200",
    },
    {
      bg: "bg-amber-500",
      border: "border-amber-600",
      badge: "bg-amber-600/40 text-amber-100",
      progressBg: "bg-amber-900/30",
      progressFill: "bg-amber-200",
    },
    {
      bg: "bg-cyan-600",
      border: "border-cyan-700",
      badge: "bg-cyan-700/40 text-cyan-100",
      progressBg: "bg-cyan-950/30",
      progressFill: "bg-cyan-200",
    },
  ];

  const theme = colorThemes[unitIndex % colorThemes.length];

  return (
    <>
      <div
        className={`w-full rounded-2xl ${theme.bg} ${theme.border} border-b-4 p-4 text-white shadow-sm mb-6 transition-all`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span
            className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${theme.badge}`}
          >
            Unit {unitIndex + 1}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              {completedInUnit} / {totalLevels} Level
              {isAllCompleted ? " (Tuntas 🎉)" : ""}
            </span>
          </div>
        </div>

        <h2 className="text-lg font-black tracking-tight leading-snug">
          {unit.title}
        </h2>
        <p className="text-xs text-white/90 mt-1 line-clamp-2">
          {unit.description}
        </p>

        {/* Progress Bar Mini */}
        <div
          className={`w-full h-2 ${theme.progressBg} rounded-full mt-3 overflow-hidden`}
        >
          <div
            className={`h-full ${theme.progressFill} rounded-full transition-all duration-500`}
            style={{
              width: `${Math.min(100, (completedInUnit / totalLevels) * 100)}%`,
            }}
          />
        </div>

        {/* Tombol Klaim Sertifikat jika seluruh level unit tuntas */}
        {isAllCompleted && (
          <button
            type="button"
            onClick={() => setIsCertOpen(true)}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all border border-amber-300 active:scale-98 cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-900" />
            <span>🏆 Klaim Sertifikat Unit</span>
          </button>
        )}
      </div>

      {/* Modal Sertifikat Digital */}
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        unitNumber={unitIndex + 1}
        unitTitle={unit.title}
      />
    </>
  );
}
