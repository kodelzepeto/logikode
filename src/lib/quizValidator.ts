import { Question } from "@/types/curriculum";

export interface ValidationResult {
  isCorrect: boolean;
  correctAnswerDisplay: string;
}

/**
 * Memvalidasi jawaban pengguna terhadap 3 jenis soal secara murni (pure function).
 * Mengembalikan status kebenaran dan format tampilan kunci jawaban jika salah.
 */
export function validateAnswer(
  question: Question,
  userAnswer: unknown
): ValidationResult {
  switch (question.type) {
    case "multiple_choice": {
      const isCorrect =
        typeof userAnswer === "number" && userAnswer === question.correctIndex;
      const correctAnswerDisplay =
        question.options[question.correctIndex] ?? "";

      return {
        isCorrect,
        correctAnswerDisplay,
      };
    }

    case "code_order": {
      if (!Array.isArray(userAnswer)) {
        return {
          isCorrect: false,
          correctAnswerDisplay: question.correctOrder.join("\n"),
        };
      }

      const isCorrect =
        userAnswer.length === question.correctOrder.length &&
        userAnswer.every((block, idx) => block === question.correctOrder[idx]);

      return {
        isCorrect,
        correctAnswerDisplay: question.correctOrder.join("\n"),
      };
    }

    case "fill_blank": {
      const isCorrect =
        typeof userAnswer === "string" &&
        userAnswer.trim() === question.correctAnswer.trim();

      return {
        isCorrect,
        correctAnswerDisplay: question.correctAnswer,
      };
    }

    default: {
      return {
        isCorrect: false,
        correctAnswerDisplay: "",
      };
    }
  }
}
