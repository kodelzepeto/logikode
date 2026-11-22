"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Level, Question } from "@/types/curriculum";
import { useUserProgress } from "@/hooks/useUserProgress";
import { getAllLevels, getNextLevelId } from "@/data/curriculum";
import {
  isLevelUnlocked,
  isUnlimitedHeartsActive,
  calculateLevelXP,
} from "@/lib/gamification";
import { validateAnswer, ValidationResult } from "@/lib/quizValidator";
import {
  playCorrect,
  playWrong,
  playLevelComplete,
  playClick,
} from "@/lib/sound";
import { LessonHeader } from "./LessonHeader";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { CodeOrderQuestion } from "./CodeOrderQuestion";
import { FillBlankQuestion } from "./FillBlankQuestion";
import { FeedbackDrawer } from "./FeedbackDrawer";
import { LessonComplete } from "./LessonComplete";
import { OutOfHeartsScreen } from "./OutOfHeartsScreen";
import { Lock, ArrowLeft } from "lucide-react";

interface LessonRunnerProps {
  level: Level;
}

export function LessonRunner({ level }: LessonRunnerProps) {
  const { progress, isLoaded, consumeHeart, completeLevel } = useUserProgress();
  const allLevels = getAllLevels();
  const nextLevelId = getNextLevelId(level.id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<unknown>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [feedback, setFeedback] = useState<
    (ValidationResult & { explanation: string }) | null
  >(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Tunggu client mount untuk menghindari hydration mismatch
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isUnlimited = isUnlimitedHeartsActive(progress);

  // Proteksi 1: Level masih terkunci
  const unlocked = isLevelUnlocked(level.id, allLevels, progress.completedLevels);
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-20 h-20 rounded-3xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-10 h-10" />
        </div>
        <h1 className="text-xl font-black text-slate-800">
          Level Masih Terkunci!
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
          Selesaikan level-level sebelumnya terlebih dahulu untuk dapat mengakses
          tantangan ini.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Peta Belajar</span>
        </Link>
      </div>
    );
  }

  // Proteksi 2: Nyawa habis (0) dan tidak memiliki Unlimited Hearts
  if (progress.hearts <= 0 && !isUnlimited && !isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto border-x border-slate-200">
        <LessonHeader
          currentQuestionIndex={currentIndex}
          totalQuestions={level.questions.length}
          hearts={progress.hearts}
          isUnlimited={isUnlimited}
        />
        <OutOfHeartsScreen />
      </div>
    );
  }

  // Layar Selesai (Selebrasi & XP)
  if (isFinished) {
    const accuracy = Math.round((correctCount / level.questions.length) * 100);
    const earnedXP = calculateLevelXP(
      level.id,
      progress.completedLevels,
      correctCount
    );

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto border-x border-slate-200">
        <LessonComplete
          level={level}
          earnedXP={earnedXP}
          accuracy={accuracy}
          streak={progress.streak}
          nextLevelId={nextLevelId}
        />
      </div>
    );
  }

  const currentQuestion = level.questions[currentIndex];

  // Evaluasi apakah tombol "Periksa" boleh diaktifkan
  const isAnswerProvided = () => {
    if (userAnswer === null || userAnswer === undefined) return false;
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

  // Aksi: Pengguna menekan tombol "Periksa"
  const handleCheck = () => {
    if (!isAnswerProvided()) return;

    const result = validateAnswer(currentQuestion, userAnswer);

    if (result.isCorrect) {
      setCorrectCount((prev) => prev + 1);
      playCorrect();
    } else {
      consumeHeart();
      playWrong();
    }

    setFeedback({
      ...result,
      explanation: currentQuestion.explanation,
    });
    setIsAnswerChecked(true);
  };

  // Aksi: Pengguna menekan tombol "Lanjut" pada feedback drawer
  const handleNext = () => {
    playClick();

    // Jika jawaban salah dan nyawa tersisa 0 tanpa Unlimited Hearts -> tampilkan Out of Hearts
    if (!feedback?.isCorrect && progress.hearts <= 1 && !isUnlimited) {
      setIsAnswerChecked(false);
      setFeedback(null);
      return;
    }

    if (currentIndex < level.questions.length - 1) {
      // Pindah ke soal berikutnya
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer(null);
      setIsAnswerChecked(false);
      setFeedback(null);
    } else {
      // Kuis tuntas! Panggil completeLevel dan bunyikan suara fanfare
      const finalCorrectCount = feedback?.isCorrect
        ? correctCount
        : correctCount;
      completeLevel(level.id, finalCorrectCount);
      playLevelComplete();
      setIsFinished(true);
    }
  };

  // Render komponen soal interaktif berdasarkan tipenya
  const renderQuestion = (q: Question) => {
    switch (q.type) {
      case "multiple_choice":
        return (
          <MultipleChoiceQuestion
            question={q}
            selectedIndex={typeof userAnswer === "number" ? userAnswer : null}
            onSelect={(idx) => {
              playClick();
              setUserAnswer(idx);
            }}
            disabled={isAnswerChecked}
          />
        );
      case "code_order":
        return (
          <CodeOrderQuestion
            question={q}
            orderedBlocks={Array.isArray(userAnswer) ? userAnswer : []}
            onChange={(blocks) => setUserAnswer(blocks)}
            disabled={isAnswerChecked}
          />
        );
      case "fill_blank":
        return (
          <FillBlankQuestion
            question={q}
            selectedAnswer={typeof userAnswer === "string" ? userAnswer : null}
            onSelect={(ans) => setUserAnswer(ans)}
            disabled={isAnswerChecked}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto border-x border-slate-200 relative pb-28">
      {/* Top Header dengan progress bar dan nyawa */}
      <LessonHeader
        currentQuestionIndex={currentIndex}
        totalQuestions={level.questions.length}
        hearts={progress.hearts}
        isUnlimited={isUnlimited}
      />

      {/* Konten Soal */}
      <main className="flex-1 p-5 flex flex-col justify-start">
        {renderQuestion(currentQuestion)}
      </main>

      {/* Bilah Tombol Periksa (Bawah) jika belum diperiksa */}
      {!isAnswerChecked && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30">
          <button
            type="button"
            disabled={!isAnswerProvided()}
            onClick={handleCheck}
            className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all select-none border-b-4 ${
              isAnswerProvided()
                ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white shadow-md active:translate-y-1 active:border-b-0 cursor-pointer"
                : "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
            }`}
          >
            Periksa
          </button>
        </div>
      )}

      {/* Feedback Drawer (Muncul saat jawaban diperiksa) */}
      {isAnswerChecked && feedback && (
        <FeedbackDrawer
          isCorrect={feedback.isCorrect}
          explanation={feedback.explanation}
          correctAnswerDisplay={feedback.correctAnswerDisplay}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
