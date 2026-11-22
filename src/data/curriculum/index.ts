import { Unit, Level } from "@/types/curriculum";
import { unit1 } from "./unit1";
import { unit2 } from "./unit2";
import { unit3 } from "./unit3";
import { unit4 } from "./unit4";

export const CURRICULUM_UNITS: Unit[] = [unit1, unit2, unit3, unit4];

/**
 * Mengambil semua level dari seluruh unit secara berurutan.
 */
export function getAllLevels(): Level[] {
  return CURRICULUM_UNITS.flatMap((unit) => unit.levels);
}

/**
 * Mencari data level spesifik berdasarkan ID level.
 */
export function getLevelById(id: string): Level | undefined {
  const allLevels = getAllLevels();
  return allLevels.find((level) => level.id === id);
}

/**
 * Mencari ID level berikutnya setelah level saat ini.
 * Mengembalikan null jika level saat ini adalah level terakhir.
 */
export function getNextLevelId(currentLevelId: string): string | null {
  const allLevels = getAllLevels();
  const currentIndex = allLevels.findIndex((l) => l.id === currentLevelId);

  if (currentIndex === -1 || currentIndex === allLevels.length - 1) {
    return null;
  }

  return allLevels[currentIndex + 1].id;
}
