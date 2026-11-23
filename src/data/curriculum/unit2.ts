import { Unit } from "@/types/curriculum";

export const unit2: Unit = {
  id: "unit-2",
  title: "Unit 2: Percabangan (If, Else, & Logika Boolean)",
  description:
    "Pelajari cara komputer membuat keputusan cerdas menggunakan struktur kondisi if, else, dan logika boolean.",
  levels: [
    {
      id: "level-2-1",
      title: "Percabangan Dasar (If & Else)",
      description: "Mengarahkan alur program berdasarkan syarat kondisi benar atau salah.",
      xpReward: 50,
      questions: [
        {
          id: "u2-l1-q1",
          type: "multiple_choice",
          prompt: "Kapan blok kode di dalam `else` akan dijalankan?",
          options: [
            "Setiap saat program berjalan",
            "Hanya ketika kondisi pada `if` bernilai false",
            "Hanya ketika kondisi pada `if` bernilai true",
            "Saat terjadi error pada program",
          ],
          correctIndex: 1,
          explanation:
            "Blok `else` bertindak sebagai jalur alternatif: hanya dieksekusi jika kondisi utama pada `if` tidak terpenuhi (`false`).",
        },
        {
          id: "u2-l1-q2",
          type: "fill_blank",
          prompt: "Lengkapi kata kunci kondisi untuk mengecek apakah nilai ujian di atas 75!",
          codeTemplate: "___ (nilaiUjian > 75) {\n  console.log(\"Lulus!\");\n}",
          options: ["else", "if", "loop", "switch"],
          correctAnswer: "if",
          explanation:
            "Kata kunci `if` digunakan untuk memulai percabangan kondisi diikuti tanda kurung `(...)` berisi ekspresi logika.",
        },
        {
          id: "u2-l1-q3",
          type: "code_order",
          prompt: "Susun struktur blok if-else yang benar untuk menentukan kelulusan!",
          blocks: [
            "} else {",
            "if (skor >= 70) {",
            "  console.log(\"Silakan Coba Lagi\");",
            "  console.log(\"Selamat Kamu Lulus!\");",
            "}",
          ],
          correctOrder: [
            "if (skor >= 70) {",
            "  console.log(\"Selamat Kamu Lulus!\");",
            "} else {",
            "  console.log(\"Silakan Coba Lagi\");",
            "}",
          ],
          explanation:
            "Struktur diawali `if (kondisi) { ... }`, lalu dilanjutkan dengan cabang alternatif `else { ... }`.",
        },
        {
          id: "u2-l1-q4",
          type: "multiple_choice",
          prompt: "Apa yang akan dicetak oleh kode berikut jika `lampu = \"merah\"`?\n`if (lampu === \"hijau\") { jalan(); } else { berhenti(); }`",
          options: [
            "jalan()",
            "tidak terjadi apa-apa",
            "berhenti()",
            "keduanya dijalankan",
          ],
          correctIndex: 2,
          explanation:
            "Karena nilai `lampu` adalah \"merah\" (bukan \"hijau\"), maka kondisi `if` bernilai `false` dan fungsi pada cabang `else` yaitu `berhenti()` yang dijalankan.",
        },
        {
          id: "u2-l1-q5",
          type: "fill_blank",
          prompt: "Lengkapi kata kunci alternatif jika kondisi `if` tidak terpenuhi!",
          codeTemplate: "if (saldo >= 50000) {\n  beliTiket();\n} ___ {\n  isiSaldo();\n}",
          options: ["then", "else", "otherwise", "stop"],
          correctAnswer: "else",
          explanation:
            "Kata kunci `else` digunakan untuk menangani kondisi sebaliknya ketika syarat `if` bernilai `false`.",
        },
      ],
    },
    {
      id: "level-2-2",
      title: "Percabangan Bertingkat (Else If)",
      description: "Menangani lebih dari dua kemungkinan kondisi secara berurutan.",
      xpReward: 50,
      questions: [
        {
          id: "u2-l2-q1",
          type: "multiple_choice",
          prompt: "Apa kegunaan dari pernyataan `else if` dalam sebuah rantai logika?",
          options: [
            "Menghentikan seluruh program",
            "Mengulang perintah berkali-kali",
            "Menguji kondisi baru jika kondisi sebelumnya bernilai false",
            "Menghapus variabel di memori",
          ],
          correctIndex: 2,
          explanation:
            "`else if` memungkinkan kita menguji serangkaian kondisi secara berurutan. Komputer akan memeriksa satu per satu hingga menemukan yang bernilai `true`.",
        },
        {
          id: "u2-l2-q2",
          type: "fill_blank",
          prompt: "Lengkapi kode percabangan bertingkat untuk nilai kategori B!",
          codeTemplate: "if (skor >= 90) {\n  grade = \"A\";\n} ___ (skor >= 80) {\n  grade = \"B\";\n}",
          options: ["else", "if not", "else if", "switch"],
          correctAnswer: "else if",
          explanation:
            "`else if` digunakan untuk menambahkan syarat kondisi kedua jika syarat pertama belum terpenuhi.",
        },
        {
          id: "u2-l2-q3",
          type: "code_order",
          prompt: "Susun alur penentuan kategori usia (Anak, Remaja, Dewasa) yang rapi!",
          blocks: [
            "else if (usia < 18) { kategori = \"Remaja\"; }",
            "else { kategori = \"Dewasa\"; }",
            "if (usia < 12) { kategori = \"Anak\"; }",
          ],
          correctOrder: [
            "if (usia < 12) { kategori = \"Anak\"; }",
            "else if (usia < 18) { kategori = \"Remaja\"; }",
            "else { kategori = \"Dewasa\"; }",
          ],
          explanation:
            "Pemeriksaan dimulai dari usia paling muda (`< 12`), dilanjutkan rentang berikutnya (`< 18`), dan sisanya ditangkap oleh blok default `else`.",
        },
        {
          id: "u2-l2-q4",
          type: "multiple_choice",
          prompt: "Jika ada 3 cabang `else if` dan cabang pertama bernilai `true`, apakah cabang berikutnya tetap diperiksa?",
          options: [
            "Ya, semua cabang akan selalu diperiksa tanpa terkecuali",
            "Tidak, setelah menemukan cabang true pertama, sisa rantai percabangan akan dilewati",
            "Program akan langsung crash",
            "Semua blok akan dieksekusi bersamaan",
          ],
          correctIndex: 1,
          explanation:
            "Dalam struktur `if-else if-else`, begitu sebuah kondisi terpenuhi (`true`), blok kodenya dieksekusi dan rantai sisanya langsung dilewati (*short-circuit*).",
        },
        {
          id: "u2-l2-q5",
          type: "fill_blank",
          prompt: "Pilih kondisi untuk menangani sisa semua kemungkinan di akhir!",
          codeTemplate: "if (opsi === 1) {\n  mulaiGame();\n} else if (opsi === 2) {\n  bukaPengaturan();\n} ___ {\n  keluar();\n}",
          options: ["else if", "default", "else", "finally"],
          correctAnswer: "else",
          explanation:
            "Blok `else` tanpa parameter kondisi diletakkan di akhir sebagai penampung semua input lain yang tidak cocok dengan kondisi sebelumnya.",
        },
      ],
    },
    {
      id: "level-2-3",
      title: "Logika Boolean & Kondisi Gabungan",
      description: "Menggabungkan beberapa syarat menggunakan operator AND (&&), OR (||), dan NOT (!).",
      xpReward: 50,
      questions: [
        {
          id: "u2-l3-q1",
          type: "multiple_choice",
          prompt: "Simbol operator logika apa yang digunakan untuk menyatakan 'ATAU' (OR) di JavaScript?",
          options: ["&&", "!", "||", "OR"],
          correctIndex: 2,
          explanation:
            "Operator `||` melambangkan OR (atau). Menghasilkan `true` jika minimal satu dari kedua syarat bernilai `true`.",
        },
        {
          id: "u2-l3-q2",
          type: "fill_blank",
          prompt: "Lengkapi operator logika agar pengguna bisa masuk jika punya tiket ATAU kartu VIP!",
          codeTemplate: "let bolehMasuk = punyaTiket ___ punyaKartuVIP;",
          options: ["&&", "==", "||", "!="],
          correctAnswer: "||",
          explanation:
            "Gunakan operator `||` (OR) karena cukup memiliki salah satu (tiket atau kartu VIP) untuk diperbolehkan masuk.",
        },
        {
          id: "u2-l3-q3",
          type: "code_order",
          prompt: "Susun validasi login: email tidak boleh kosong DAN password minimal 8 karakter!",
          blocks: [
            "if (isEmailValid && isPassValid) { izinkanLogin(); }",
            "let isEmailValid = email.length > 0;",
            "let isPassValid = password.length >= 8;",
          ],
          correctOrder: [
            "let isEmailValid = email.length > 0;",
            "let isPassValid = password.length >= 8;",
            "if (isEmailValid && isPassValid) { izinkanLogin(); }",
          ],
          explanation:
            "Hitung masing-masing validasi terlebih dahulu, kemudian gabungkan keduanya dengan operator `&&` (DAN).",
        },
        {
          id: "u2-l3-q4",
          type: "multiple_choice",
          prompt: "Apa fungsi dari operator NOT yang dilambangkan dengan tanda seru `!`?",
          options: [
            "Menghapus nilai variabel",
            "Menghubungkan dua string",
            "Menduplikasi nilai variabel",
            "Membalik nilai boolean: true menjadi false, dan false menjadi true",
          ],
          correctIndex: 3,
          explanation:
            "Operator `!` (NOT / negasi) membalikkan kebenaran logika. Contoh: `!true` menghasilkan `false`, sedangkan `!false` menghasilkan `true`.",
        },
        {
          id: "u2-l3-q5",
          type: "fill_blank",
          prompt: "Lengkapi operator untuk memeriksa apakah toko sedang TIDAK buka!",
          codeTemplate: "let tokoTutup = ___isBuka;",
          options: ["&&", "!", "||", "??"],
          correctAnswer: "!",
          explanation:
            "Dengan menambahkan operator negasi `!` di depan `isBuka`, jika `isBuka` adalah `false`, maka `!isBuka` menghasilkan `true` (toko tutup).",
        },
      ],
    },
  ],
};
