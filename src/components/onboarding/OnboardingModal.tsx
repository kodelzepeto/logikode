"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Rocket,
  Brain,
  Award,
  Zap,
} from "lucide-react";
import { DailyGoalType } from "@/types/user";
import {
  DAILY_GOAL_OPTIONS,
  DailyGoalOption,
} from "@/lib/onboarding";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (name: string, goal: DailyGoalType) => void;
  initialName?: string;
  initialGoal?: DailyGoalType;
}

export function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
  initialName = "",
  initialGoal = "regular",
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(initialName);
  const [selectedGoal, setSelectedGoal] = useState<DailyGoalType>(initialGoal);

  if (!isOpen) return null;

  const handleSkip = () => {
    onComplete(name.trim() || "Pelajar LogiKode", selectedGoal);
    onClose();
  };

  const handleFinish = () => {
    onComplete(name.trim() || "Pelajar LogiKode", selectedGoal);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header Bar: Stepper Dots & Tombol Lewati */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === currentStep
                      ? "w-7 bg-emerald-500 shadow-xs"
                      : step < currentStep
                      ? "w-2 bg-emerald-300"
                      : "w-2 bg-slate-200"
                  }`}
                />
              ))}
              <span className="text-[10px] font-bold text-slate-400 font-mono ml-1">
                {currentStep}/3
              </span>
            </div>

            {/* Tombol Lewati (Skip) */}
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Lewati
            </button>
          </div>

          {/* Body Konten Sesuai Step */}
          <div className="flex-1 overflow-y-auto pr-0.5">
            {/* SLIDE 1: Sambutan & Value Proposition */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-slate-900 flex items-center justify-center shrink-0">
                  <Image
                    src="/logo.png"
                    alt="LogiKode"
                    width={64}
                    height={64}
                    className="object-cover"
                    priority
                  />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Selamat Datang di LogiKode! 👋
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Cara seru belajar logika pemrograman dari nol modal Rp 0,
                    dirancang khusus oleh{" "}
                    <strong className="text-emerald-600 font-bold">
                      Core Dev Group
                    </strong>
                    .
                  </p>
                </div>

                {/* 3 Nilai Utama */}
                <div className="w-full space-y-2.5 text-left pt-1">
                  <div className="flex items-start gap-2.5 bg-emerald-50/70 border border-emerald-200/60 p-2.5 rounded-2xl">
                    <div className="p-1 bg-emerald-500 text-white rounded-xl shrink-0 mt-0.5">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">
                        Logika Pemrograman Dasar
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Pahami variabel, kondisi, loop, dan query SQL secara interaktif.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-2xl">
                    <div className="p-1 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">
                        Gamifikasi ala Duolingo
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Kumpulkan XP, pertahankan Streak harian, dan hindari kehabisan Hearts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-indigo-50/70 border border-indigo-200/60 p-2.5 rounded-2xl">
                    <div className="p-1 bg-indigo-500 text-white rounded-xl shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">
                        Sertifikat Digital Resmi
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Tuntaskan tiap unit untuk klaim sertifikat ber-QR Code tervalidasi.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SLIDE 2: Personalisasi Nama Panggilan */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col space-y-4"
              >
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2.5 shadow-inner">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Siapa nama panggilanmu?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Kami akan menyapamu dengan nama ini di beranda, profil, dan
                    lembar sertifikat kelulusanmu.
                  </p>
                </div>

                <div className="pt-2">
                  <label
                    htmlFor="userNameInput"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Nama Lengkap / Panggilan:
                  </label>
                  <input
                    id="userNameInput"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 30))}
                    placeholder="Contoh: Muhammad Amin / Budi"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-hidden text-sm font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-400 transition-colors shadow-2xs"
                    autoFocus
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
                    <span>Maksimal 30 karakter</span>
                    <span>{name.length}/30</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    Tenang, kamu dapat mengganti nama ini kapan saja di halaman Profil.
                  </span>
                </div>
              </motion.div>
            )}

            {/* SLIDE 3: Pilih Target Ritme Belajar Harian */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col space-y-3.5"
              >
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
                    <Rocket className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Pilih Target Harianmu! 🎯
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Berapa ritme belajar yang kamu inginkan tiap hari?
                  </p>
                </div>

                {/* Daftar Pilihan Target */}
                <div className="space-y-2 pt-1">
                  {DAILY_GOAL_OPTIONS.map((goal: DailyGoalOption) => {
                    const isSelected = selectedGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => setSelectedGoal(goal.id)}
                        className={`w-full p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50/80 border-emerald-500 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl shrink-0">{goal.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-800">
                                {goal.title}
                              </span>
                              {goal.badge && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full border border-emerald-300">
                                  {goal.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {goal.subtitle}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions Navigasi */}
          <div className="pt-4 mt-3 border-t border-slate-100 shrink-0 flex items-center gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() =>
                  setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2) : 1))
                }
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() =>
                  setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as 2 | 3) : 3))
                }
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>{currentStep === 1 ? "Mulai Personalisasi" : "Pilih Target Belajar"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>Mulai Belajar Sekarang!</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
