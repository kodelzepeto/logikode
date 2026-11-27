"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Zap, Award, RotateCcw, Home, Share2, Sparkles, Flame } from "lucide-react";
import type { Question, Level } from "@/types/curriculum";
import { getAllLevels } from "@/data/curriculum";
import { useUserProgress } from "@/hooks/useUserProgress";
import { validateAnswer, ValidationResult } from "@/lib/quizValidator";
import {
  playCorrect,
  playWrong,
  playLevelComplete,
  playClick,
  playComboSound,
} from "@/lib/sound";
import { updateCombo, ComboMilestone } from "@/lib/combo";
import {
  generateStoryShareImage,
  downloadDataUrl,
} from "@/lib/canvasGenerator";
import { MultipleChoiceQuestion } from "@/components/lesson/MultipleChoiceQuestion";
import { CodeOrderQuestion } from "@/components/lesson/CodeOrderQuestion";
import { FillBlankQuestion } from "@/components/lesson/FillBlankQuestion";
import { FeedbackDrawer } from "@/components/lesson/FeedbackDrawer";

function selectPracticeQuestions(
  allLevels: Level[],
  completedLevels: string[]
): Question[] {
  const completedSet = new Set(completedLevels);
  const matched = allLevels.filter((lvl) => completedSet.has(lvl.id));
  const sourceLevels = matched.length > 0 ? matched : [allLevels[0]];
  const pool = sourceLevels.flatMap((lvl) => lvl.questions);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

export default function PracticePage() {
  const { progress, completePractice } = useUserProgress();
  const allLevels = getAllLevels();

  const [sessionQuestions, setSessionQuestions] = useState<Question[]>(() =>
    selectPracticeQuestions(allLevels, progress.completedLevels)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<unknown>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [feedback, setFeedback] = useState<
    (ValidationResult & { explanation: string }) | null
  >(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState<ComboMilestone | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Mulai sesi latihan 5 soal baru
  const startNewSession = () => {
    setSessionQuestions(selectPracticeQuestions(allLevels, progress.completedLevels));
    setCurrentIndex(0);
    setUserAnswer(null);
    setIsAnswerChecked(false);
    setFeedback(null);
    setCorrectCount(0);
    setComboCount(0);
    setActiveMilestone(null);
    setIsFinished(false);
  };

  if (sessionQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center">
          <Sparkles className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          <p className="text-xs font-bold text-slate-600">Menyiapkan Latihan Acak...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = sessionQuestions[currentIndex];
  const progressPercent = Math.round(
    ((currentIndex + 1) / sessionQuestions.length) * 100
  );

  const isAnswerProvided = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === "code_order") {
      return (
        Array.isArray(userAnswer) &&
        userAnswer.length === currentQuestion.blocks.length
      );
    }
    if (currentQuestion.type === "fill_blank") {
      return typeof userAnswer === "string" && userAnswer.trim().length > 0;
    }
    if (currentQuestion.type === "multiple_choice") {
      return typeof userAnswer === "number";
    }
    return false;
  };

  const handleCheck = () => {
    if (!isAnswerProvided()) return;

    const result = validateAnswer(currentQuestion, userAnswer);

    const { newCombo, milestone } = updateCombo(comboCount, result.isCorrect);
    setComboCount(newCombo);
    setActiveMilestone(milestone);

    if (result.isCorrect) {
      setCorrectCount((prev) => prev + 1);
      if (milestone) {
        playComboSound(newCombo);
      } else {
        playCorrect();
      }
    } else {
      playWrong();
    }

    setFeedback({
      ...result,
      explanation: currentQuestion.explanation,
    });
    setIsAnswerChecked(true);
  };

  const handleNext = () => {
    playClick();

    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer(null);
      setIsAnswerChecked(false);
      setFeedback(null);
      setActiveMilestone(null);
    } else {
      // Sesi selesai! Dapatkan reward XP (+5 per jawaban benar)
      const earnedXP = correctCount * 5;
      completePractice(earnedXP, correctCount);
      playLevelComplete();
      setIsFinished(true);
    }
  };

  const handleShareStory = async () => {
    setIsSharing(true);
    try {
      const dataUrl = await generateStoryShareImage({
        streak: progress.streak,
        xp: progress.xp + correctCount * 5,
        completedCount: progress.completedLevels.length,
        totalLevels: allLevels.length,
        levelTitle: "Latihan Acak (Endless)",
      });
      downloadDataUrl(dataUrl, "LogiKode-Latihan-Story.png");
    } catch (err) {
      console.error("Gagal men-generate story:", err);
    } finally {
      setIsSharing(false);
    }
  };

  // Layar Selesai Latihan
  if (isFinished) {
    const earnedXP = correctCount * 5;
    const accuracy = Math.round(
      (correctCount / sessionQuestions.length) * 100
    );

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto border-x border-slate-200 p-6 select-none animate-fadeIn">
        <div className="my-auto flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-3xl bg-amber-100 text-amber-500 flex items-center justify-center shadow-inner mb-4 border border-amber-200">
            <Award className="w-14 h-14" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Latihan Selesai! 🎉
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            Otak kodingmu semakin terasah tajam. Latihan rutin adalah kunci utama
            menjadi software engineer handal!
          </p>

          {/* Reward Badges */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-6">
            <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200/80 shadow-xs flex flex-col items-center">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                Bonus XP
              </span>
              <div className="flex items-center gap-1 mt-1 text-amber-500 font-black text-2xl">
                <Zap className="w-5 h-5 fill-amber-500" />
                <span>+{earnedXP}</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border-2 border-emerald-200/80 shadow-xs flex flex-col items-center">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Akurasi
              </span>
              <span className="mt-1 text-emerald-600 font-black text-2xl">
                {accuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Tombol Aksi Akhir */}
        <div className="w-full flex flex-col gap-2.5 pt-6">
          <button
            type="button"
            onClick={handleShareStory}
            disabled={isSharing}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-b-4 border-indigo-800 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {isSharing ? "Merender Story PNG..." : "Pamer ke Story (Download PNG)"}
            </span>
          </button>

          <button
            type="button"
            onClick={startNewSession}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 border-b-4 border-amber-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Latihan 5 Soal Lagi</span>
          </button>

          <Link
            href="/"
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-center"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Peta Belajar</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto border-x border-slate-200 relative">
      {/* Header Practice */}
      <header className="w-full px-4 py-3 flex items-center justify-between gap-3 bg-white border-b border-slate-200 sticky top-0 z-20">
        <Link
          href="/"
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Keluar dari Latihan"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </Link>

        {/* Progress Bar */}
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Indikator Active Combo Streak (jika >= 2) */}
        {comboCount >= 2 && (
          <div
            className="flex items-center gap-1 font-black text-xs text-orange-600 bg-orange-50 border border-orange-200/90 px-2 py-1 rounded-xl shadow-2xs animate-fadeIn shrink-0"
            title={`${comboCount}x Jawaban Benar Beruntun!`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{comboCount}x</span>
          </div>
        )}

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 font-black text-xs">
          <Zap className="w-3.5 h-3.5 fill-amber-500" />
          <span>+5 XP</span>
        </div>
      </header>

      {/* Konten Soal */}
      <main className="flex-1 p-5 flex flex-col justify-between pb-28">
        <div>
          <div className="mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-100/60 px-2 py-0.5 rounded-md">
              Latihan Acak • Soal {currentIndex + 1} dari 5
            </span>
          </div>

          {currentQuestion.type === "multiple_choice" && (
            <MultipleChoiceQuestion
              question={currentQuestion}
              selectedIndex={
                typeof userAnswer === "number" ? userAnswer : null
              }
              onSelect={(idx) => {
                playClick();
                setUserAnswer(idx);
              }}
              disabled={isAnswerChecked}
            />
          )}

          {currentQuestion.type === "code_order" && (
            <CodeOrderQuestion
              question={currentQuestion}
              orderedBlocks={
                Array.isArray(userAnswer) ? (userAnswer as string[]) : []
              }
              onChange={(newOrder) => {
                playClick();
                setUserAnswer(newOrder);
              }}
              disabled={isAnswerChecked}
            />
          )}

          {currentQuestion.type === "fill_blank" && (
            <FillBlankQuestion
              question={currentQuestion}
              selectedAnswer={
                typeof userAnswer === "string" ? userAnswer : null
              }
              onSelect={(token: string | null) => {
                playClick();
                setUserAnswer(token);
              }}
              disabled={isAnswerChecked}
            />
          )}
        </div>
      </main>

      {/* Bottom Bar: Tombol Periksa (saat belum diperiksa) */}
      {!isAnswerChecked && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-slate-200 z-30">
          <button
            type="button"
            onClick={handleCheck}
            disabled={!isAnswerProvided()}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:border-slate-300 disabled:text-slate-400 border-b-4 border-amber-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            Periksa Jawaban
          </button>
        </div>
      )}

      {/* Drawer Feedback */}
      {isAnswerChecked && feedback && (
        <FeedbackDrawer
          isCorrect={feedback.isCorrect}
          correctAnswerDisplay={feedback.correctAnswerDisplay}
          explanation={feedback.explanation}
          onNext={handleNext}
          comboMilestone={activeMilestone}
        />
      )}
    </div>
  );
}
