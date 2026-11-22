import { describe, it, expect } from "vitest";
import {
  CURRICULUM_UNITS,
  getAllLevels,
  getLevelById,
  getNextLevelId,
} from "@/data/curriculum";
import {
  MultipleChoiceQuestion,
  CodeOrderQuestion,
  FillBlankQuestion,
} from "@/types/curriculum";

describe("Curriculum Data Validation", () => {
  it("harus memiliki minimal 4 Unit", () => {
    expect(CURRICULUM_UNITS.length).toBeGreaterThanOrEqual(4);
  });

  it("harus memiliki minimal 12 Level di seluruh kurikulum", () => {
    const allLevels = getAllLevels();
    expect(allLevels.length).toBeGreaterThanOrEqual(12);
  });

  it("harus memiliki minimal 60 Soal di seluruh kurikulum", () => {
    const allLevels = getAllLevels();
    const totalQuestions = allLevels.reduce(
      (sum, level) => sum + level.questions.length,
      0
    );
    expect(totalQuestions).toBeGreaterThanOrEqual(60);
  });

  it("tidak boleh ada ID unit, level, atau soal yang duplikat", () => {
    const unitIds = new Set<string>();
    const levelIds = new Set<string>();
    const questionIds = new Set<string>();

    for (const unit of CURRICULUM_UNITS) {
      expect(unitIds.has(unit.id), `ID Unit duplikat: ${unit.id}`).toBe(false);
      unitIds.add(unit.id);

      for (const level of unit.levels) {
        expect(levelIds.has(level.id), `ID Level duplikat: ${level.id}`).toBe(false);
        levelIds.add(level.id);

        for (const question of level.questions) {
          expect(
            questionIds.has(question.id),
            `ID Soal duplikat: ${question.id}`
          ).toBe(false);
          questionIds.add(question.id);
        }
      }
    }
  });

  it("setiap soal wajib memiliki penjelasan (explanation) edukatif yang tidak kosong", () => {
    const allLevels = getAllLevels();

    for (const level of allLevels) {
      for (const question of level.questions) {
        expect(
          question.explanation && question.explanation.trim().length > 10,
          `Soal ${question.id} di level ${level.id} tidak memiliki explanation yang memadai`
        ).toBe(true);
      }
    }
  });

  describe("Validasi Integritas Kunci Jawaban Soal", () => {
    const allLevels = getAllLevels();

    it("tipe multiple_choice harus memiliki correctIndex yang valid di dalam array options", () => {
      for (const level of allLevels) {
        for (const question of level.questions) {
          if (question.type === "multiple_choice") {
            const mc = question as MultipleChoiceQuestion;
            expect(mc.options.length).toBeGreaterThanOrEqual(2);
            expect(mc.correctIndex).toBeGreaterThanOrEqual(0);
            expect(mc.correctIndex).toBeLessThan(mc.options.length);
          }
        }
      }
    });

    it("tipe fill_blank harus memiliki placeholder '___' dan correctAnswer harus ada di dalam options", () => {
      for (const level of allLevels) {
        for (const question of level.questions) {
          if (question.type === "fill_blank") {
            const fb = question as FillBlankQuestion;
            expect(
              fb.codeTemplate.includes("___"),
              `Soal ${fb.id} tidak memiliki placeholder '___'`
            ).toBe(true);
            expect(
              fb.options.includes(fb.correctAnswer),
              `correctAnswer "${fb.correctAnswer}" di soal ${fb.id} tidak ditemukan dalam options`
            ).toBe(true);
          }
        }
      }
    });

    it("tipe code_order harus memiliki correctOrder dengan panjang dan elemen permutasi yang cocok dengan blocks", () => {
      for (const level of allLevels) {
        for (const question of level.questions) {
          if (question.type === "code_order") {
            const co = question as CodeOrderQuestion;
            expect(co.correctOrder.length).toBe(co.blocks.length);

            // Periksa bahwa semua baris di blocks ada di correctOrder
            const sortedBlocks = [...co.blocks].sort();
            const sortedOrder = [...co.correctOrder].sort();
            expect(
              sortedBlocks,
              `Elemen blocks dan correctOrder tidak cocok pada soal ${co.id}`
            ).toEqual(sortedOrder);
          }
        }
      }
    });
  });

  describe("Helper Functions", () => {
    it("getLevelById harus mengembalikan level yang sesuai atau undefined", () => {
      const level = getLevelById("level-1-1");
      expect(level).toBeDefined();
      expect(level?.id).toBe("level-1-1");

      const notFound = getLevelById("non-existent-level");
      expect(notFound).toBeUndefined();
    });

    it("getNextLevelId harus mengembalikan ID level berikutnya secara berurutan", () => {
      const nextId = getNextLevelId("level-1-1");
      expect(nextId).toBe("level-1-2");

      const allLevels = getAllLevels();
      const lastLevelId = allLevels[allLevels.length - 1].id;
      expect(getNextLevelId(lastLevelId)).toBeNull();
    });
  });
});
