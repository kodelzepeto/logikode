import {
  GlossaryTerm,
  GlossaryCategory,
  GLOSSARY_TERMS,
} from "@/data/glossary";

/**
 * Menyaring istilah kamus koding berdasarkan kata kunci pencarian dan kategori terpilih secara murni.
 * Mendukung pencarian instan pada istilah Indonesia, istilah Inggris, definisi, analogi, maupun kategori.
 */
export function filterGlossaryTerms(
  terms: GlossaryTerm[] = GLOSSARY_TERMS,
  searchQuery: string = "",
  selectedCategory: GlossaryCategory = "Semua"
): GlossaryTerm[] {
  const cleanQuery = searchQuery.trim().toLowerCase();

  return terms.filter((item) => {
    // 1. Filter Kategori
    if (selectedCategory !== "Semua" && item.category !== selectedCategory) {
      return false;
    }

    // 2. Filter Kata Kunci Pencarian
    if (!cleanQuery) {
      return true;
    }

    const matchTerm = item.term.toLowerCase().includes(cleanQuery);
    const matchEnglish = item.englishTerm.toLowerCase().includes(cleanQuery);
    const matchCategory = item.category.toLowerCase().includes(cleanQuery);
    const matchDefinition = item.definition.toLowerCase().includes(cleanQuery);
    const matchAnalogi = item.analogi.toLowerCase().includes(cleanQuery);
    const matchRelated = item.relatedTerms?.some((rel) =>
      rel.toLowerCase().includes(cleanQuery)
    );

    return (
      matchTerm ||
      matchEnglish ||
      matchCategory ||
      matchDefinition ||
      matchAnalogi ||
      Boolean(matchRelated)
    );
  });
}

/**
 * Menghitung ringkasan statistik kamus koding (total istilah dan jumlah per kategori).
 */
export function getGlossaryStats(terms: GlossaryTerm[] = GLOSSARY_TERMS): {
  totalTerms: number;
  categoryCounts: Record<string, number>;
} {
  const counts: Record<string, number> = {
    Semua: terms.length,
  };

  for (const item of terms) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }

  return {
    totalTerms: terms.length,
    categoryCounts: counts,
  };
}
