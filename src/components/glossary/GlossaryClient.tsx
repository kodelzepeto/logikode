"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  X,
  BookOpen,
  Lightbulb,
  Code2,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Layers,
} from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppFooter } from "@/components/layout/AppFooter";
import {
  GLOSSARY_TERMS,
  GLOSSARY_CATEGORIES,
  GlossaryCategory,
  GlossaryTerm,
} from "@/data/glossary";
import { filterGlossaryTerms, getGlossaryStats } from "@/lib/glossary";
import { playClick } from "@/lib/sound";

export function GlossaryClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<GlossaryCategory>("Semua");
  const [copiedTermId, setCopiedTermId] = useState<string | null>(null);

  const stats = useMemo(() => getGlossaryStats(GLOSSARY_TERMS), []);

  const filteredTerms = useMemo(() => {
    return filterGlossaryTerms(GLOSSARY_TERMS, searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handleCopyCode = async (termId: string, code: string) => {
    playClick();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedTermId(termId);
      setTimeout(() => setCopiedTermId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleSelectRelated = (term: string) => {
    playClick();
    setSearchQuery(term);
    setSelectedCategory("Semua");
  };

  const handleResetSearch = () => {
    playClick();
    setSearchQuery("");
    setSelectedCategory("Semua");
  };

  return (
    <MobileShell showTopBar={false} showBottomNav={true}>
      <div className="w-full flex-1 flex flex-col p-4 sm:p-5 selection:bg-emerald-200 selection:text-emerald-900 pb-28">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <Link
            href="/"
            onClick={() => playClick()}
            className="p-2 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 shadow-2xs hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-black shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>{stats.totalTerms} Istilah Koding</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              📖
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kamus Koding Mini
            </h1>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Kumpulan istilah penting logika pemrograman, struktur data, dan konsep IT dengan penjelasan ramah pemula &amp; analogi dunia nyata.
          </p>
        </div>

        {/* Input Pencarian Cepat */}
        <div className="relative mb-3.5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari istilah (contoh: Variabel, Boolean, SQL, Loop)..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Bersihkan pencarian"
              aria-label="Bersihkan pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Pills Kategori Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-1 px-1">
          {GLOSSARY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = stats.categoryCounts[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all select-none cursor-pointer border ${
                  isSelected
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs scale-102"
                    : "bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Info Hasil Filter */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-3 px-1">
          <span>
            Menampilkan <strong>{filteredTerms.length}</strong> istilah
            {selectedCategory !== "Semua" ? ` di kategori "${selectedCategory}"` : ""}
            {searchQuery ? ` untuk "${searchQuery}"` : ""}
          </span>
          {(searchQuery || selectedCategory !== "Semua") && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="text-emerald-600 hover:text-emerald-700 font-extrabold hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Daftar Istilah */}
        {filteredTerms.length > 0 ? (
          <div className="space-y-3.5">
            {filteredTerms.map((term: GlossaryTerm) => (
              <motion.article
                key={term.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow"
              >
                {/* Header Kartu: Judul, Istilah Inggris, dan Kategori */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{term.term}</span>
                    </h2>
                    <span className="text-[11px] font-mono text-slate-400 font-bold">
                      {term.englishTerm}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full shrink-0">
                    {term.category}
                  </span>
                </div>

                {/* Definisi */}
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-3">
                  {term.definition}
                </p>

                {/* Analogi Dunia Nyata */}
                {term.analogi && (
                  <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 mb-3 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-950 font-medium leading-relaxed">
                      <strong className="text-amber-900 font-bold block mb-0.5">
                        Analogi Dunia Nyata:
                      </strong>
                      {term.analogi}
                    </div>
                  </div>
                )}

                {/* Contoh Kode Praktis */}
                {term.exampleCode && (
                  <div className="relative bg-slate-900 rounded-2xl p-3.5 mb-3 border border-slate-800 text-white font-mono text-xs overflow-hidden">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Contoh Kode</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(term.id, term.exampleCode!)}
                        className="inline-flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                        title="Salin contoh kode"
                      >
                        {copiedTermId === term.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre font-mono text-[11px] leading-relaxed text-emerald-300">
                      <code>{term.exampleCode}</code>
                    </pre>
                  </div>
                )}

                {/* Istilah Terkait */}
                {term.relatedTerms && term.relatedTerms.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                    <span className="text-slate-400 font-bold flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>Terkait:</span>
                    </span>
                    {term.relatedTerms.map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => handleSelectRelated(rel)}
                        className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200/80 text-slate-600 px-2 py-0.5 rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 text-center my-6 shadow-2xs">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-black text-slate-800 mb-1">
              Istilah Tidak Ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4 leading-relaxed">
              Tidak ada istilah koding yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;. Coba gunakan kata kunci lain atau pilih kategori &ldquo;Semua&rdquo;.
            </p>
            <button
              type="button"
              onClick={handleResetSearch}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 border-b-2 border-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tampilkan Semua Istilah</span>
            </button>
          </div>
        )}

        <div className="mt-8">
          <AppFooter />
        </div>
      </div>
    </MobileShell>
  );
}
