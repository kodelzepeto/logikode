import { describe, it, expect } from "vitest";
import {
  GLOSSARY_TERMS,
  GLOSSARY_CATEGORIES,
} from "@/data/glossary";
import { filterGlossaryTerms, getGlossaryStats } from "../glossary";

describe("Mini Coding Glossary — Data & Search Logic", () => {
  it("dataset kamus koding harus memiliki minimal 20 istilah berkualitas dan ID yang unik", () => {
    expect(GLOSSARY_TERMS.length).toBeGreaterThanOrEqual(20);
    expect(GLOSSARY_CATEGORIES.length).toBeGreaterThanOrEqual(5);

    const ids = GLOSSARY_TERMS.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    for (const term of GLOSSARY_TERMS) {
      expect(term.id.trim()).not.toBe("");
      expect(term.term.trim()).not.toBe("");
      expect(term.englishTerm.trim()).not.toBe("");
      expect(term.definition.trim()).not.toBe("");
      expect(term.analogi.trim()).not.toBe("");
      expect(term.category.trim()).not.toBe("");
    }
  });

  it("harus mengembalikan seluruh istilah jika kata kunci kosong dan kategori 'Semua'", () => {
    const results = filterGlossaryTerms(GLOSSARY_TERMS, "", "Semua");
    expect(results.length).toBe(GLOSSARY_TERMS.length);
  });

  it("harus menyaring istilah berdasarkan kategori terpilih secara akurat", () => {
    const dasarLogika = filterGlossaryTerms(
      GLOSSARY_TERMS,
      "",
      "Dasar Logika"
    );
    expect(dasarLogika.length).toBeGreaterThan(0);
    expect(dasarLogika.every((t) => t.category === "Dasar Logika")).toBe(true);

    const databaseTerms = filterGlossaryTerms(
      GLOSSARY_TERMS,
      "",
      "Database & SQL"
    );
    expect(databaseTerms.length).toBeGreaterThan(0);
    expect(databaseTerms.every((t) => t.category === "Database & SQL")).toBe(
      true
    );
  });

  it("harus melakukan pencarian case-insensitive berdasarkan istilah bahasa Indonesia", () => {
    const results = filterGlossaryTerms(GLOSSARY_TERMS, "vArIaBeL", "Semua");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((t) => t.term.toLowerCase().includes("variabel"))).toBe(
      true
    );
  });

  it("harus melakukan pencarian berdasarkan istilah bahasa Inggris", () => {
    const results = filterGlossaryTerms(GLOSSARY_TERMS, "boolean", "Semua");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((t) => t.englishTerm.toLowerCase().includes("boolean"))).toBe(
      true
    );
  });

  it("harus menemukan istilah melalui teks analogi atau definisi", () => {
    const resultsAnalogi = filterGlossaryTerms(
      GLOSSARY_TERMS,
      "sakelar",
      "Semua"
    );
    expect(resultsAnalogi.length).toBeGreaterThan(0);
    expect(resultsAnalogi[0].id).toBe("boolean");
  });

  it("harus menggabungkan filter kategori dan kata kunci pencarian", () => {
    // Cari "SQL" di kategori "Database & SQL" -> harus ketemu
    const matchCat = filterGlossaryTerms(
      GLOSSARY_TERMS,
      "sql",
      "Database & SQL"
    );
    expect(matchCat.length).toBeGreaterThan(0);

    // Cari "SQL" di kategori "Kontrol Alur" -> tidak boleh ketemu
    const noMatchCat = filterGlossaryTerms(
      GLOSSARY_TERMS,
      "sql",
      "Kontrol Alur"
    );
    expect(noMatchCat.length).toBe(0);
  });

  it("harus mengembalikan array kosong jika istilah tidak ditemukan", () => {
    const results = filterGlossaryTerms(
      GLOSSARY_TERMS,
      "istilah_yang_pasti_tidak_ada_xyz_999",
      "Semua"
    );
    expect(results).toEqual([]);
  });

  it("harus menghitung ringkasan statistik dan jumlah kategori dengan benar", () => {
    const stats = getGlossaryStats(GLOSSARY_TERMS);

    expect(stats.totalTerms).toBe(GLOSSARY_TERMS.length);
    expect(stats.categoryCounts["Semua"]).toBe(GLOSSARY_TERMS.length);
    expect(stats.categoryCounts["Dasar Logika"]).toBeGreaterThan(0);
    expect(stats.categoryCounts["Kontrol Alur"]).toBeGreaterThan(0);
  });
});
