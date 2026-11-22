"use client";

import React from "react";
import { CodeOrderQuestion as COQType } from "@/types/curriculum";

interface CodeOrderQuestionProps {
  question: COQType;
  orderedBlocks: string[];
  onChange: (blocks: string[]) => void;
  disabled: boolean;
}

export function CodeOrderQuestion({
  question,
  orderedBlocks,
  onChange,
  disabled,
}: CodeOrderQuestionProps) {
  // Mapping kepingan blok dengan ID unik berdasarkan indeks asli di blocks
  const allAvailableTokens = question.blocks.map((text, originalIndex) => ({
    id: originalIndex,
    text,
  }));

  // Hitung berapa kali tiap text sudah digunakan di orderedBlocks
  const usedCounts: Record<string, number> = {};
  for (const text of orderedBlocks) {
    usedCounts[text] = (usedCounts[text] ?? 0) + 1;
  }

  // Tentukan apakah token asli pada indeks tertentu sudah masuk ke susunan
  const tokenUsageTracker: Record<string, number> = {};
  const isTokenUsed = (text: string): boolean => {
    tokenUsageTracker[text] = (tokenUsageTracker[text] ?? 0) + 1;
    return tokenUsageTracker[text] <= (usedCounts[text] ?? 0);
  };

  const availableTokensWithStatus = allAvailableTokens.map((token) => ({
    ...token,
    isPlaced: isTokenUsed(token.text),
  }));

  // Klik blok di bawah untuk ditambahkan ke susunan atas
  const handleAddBlock = (text: string) => {
    if (disabled) return;
    onChange([...orderedBlocks, text]);
  };

  // Klik blok di atas untuk dikembalikan ke bawah
  const handleRemoveBlock = (indexToRemove: number) => {
    if (disabled) return;
    const next = orderedBlocks.filter((_, idx) => idx !== indexToRemove);
    onChange(next);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Pertanyaan */}
      <h2 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
        {question.prompt}
      </h2>
      <p className="text-xs text-slate-500 -mt-2">
        Ketuk kepingan blok di bawah untuk menyusun urutan eksekusi yang benar.
      </p>

      {/* Area Susunan Kodemu (Atas) */}
      <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-3 min-h-[120px] flex flex-col gap-2 shadow-inner">
        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
          💻 Susunan Kodemu:
        </span>

        {orderedBlocks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-500 italic py-4">
            Ketuk blok di bawah untuk meletakkan baris kode di sini...
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {orderedBlocks.map((blockText, idx) => (
              <button
                key={`placed-${idx}-${blockText}`}
                type="button"
                disabled={disabled}
                onClick={() => handleRemoveBlock(idx)}
                className={`w-full text-left font-mono text-xs sm:text-sm bg-slate-800 text-emerald-400 px-3 py-2 rounded-xl border border-emerald-500/40 shadow-xs flex items-center justify-between group select-none transition-all ${
                  disabled
                    ? "cursor-default"
                    : "hover:bg-slate-700 active:scale-98 cursor-pointer"
                }`}
                title="Ketuk untuk membatalkan"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 select-none">
                    {idx + 1}
                  </span>
                  <span>{blockText}</span>
                </div>
                {!disabled && (
                  <span className="text-[10px] text-slate-400 group-hover:text-rose-400 transition-colors">
                    ✕
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Area Kumpulan Blok Pilihan (Bawah) */}
      <div className="flex flex-col gap-2 mt-2">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          Pilihan Kepingan Blok:
        </span>

        <div className="flex flex-wrap gap-2">
          {availableTokensWithStatus.map((token) => (
            <button
              key={`available-${token.id}`}
              type="button"
              disabled={disabled || token.isPlaced}
              onClick={() => handleAddBlock(token.text)}
              className={`font-mono text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border-2 border-b-4 transition-all select-none ${
                token.isPlaced
                  ? "bg-slate-200/60 border-slate-300/40 text-slate-400 border-b-2 cursor-default"
                  : "bg-white border-slate-200 text-slate-800 shadow-xs hover:border-slate-300 hover:bg-slate-50 active:translate-y-0.5 active:border-b-2 cursor-pointer"
              }`}
            >
              {token.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
