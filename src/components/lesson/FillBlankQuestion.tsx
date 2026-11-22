"use client";

import React from "react";
import { FillBlankQuestion as FBQType } from "@/types/curriculum";

interface FillBlankQuestionProps {
  question: FBQType;
  selectedAnswer: string | null;
  onSelect: (answer: string | null) => void;
  disabled: boolean;
}

export function FillBlankQuestion({
  question,
  selectedAnswer,
  onSelect,
  disabled,
}: FillBlankQuestionProps) {
  // Pecah codeTemplate berdasarkan placeholder '___'
  const parts = question.codeTemplate.split("___");

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Teks Pertanyaan */}
      <h2 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
        {question.prompt}
      </h2>

      {/* Tampilan Template Kode dengan Slot Kosong Terisi */}
      <div className="w-full bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner border border-slate-800">
        <div className="leading-relaxed whitespace-pre-wrap flex flex-wrap items-center gap-1.5">
          {parts.map((part, index) => (
            <React.Fragment key={`part-${index}`}>
              <span>{part}</span>
              {index < parts.length - 1 && (
                <button
                  type="button"
                  disabled={disabled || !selectedAnswer}
                  onClick={() => onSelect(null)}
                  className={`inline-flex items-center justify-center min-w-[70px] px-3 py-1 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all select-none ${
                    selectedAnswer
                      ? "bg-emerald-500 text-white border-emerald-400 shadow-sm animate-scaleUp cursor-pointer hover:bg-emerald-600"
                      : "bg-slate-800 text-slate-500 border-dashed border-slate-600"
                  }`}
                  title={selectedAnswer ? "Ketuk untuk mengosongkan" : "Slot kosong"}
                >
                  {selectedAnswer ?? "_____"}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Pilihan Opsi Token di Bawah */}
      <div className="flex flex-col gap-2 mt-2">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          Pilih Jawaban yang Tepat:
        </span>

        <div className="flex flex-wrap gap-2.5">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;

            return (
              <button
                key={`${question.id}-token-${option}`}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(option)}
                className={`font-mono text-xs sm:text-sm px-4 py-2.5 rounded-2xl border-2 border-b-4 transition-all select-none ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold border-b-2 translate-y-0.5 shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 active:translate-y-0.5 active:border-b-2"
                } ${disabled ? "cursor-default" : "cursor-pointer"}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
