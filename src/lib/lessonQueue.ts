/**
 * Logika Pengelolaan Antrean Soal Kuis (Lesson Retry Queue ala Duolingo)
 * Pure functions untuk mengelola siklus hidup pertanyaan dalam satu sesi kuis.
 * Soal yang salah akan dimasukkan kembali ke antrean akhir hingga dijawab benar,
 * namun akurasi akhir tetap mencerminkan performa percobaan pertama (anti-100% jika ada salah).
 */

import { Question } from "@/types/curriculum";

export interface LessonQueueState {
  totalOriginalQuestions: number;
  queue: Question[];
  missedIds: string[];
  resolvedCount: number;
}

/**
 * Menginisialisasi state antrean sesi kuis baru dari daftar soal asli suatu level.
 */
export function createLessonQueue(questions: Question[]): LessonQueueState {
  return {
    totalOriginalQuestions: questions.length,
    queue: [...questions],
    missedIds: [],
    resolvedCount: 0,
  };
}

/**
 * Memeriksa apakah soal saat ini merupakan soal yang pernah dijawab salah (pengulangan).
 */
export function isRetryQuestion(
  state: LessonQueueState,
  questionId: string
): boolean {
  return state.missedIds.includes(questionId);
}

/**
 * Memeriksa apakah sesi sedang berada di fase pengulangan
 * (semua soal yang tersisa dalam antrean adalah soal yang pernah salah).
 */
export function isRetryPhase(state: LessonQueueState): boolean {
  if (state.queue.length === 0 || state.missedIds.length === 0) return false;
  return state.queue.every((q) => state.missedIds.includes(q.id));
}

/**
 * Menangani jawaban BENAR:
 * - Mengeluarkan soal dari bagian depan antrean (queue).
 * - Menambah counter resolvedCount (+1).
 */
export function handleCorrectAnswer(state: LessonQueueState): LessonQueueState {
  if (state.queue.length === 0) return state;

  return {
    ...state,
    queue: state.queue.slice(1),
    resolvedCount: state.resolvedCount + 1,
  };
}

/**
 * Menangani jawaban SALAH:
 * - Mencatat ID soal ke dalam missedIds (jika belum tercatat).
 * - Memindahkan soal yang sedang aktif ke bagian paling belakang antrean (retry queue).
 * - resolvedCount TIDAK bertambah.
 */
export function handleWrongAnswer(state: LessonQueueState): LessonQueueState {
  if (state.queue.length === 0) return state;

  const currentQuestion = state.queue[0];
  const nextQueue = [...state.queue.slice(1), currentQuestion];
  const nextMissed = state.missedIds.includes(currentQuestion.id)
    ? state.missedIds
    : [...state.missedIds, currentQuestion.id];

  return {
    ...state,
    queue: nextQueue,
    missedIds: nextMissed,
  };
}

/**
 * Menghitung jumlah soal yang dijawab benar pada percobaan pertama (first try).
 */
export function getFirstTryCorrectCount(state: LessonQueueState): number {
  return Math.max(0, state.totalOriginalQuestions - state.missedIds.length);
}

/**
 * Menghitung persentase akurasi akhir.
 * Anti-100%: Jika pernah melakukan kesalahan (missedQuestionCount > 0),
 * akurasi dijamin tidak akan pernah 100%.
 */
export function calculateAccuracy(
  totalOriginalQuestions: number,
  missedQuestionCount: number
): number {
  if (totalOriginalQuestions <= 0) return 100;

  const firstTryCorrect = Math.max(0, totalOriginalQuestions - missedQuestionCount);
  const rawAccuracy = Math.round((firstTryCorrect / totalOriginalQuestions) * 100);

  if (missedQuestionCount > 0 && rawAccuracy >= 100) {
    return 99;
  }

  return rawAccuracy;
}

/**
 * Menghitung persentase progress bar kuis (0 - 100%).
 * Hanya bertambah ketika soal unik berhasil dijawab benar.
 */
export function getQueueProgressPercent(state: LessonQueueState): number {
  if (state.totalOriginalQuestions <= 0) return 100;
  return Math.min(
    100,
    Math.round((state.resolvedCount / state.totalOriginalQuestions) * 100)
  );
}

/**
 * Memeriksa apakah seluruh antrean soal telah tuntas.
 */
export function isQueueFinished(state: LessonQueueState): boolean {
  return state.queue.length === 0;
}
