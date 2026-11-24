"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  CheckCircle2,
  Calendar,
  Rocket,
  History,
  ExternalLink,
} from "lucide-react";
import {
  RELEASE_NOTES,
  APP_VERSION,
  markVersionAsSeen,
  ReleaseNote,
} from "@/lib/version";

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVersion?: string;
}

export function WhatsNewModal({
  isOpen,
  onClose,
  initialVersion = APP_VERSION,
}: WhatsNewModalProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>(initialVersion);

  if (!isOpen) return null;

  const currentNote: ReleaseNote =
    RELEASE_NOTES.find((note) => note.version === selectedVersion) ||
    RELEASE_NOTES[0];

  const handleDismiss = () => {
    markVersionAsSeen(APP_VERSION);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Tombol Tutup X */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Header Selebrasi */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-200 border-2 border-white shrink-0">
            <Sparkles className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black text-center text-slate-900 tracking-tight">
            Apa yang Baru?
          </h3>
          <p className="text-xs text-center text-slate-500 mt-0.5 mb-3.5">
            Pembaruan resmi LogiKode oleh Core Dev Group
          </p>

          {/* Tab Selector Versi (Jika ada lebih dari 1 versi) */}
          {RELEASE_NOTES.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 border-b border-slate-100 scrollbar-none shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 pl-1 shrink-0">
                <History className="w-3 h-3" /> Versi:
              </span>
              {RELEASE_NOTES.map((note) => {
                const isActive = note.version === selectedVersion;
                return (
                  <button
                    key={note.version}
                    type="button"
                    onClick={() => setSelectedVersion(note.version)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer font-mono ${
                      isActive
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    v{note.version}
                    {note.version === APP_VERSION && (
                      <span className="ml-1 text-[9px] opacity-90 font-sans">
                        (Terbaru)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Konten Catatan Rilis yang Dipilih */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                <span className="font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  v{currentNote.version}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {currentNote.date}
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-800 mt-1 leading-snug">
                {currentNote.title}
              </h4>
            </div>

            {/* Daftar Highlights */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
                Fitur & Peningkatan:
              </span>
              {currentNote.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 text-xs text-slate-700 bg-white border border-slate-100 p-2.5 rounded-xl shadow-2xs"
                >
                  <div className="p-0.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed font-medium">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 mt-3 border-t border-slate-100 shrink-0 space-y-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>Keren, Mengerti!</span>
            </button>

            <div className="text-center">
              <a
                href="https://core-dev-group.my.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-medium text-slate-400 hover:text-emerald-600 inline-flex items-center gap-1 transition-colors"
              >
                <span>Core Dev Group Academy</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
