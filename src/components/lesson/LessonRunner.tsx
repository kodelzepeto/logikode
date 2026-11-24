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
  createLessonQueue,
  handleCorrectAnswer,
  handleWrongAnswer,
  isRetryQuestion,
  isRetryPhase,
  calculateAccuracy,
  getFirstTryCorrectCount,
  getQueueProgressPercent,
  isQueueFinished,
  LessonQueueState,
} from "@/lib/lessonQueue";
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
import { Lock, ArrowLeft, RotateCcw, Sparkles } from "lucide-react";

interface LessonRunnerProps {
  level: Level;
}

export function LessonRunner({ level }: LessonRunnerProps) {
  const { progress, isLoaded, consumeHeart, completeLevel } = useUserProgress();
  const allLevels = getAllLevels();
  const nextLevelId = getNextLevelId(level.id);

  // Menggunakan Lesson Retry Queue ala Duolingo
  const [queueState, setQueueState] = useState<LessonQueueState>(() =>
    createLessonQueue(level.questions)
  );
  const [userAnswer, setUserAnswer] = useState<unknown>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [feedback, setFeedback] = useState<
    (ValidationResult & { explanation: string }) | null
  >(null);
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
          currentQuestionIndex={queueState.resolvedCount}
          totalQuestions={queueState.totalOriginalQuestions}
          hearts={progress.hearts}
          isUnlimited={isUnlimited}
          progressPercentOverride={getQueueProgressPercent(queueState)}
        />
        <OutOfHeartsScreen />
      </div>
    );
  }

  // Layar Selesai (Selebrasi & XP dengan Akurasi Jujur Anti-100%)
  if (isFinished || isQueueFinished(queueState)) {
    const accuracy = calculateAccuracy(
      queueState.totalOriginalQuestions,
      queueState.missedIds.length
    );
    const firstTryCorrect = getFirstTryCorrectCount(queueState);
    const earnedXP = calculateLevelXP(
      level.id,
      progress.completedLevels,
      firstTryCorrect
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

  const currentQuestion = queueState.queue[0];
  const isRetry = currentQuestion
    ? isRetryQuestion(queueState, currentQuestion.id)
    : false;
  const inRetryPhase = isRetryPhase(queueState);
  const progressPercent = getQueueProgressPercent(queueState);

  // Evaluasi apakah tombol "Periksa" boleh diaktifkan
  const isAnswerProvided = () => {
    if (!currentQuestion) return false;
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
    if (!currentQuestion || !isAnswerProvided()) return;

    const result = validateAnswer(currentQuestion, userAnswer);

    if (result.isCorrect) {
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

    if (!feedback) return;

    // Jika jawaban salah dan nyawa tersisa 0 tanpa Unlimited Hearts -> tampilkan Out of Hearts
    if (!feedback.isCorrect && progress.hearts <= 1 && !isUnlimited) {
      setIsAnswerChecked(false);
      setFeedback(null);
      return;
    }

    if (feedback.isCorrect) {
      const nextState = handleCorrectAnswer(queueState);
      setQueueState(nextState);

      if (isQueueFinished(nextState)) {
        // Seluruh antrean kuis tuntas! Panggil completeLevel dengan firstTryCorrect (anti-farming)
        const firstTryCorrect = getFirstTryCorrectCount(nextState);
        completeLevel(level.id, firstTryCorrect);
        playLevelComplete();
        setIsFinished(true);
      } else {
        setUserAnswer(null);
        setIsAnswerChecked(false);
        setFeedback(null);
      }
    } else {
      // Jawaban salah: pindahkan soal aktif ke bagian belakang antrean (Duolingo Retry Queue)
      const nextState = handleWrongAnswer(queueState);
      setQueueState(nextState);
      setUserAnswer(null);
      setIsAnswerChecked(false);
      setFeedback(null);
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
        currentQuestionIndex={queueState.resolvedCount}
        totalQuestions={queueState.totalOriginalQuestions}
        hearts={progress.hearts}
        isUnlimited={isUnlimited}
        progressPercentOverride={progressPercent}
      />

      {/* Konten Soal */}
      <main
        key={currentQuestion ? `${currentQuestion.id}-${queueState.queue.length}` : "empty"}
        className="flex-1 p-5 flex flex-col justify-start"
      >
        {/* Notifikasi Pengulangan di Akhir Sesi yang Ramah */}
        {inRetryPhase && (
          <div className="mb-3 px-3.5 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl flex items-center gap-2 text-amber-900 text-xs font-bold shadow-2xs animate-fadeIn">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Ayo selesaikan soal yang tadi keliru sampai tuntas! 💪</span>
          </div>
        )}

        {/* Badge Soal Pengulangan ala Duolingo */}
        {isRetry && (
          <div className="mb-3 self-start inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 border border-amber-300 text-amber-800 rounded-xl text-xs font-bold animate-fadeIn shadow-2xs">
            <RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>🔁 Kesalahan Sebelumnya — Coba Lagi!</span>
          </div>
        )}

        {currentQuestion && renderQuestion(currentQuestion)}
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
