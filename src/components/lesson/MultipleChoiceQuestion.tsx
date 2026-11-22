"use client";

import React from "react";
import { MultipleChoiceQuestion as MCQType } from "@/types/curriculum";

interface MultipleChoiceQuestionProps {
  question: MCQType;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  disabled: boolean;
}

export function MultipleChoiceQuestion({
  question,
  selectedIndex,
  onSelect,
  disabled,
}: MultipleChoiceQuestionProps) {
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Teks Pertanyaan */}
      <h2 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
        {question.prompt}
      </h2>

      {/* Cuplikan Kode (jika ada) */}
      {question.codeSnippet && (
        <div className="w-full bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
          <pre className="leading-relaxed whitespace-pre-wrap">
            <code>{question.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Daftar Kartu Pilihan Jawaban */}
      <div className="flex flex-col gap-2.5 mt-2">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const label = optionLabels[index] ?? `${index + 1}`;

          return (
            <button
              key={`${question.id}-opt-${index}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(index)}
              className={`w-full text-left p-3.5 rounded-2xl border-2 border-b-4 transition-all duration-150 flex items-center gap-3 select-none ${
                isSelected
                  ? "bg-emerald-50/90 border-emerald-500 text-emerald-950 font-bold shadow-xs translate-y-0.5 border-b-2"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:translate-y-0.5 active:border-b-2"
              } ${disabled ? "cursor-default" : "cursor-pointer"}`}
            >
              {/* Badge Indeks Huruf */}
              <span
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                  isSelected
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {label}
              </span>

              {/* Teks Opsi */}
              <span className="text-xs sm:text-sm font-semibold leading-relaxed flex-1">
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
