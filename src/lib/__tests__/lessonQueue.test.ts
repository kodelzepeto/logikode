import { describe, it, expect } from "vitest";
import { Question } from "@/types/curriculum";
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
} from "../lessonQueue";

const mockQuestions: Question[] = [
  {
    id: "q-1",
    type: "multiple_choice",
    prompt: "Pertanyaan 1",
    options: ["A", "B"],
    correctIndex: 0,
    explanation: "Penjelasan 1",
  },
  {
    id: "q-2",
    type: "multiple_choice",
    prompt: "Pertanyaan 2",
    options: ["X", "Y"],
    correctIndex: 1,
    explanation: "Penjelasan 2",
  },
  {
    id: "q-3",
    type: "multiple_choice",
    prompt: "Pertanyaan 3",
    options: ["1", "2"],
    correctIndex: 0,
    explanation: "Penjelasan 3",
  },
];

describe("Lesson Retry Queue (Duolingo Style)", () => {
  it("harus menginisialisasi antrean soal dengan benar", () => {
    const state = createLessonQueue(mockQuestions);

    expect(state.totalOriginalQuestions).toBe(3);
    expect(state.queue.length).toBe(3);
    expect(state.queue[0].id).toBe("q-1");
    expect(state.missedIds).toEqual([]);
    expect(state.resolvedCount).toBe(0);
    expect(isQueueFinished(state)).toBe(false);
    expect(getQueueProgressPercent(state)).toBe(0);
  });

  it("alurnya sempurna jika semua benar di percobaan pertama → akurasi 100%, antrean habis", () => {
    let state = createLessonQueue(mockQuestions);

    // Jawab q-1 benar
    state = handleCorrectAnswer(state);
    expect(state.resolvedCount).toBe(1);
    expect(state.queue.length).toBe(2);
    expect(state.queue[0].id).toBe("q-2");
    expect(getQueueProgressPercent(state)).toBe(33);

    // Jawab q-2 benar
    state = handleCorrectAnswer(state);
    expect(state.resolvedCount).toBe(2);
    expect(state.queue.length).toBe(1);
    expect(state.queue[0].id).toBe("q-3");
    expect(getQueueProgressPercent(state)).toBe(67);

    // Jawab q-3 benar
    state = handleCorrectAnswer(state);
    expect(state.resolvedCount).toBe(3);
    expect(state.queue.length).toBe(0);
    expect(isQueueFinished(state)).toBe(true);
    expect(getQueueProgressPercent(state)).toBe(100);

    // Verifikasi akurasi dan firstTryCorrect
    expect(state.missedIds.length).toBe(0);
    expect(getFirstTryCorrectCount(state)).toBe(3);
    const accuracy = calculateAccuracy(state.totalOriginalQuestions, state.missedIds.length);
    expect(accuracy).toBe(100);
  });

  it("salah di soal tertentu lalu dijawab benar saat diulang → akurasi < 100%, soal tuntas", () => {
    let state = createLessonQueue(mockQuestions);

    // q-1: BENAR
    state = handleCorrectAnswer(state);
    expect(state.resolvedCount).toBe(1);
    expect(state.queue.map((q) => q.id)).toEqual(["q-2", "q-3"]);

    // q-2: SALAH -> dipindahkan ke belakang antrean!
    state = handleWrongAnswer(state);
    expect(state.resolvedCount).toBe(1); // Progress TIDAK maju
    expect(state.missedIds).toEqual(["q-2"]);
    expect(state.queue.map((q) => q.id)).toEqual(["q-3", "q-2"]);
    expect(getQueueProgressPercent(state)).toBe(33);

    // q-3: BENAR
    state = handleCorrectAnswer(state);
    expect(state.resolvedCount).toBe(2);
    expect(state.queue.map((q) => q.id)).toEqual(["q-2"]);
    expect(getQueueProgressPercent(state)).toBe(67);

    // Sekarang q-2 muncul kembali (pengulangan)
    expect(isRetryQuestion(state, state.queue[0].id)).toBe(true);
    expect(isRetryPhase(state)).toBe(true);

    // q-2 diulang: BENAR
    state = handleCorrectAnswer(state);
    expect(state.resolvedCount).toBe(3);
    expect(state.queue.length).toBe(0);
    expect(isQueueFinished(state)).toBe(true);
    expect(getQueueProgressPercent(state)).toBe(100);

    // Akurasi akhir harus < 100% karena pernah salah pada q-2
    expect(getFirstTryCorrectCount(state)).toBe(2);
    const accuracy = calculateAccuracy(state.totalOriginalQuestions, state.missedIds.length);
    expect(accuracy).toBe(67); // 2 / 3 * 100 = 67%
    expect(accuracy).toBeLessThan(100);
  });

  it("salah berkali-kali pada soal yang sama → ID soal dicatat satu kali, terus diulang sampai benar", () => {
    let state = createLessonQueue([mockQuestions[0]]); // Hanya 1 soal: q-1

    // Salah ke-1
    state = handleWrongAnswer(state);
    expect(state.missedIds).toEqual(["q-1"]);
    expect(state.resolvedCount).toBe(0);
    expect(state.queue.length).toBe(1);
    expect(isRetryQuestion(state, "q-1")).toBe(true);

    // Salah ke-2
    state = handleWrongAnswer(state);
    expect(state.missedIds).toEqual(["q-1"]); // Tidak duplicate
    expect(state.resolvedCount).toBe(0);
    expect(state.queue.length).toBe(1);

    // Salah ke-3
    state = handleWrongAnswer(state);
    expect(state.missedIds).toEqual(["q-1"]);
    expect(state.resolvedCount).toBe(0);

    // Akhirnya Benar
    state = handleCorrectAnswer(state);
    expect(state.resolvedCount).toBe(1);
    expect(isQueueFinished(state)).toBe(true);

    // Akurasi tidak boleh 100%
    const accuracy = calculateAccuracy(state.totalOriginalQuestions, state.missedIds.length);
    expect(accuracy).toBe(0); // 0 / 1 = 0%
  });

  it("anti-100%: akurasi tidak pernah 100% jika ada kesalahan (bahkan jika dibulatkan)", () => {
    // Kasus 1 salah dari 200 soal: 199/200 = 99.5%, Math.round akan jadi 100 jika tanpa proteksi
    const accuracy = calculateAccuracy(200, 1);
    expect(accuracy).toBe(99);
    expect(accuracy).toBeLessThan(100);
  });

  it("progress bar hanya bertambah ketika soal unik dijawab benar", () => {
    let state = createLessonQueue(mockQuestions);
    expect(getQueueProgressPercent(state)).toBe(0);

    // Salah 3x berturut-turut
    state = handleWrongAnswer(state);
    expect(getQueueProgressPercent(state)).toBe(0);
    state = handleWrongAnswer(state);
    expect(getQueueProgressPercent(state)).toBe(0);
    state = handleWrongAnswer(state);
    expect(getQueueProgressPercent(state)).toBe(0);

    // Benar 1 soal
    state = handleCorrectAnswer(state);
    expect(getQueueProgressPercent(state)).toBe(33);

    // Benar 1 soal lagi
    state = handleCorrectAnswer(state);
    expect(getQueueProgressPercent(state)).toBe(67);
  });

  it("menangani antrean kosong dengan aman", () => {
    let emptyState = createLessonQueue([]);
    expect(isQueueFinished(emptyState)).toBe(true);
    expect(getQueueProgressPercent(emptyState)).toBe(100);
    expect(calculateAccuracy(0, 0)).toBe(100);

    // Panggilan pada antrean kosong tidak error
    emptyState = handleCorrectAnswer(emptyState);
    emptyState = handleWrongAnswer(emptyState);
    expect(emptyState.queue.length).toBe(0);
  });
});
