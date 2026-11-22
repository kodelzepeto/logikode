import { describe, it, expect } from "vitest";
import { validateAnswer } from "../quizValidator";
import {
  MultipleChoiceQuestion,
  CodeOrderQuestion,
  FillBlankQuestion,
} from "@/types/curriculum";

describe("Quiz Answer Validator — Pure Function", () => {
  describe("multiple_choice question", () => {
    const question: MultipleChoiceQuestion = {
      id: "test-mcq-1",
      type: "multiple_choice",
      prompt: "Apa tipe data untuk angka 42?",
      options: ["String", "Number", "Boolean", "Object"],
      correctIndex: 1,
      explanation: "42 adalah tipe data number.",
    };

    it("harus benar jika pengguna memilih indeks yang tepat", () => {
      const result = validateAnswer(question, 1);
      expect(result.isCorrect).toBe(true);
      expect(result.correctAnswerDisplay).toBe("Number");
    });

    it("harus salah jika pengguna memilih indeks yang salah", () => {
      const result = validateAnswer(question, 0);
      expect(result.isCorrect).toBe(false);
      expect(result.correctAnswerDisplay).toBe("Number");
    });

    it("harus salah jika input bukan angka", () => {
      const result = validateAnswer(question, "1");
      expect(result.isCorrect).toBe(false);
    });

    it("harus salah jika input bernilai null atau undefined", () => {
      expect(validateAnswer(question, null).isCorrect).toBe(false);
      expect(validateAnswer(question, undefined).isCorrect).toBe(false);
    });
  });

  describe("code_order question", () => {
    const question: CodeOrderQuestion = {
      id: "test-co-1",
      type: "code_order",
      prompt: "Susun baris kode berikut!",
      blocks: ["let b = 2;", "let a = 1;", "let c = a + b;"],
      correctOrder: ["let a = 1;", "let b = 2;", "let c = a + b;"],
      explanation: "Inisialisasi a dan b terlebih dahulu.",
    };

    it("harus benar jika urutan blok persis sesuai correctOrder", () => {
      const userAnswer = ["let a = 1;", "let b = 2;", "let c = a + b;"];
      const result = validateAnswer(question, userAnswer);

      expect(result.isCorrect).toBe(true);
      expect(result.correctAnswerDisplay).toBe(question.correctOrder.join("\n"));
    });

    it("harus salah jika urutan terbalik atau tidak tepat", () => {
      const userAnswer = ["let b = 2;", "let a = 1;", "let c = a + b;"];
      const result = validateAnswer(question, userAnswer);

      expect(result.isCorrect).toBe(false);
      expect(result.correctAnswerDisplay).toBe(question.correctOrder.join("\n"));
    });

    it("harus salah jika jumlah blok yang disusun belum lengkap", () => {
      const userAnswer = ["let a = 1;"];
      const result = validateAnswer(question, userAnswer);

      expect(result.isCorrect).toBe(false);
    });

    it("harus salah jika userAnswer bukan array", () => {
      const result = validateAnswer(question, "let a = 1;");
      expect(result.isCorrect).toBe(false);
    });
  });

  describe("fill_blank question", () => {
    const question: FillBlankQuestion = {
      id: "test-fb-1",
      type: "fill_blank",
      prompt: "Lengkapi variabel!",
      codeTemplate: "let nama = ___;",
      options: ["\"Budi\"", "123", "true"],
      correctAnswer: "\"Budi\"",
      explanation: "Teks nama harus diapit tanda kutip.",
    };

    it("harus benar jika token jawaban cocok persis", () => {
      const result = validateAnswer(question, "\"Budi\"");
      expect(result.isCorrect).toBe(true);
      expect(result.correctAnswerDisplay).toBe("\"Budi\"");
    });

    it("harus benar jika token memiliki whitespace di awal/akhir", () => {
      const result = validateAnswer(question, " \"Budi\" ");
      expect(result.isCorrect).toBe(true);
    });

    it("harus salah jika token salah", () => {
      const result = validateAnswer(question, "123");
      expect(result.isCorrect).toBe(false);
      expect(result.correctAnswerDisplay).toBe("\"Budi\"");
    });

    it("harus salah jika token bernilai null atau string kosong", () => {
      expect(validateAnswer(question, null).isCorrect).toBe(false);
      expect(validateAnswer(question, "").isCorrect).toBe(false);
    });
  });
});
