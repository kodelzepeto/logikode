/**
 * ===================================================================
 * LogiKode — Sistem Combo Streak di Dalam Kuis (Pure Logic)
 * Dikembangkan oleh Core Dev Group (https://core-dev-group.my.id)
 * ===================================================================
 */

export interface ComboMilestone {
  count: number;
  badgeText: string;
  subtitle: string;
  icon: string;
  theme: "amber" | "orange" | "purple";
  sound: "combo_3" | "combo_5";
}

export const COMBO_MILESTONES: Record<number, ComboMilestone> = {
  3: {
    count: 3,
    badgeText: "3x Combo!",
    subtitle: "Fokus kodingmu tajam! 🔥",
    icon: "🔥",
    theme: "amber",
    sound: "combo_3",
  },
  5: {
    count: 5,
    badgeText: "5x Combo!",
    subtitle: "Luar biasa! Tak terhentikan! ⚡",
    icon: "⚡",
    theme: "orange",
    sound: "combo_5",
  },
  7: {
    count: 7,
    badgeText: "7x Super Combo!",
    subtitle: "Konsentrasi tingkat master! 🌟",
    icon: "🌟",
    theme: "purple",
    sound: "combo_5",
  },
};

/**
 * Mendeteksi apakah jumlah combo saat ini mencapai milestone selebrasi tertentu (3x, 5x, 7x, atau kelipatan 5 berikutnya).
 */
export function getComboMilestone(combo: number): ComboMilestone | null {
  if (combo <= 0) return null;

  if (combo in COMBO_MILESTONES) {
    return COMBO_MILESTONES[combo];
  }

  // Kelipatan 5 berikutnya (10, 15, 20, ...)
  if (combo > 7 && combo % 5 === 0) {
    return {
      count: combo,
      badgeText: `${combo}x Mega Combo!`,
      subtitle: "Rentetan koding sempurna tanpa celah! 👑",
      icon: "👑",
      theme: "purple",
      sound: "combo_5",
    };
  }

  return null;
}

/**
 * Memperbarui hitungan combo secara murni berdasarkan kebenaran jawaban.
 * Jika jawaban benar: combo + 1, cek apakah mencapai milestone.
 * Jika jawaban salah: combo reset ke 0.
 */
export function updateCombo(
  currentCombo: number,
  isCorrect: boolean
): {
  newCombo: number;
  milestone: ComboMilestone | null;
} {
  if (!isCorrect) {
    return {
      newCombo: 0,
      milestone: null,
    };
  }

  const newCombo = Math.max(0, currentCombo) + 1;
  const milestone = getComboMilestone(newCombo);

  return {
    newCombo,
    milestone,
  };
}

/**
 * Menghasilkan teks label ringkas untuk badge combo di header / status bar.
 */
export function formatComboLabel(combo: number): string {
  if (combo < 2) return "";
  return `${combo}x Combo`;
}

/**
 * Menentukan tipe efek suara yang harus dimainkan berdasarkan hitungan combo.
 */
export function getComboSoundType(
  combo: number
): "combo_5" | "combo_3" | "correct" {
  if (combo >= 5) return "combo_5";
  if (combo >= 3) return "combo_3";
  return "correct";
}
