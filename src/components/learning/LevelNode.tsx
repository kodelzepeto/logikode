"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Check, Play } from "lucide-react";
import { Level } from "@/types/curriculum";

export type LevelStatus = "locked" | "current" | "completed";

interface LevelNodeProps {
  level: Level;
  status: LevelStatus;
  offsetClass?: string;
  unitThemeColor?: string;
  onLockedClick?: (level: Level) => void;
}

export function LevelNode({
  level,
  status,
  offsetClass = "translate-x-0",
  unitThemeColor = "emerald",
  onLockedClick,
}: LevelNodeProps) {
  const isLocked = status === "locked";
  const isCurrent = status === "current";
  const isCompleted = status === "completed";

  // Dynamic color for current node based on unit theme
  const currentThemeClasses =
    unitThemeColor === "indigo"
      ? "bg-indigo-500 border-indigo-700 ring-indigo-300"
      : "bg-emerald-500 border-emerald-700 ring-emerald-300";

  const nodeContent = (
    <div className={`relative flex flex-col items-center my-4 ${offsetClass}`}>
      {/* Floating "MULAI" Bubble for Current Level */}
      {isCurrent && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-4, 4, -4] }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: "easeInOut",
          }}
          className="absolute -top-9 z-20 flex flex-col items-center pointer-events-none"
        >
          <div className="bg-slate-900 text-white font-black text-[11px] px-3 py-1 rounded-xl tracking-wider shadow-md uppercase">
            MULAI
          </div>
          <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
        </motion.div>
      )}

      {/* Tactile 3D Circular Button */}
      {isLocked ? (
        <button
          type="button"
          onClick={() => onLockedClick?.(level)}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-slate-200 border-b-4 border-slate-300/90 text-slate-400 flex items-center justify-center cursor-not-allowed shadow-xs select-none active:translate-y-0.5 transition-transform"
          title="Level masih terkunci"
        >
          <Lock className="w-7 h-7" />
        </button>
      ) : isCompleted ? (
        <Link
          href={`/lesson/${level.id}`}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-amber-400 border-b-4 border-amber-600 text-white flex items-center justify-center shadow-md active:translate-y-1 active:border-b-0 hover:scale-105 transition-all select-none group"
          title={`${level.title} (Selesai)`}
        >
          <Check className="w-8 h-8 stroke-[3.5] group-hover:scale-110 transition-transform" />
        </Link>
      ) : (
        <Link
          href={`/lesson/${level.id}`}
          className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full ${currentThemeClasses} border-b-4 text-white flex items-center justify-center shadow-lg active:translate-y-1 active:border-b-0 hover:scale-105 ring-4 ring-offset-2 transition-all select-none group`}
          title={`Mulai ${level.title}`}
        >
          <Play className="w-8 h-8 fill-white translate-x-0.5 group-hover:scale-110 transition-transform" />
        </Link>
      )}

      {/* Level Title Label */}
      <div className="mt-2 text-center max-w-[130px]">
        <p
          className={`text-xs font-bold leading-tight ${
            isLocked
              ? "text-slate-400"
              : isCurrent
              ? "text-slate-900 font-extrabold"
              : "text-slate-700"
          }`}
        >
          {level.title}
        </p>
        {isCompleted && (
          <span className="text-[10px] text-amber-600 font-bold">
            Ulang Latihan
          </span>
        )}
      </div>
    </div>
  );

  return nodeContent;
}
