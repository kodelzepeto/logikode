export type GlossaryCategory =
  | "Semua"
  | "Dasar Logika"
  | "Kontrol Alur"
  | "Struktur Data"
  | "Fungsi & Modularitas"
  | "Database & SQL"
  | "Debugging & Algoritma";

export interface GlossaryTerm {
  id: string;
  term: string;
  englishTerm: string;
  category: Exclude<GlossaryCategory, "Semua">;
  definition: string;
  analogi: string;
  exampleCode?: string;
  relatedTerms?: string[];
}

export const GLOSSARY_CATEGORIES: { id: GlossaryCategory; label: string; icon: string }[] = [
  { id: "Semua", label: "Semua", icon: "📚" },
  { id: "Dasar Logika", label: "Dasar Logika", icon: "🧠" },
  { id: "Kontrol Alur", label: "Kontrol Alur", icon: "🔀" },
  { id: "Struktur Data", label: "Struktur Data", icon: "📦" },
  { id: "Fungsi & Modularitas", label: "Fungsi", icon: "⚙️" },
  { id: "Database & SQL", label: "Database", icon: "🗄️" },
  { id: "Debugging & Algoritma", label: "Debugging", icon: "🔍" },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "variabel",
    term: "Variabel",
    englishTerm: "Variable",
    category: "Dasar Logika",
    definition:
      "Wadah bernama di dalam memori komputer untuk menyimpan nilai atau informasi yang nilainya dapat diubah sewaktu-waktu selama program berjalan.",
    analogi:
      "Seperti kotak kardus berlabel nama. Kamu bisa memasukkan barang ke dalamnya, mengganti isinya kapan saja, atau melihat isinya saat dibutuhkan.",
    exampleCode: `let skor = 100;\nskor = skor + 25; // nilai skor sekarang 125`,
    relatedTerms: ["Konstanta", "Tipe Data"],
  },
  {
    id: "konstanta",
    term: "Konstanta",
    englishTerm: "Constant",
    category: "Dasar Logika",
    definition:
      "Jenis variabel khusus yang nilainya bersifat tetap dan dikunci setelah pertama kali diinisialisasi, sehingga tidak dapat diubah lagi.",
    analogi:
      "Seperti tanggal lahir seseorang di akta kelahiran yang tidak pernah berubah seumur hidup.",
    exampleCode: `const PI = 3.14159;\nconst MAX_HEARTS = 5;`,
    relatedTerms: ["Variabel", "Tipe Data"],
  },
  {
    id: "tipe-data",
    term: "Tipe Data",
    englishTerm: "Data Type",
    category: "Dasar Logika",
    definition:
      "Klasifikasi jenis nilai yang memberi tahu komputer bagaimana cara menyimpan data tersebut dan operasi matematika atau logika apa saja yang sah dilakukan padanya.",
    analogi:
      "Perbedaan antara uang tunai (bisa dijumlahkan) dengan alamat surat (hanya dibaca teksnya).",
    exampleCode: `typeof 42;        // "number"\ntypeof "Halo";    // "string"\ntypeof true;      // "boolean"`,
    relatedTerms: ["String", "Integer", "Boolean"],
  },
  {
    id: "string",
    term: "String (Teks)",
    englishTerm: "String",
    category: "Dasar Logika",
    definition:
      "Tipe data yang menampung kumpulan karakter teks, huruf, angka, simbol, maupun spasi yang diapit oleh tanda kutip tunggal, ganda, atau backtick.",
    analogi:
      "Seperti deretan huruf pada gelang manik-manik yang membentuk kata atau kalimat utuh.",
    exampleCode: `let nama = "Budi Santoso";\nlet pesan = \`Selamat datang, \${nama}!\`;`,
    relatedTerms: ["Tipe Data", "Variabel"],
  },
  {
    id: "integer-float",
    term: "Integer & Float (Angka)",
    englishTerm: "Integer / Floating Point",
    category: "Dasar Logika",
    definition:
      "Tipe data numerik untuk perhitungan matematis. Integer berupa bilangan bulat tanpa koma, sedangkan Float berupa bilangan pecahan berkoma desimal.",
    analogi:
      "Jumlah siswa di kelas (pasti bulat, integer) vs suhu udara atau berat badan (bisa berkoma, float).",
    exampleCode: `let jumlahLevel = 12; // integer\nlet akurasi = 98.5;   // float`,
    relatedTerms: ["Tipe Data", "Operator"],
  },
  {
    id: "boolean",
    term: "Boolean",
    englishTerm: "Boolean",
    category: "Dasar Logika",
    definition:
      "Tipe data logika biner yang hanya memiliki dua kemungkinan nilai kebenaran: benar (true) atau salah (false).",
    analogi:
      "Seperti sakelar lampu kamar yang hanya memiliki dua posisi pasti: menyala (ON) atau mati (OFF).",
    exampleCode: `let punyaAkses = true;\nlet lulusUjian = nilai >= 75; // bernilai true atau false`,
    relatedTerms: ["Percabangan If-Else", "Operator Logika"],
  },
  {
    id: "operator-logika",
    term: "Operator Logika",
    englishTerm: "Logical Operators",
    category: "Dasar Logika",
    definition:
      "Simbol khusus untuk menggabungkan atau membalik kondisi logika. Meliputi AND (&&, keduanya harus benar), OR (||, salah satu benar), dan NOT (!, membalik nilai).",
    analogi:
      "Syarat masuk bioskop: harus punya tiket AND sudah berusia minimal 13 tahun.",
    exampleCode: `if (punyaTiket && usia >= 13) {\n  izinkanMasuk();\n}`,
    relatedTerms: ["Boolean", "Percabangan If-Else"],
  },
  {
    id: "if-else",
    term: "Percabangan If-Else",
    englishTerm: "Conditional Statement (If-Else)",
    category: "Kontrol Alur",
    definition:
      "Struktur kendali pengambilan keputusan yang menjalankan blok kode tertentu jika syarat terpenuhi (true), atau blok lain jika syarat tidak terpenuhi (false).",
    analogi:
      "Persimpangan lampu lalu lintas: jika lampu hijau jalan terus, jika lampu merah harus berhenti.",
    exampleCode: `if (skor >= 80) {\n  grade = "A";\n} else {\n  grade = "B";\n}`,
    relatedTerms: ["Boolean", "Switch-Case"],
  },
  {
    id: "switch-case",
    term: "Switch-Case",
    englishTerm: "Switch Statement",
    category: "Kontrol Alur",
    definition:
      "Bentuk percabangan alternatif yang lebih rapi daripada if-else bertingkat ketika membandingkan satu nilai terhadap banyak kemungkinan pilihan pasti.",
    analogi:
      "Panel tombol lift gedung: tombol lantai 1 pergi ke lantai 1, tombol lantai 2 pergi ke lantai 2.",
    exampleCode: `switch (opsi) {\n  case "1": mulai(); break;\n  case "2": keluar(); break;\n  default: console.log("Pilihan salah");\n}`,
    relatedTerms: ["Percabangan If-Else"],
  },
  {
    id: "while-loop",
    term: "Perulangan While",
    englishTerm: "While Loop",
    category: "Kontrol Alur",
    definition:
      "Struktur perulangan yang akan terus mengeksekusi blok kode selama syarat kondisi pengujian masih bernilai benar (true).",
    analogi:
      "Mengaduk adonan kue: terus aduk adonan selama gulanya masih belum larut sempurna.",
    exampleCode: `let baterai = 100;\nwhile (baterai > 0) {\n  gunakanAplikasi();\n  baterai -= 10;\n}`,
    relatedTerms: ["Perulangan For", "Infinite Loop"],
  },
  {
    id: "for-loop",
    term: "Perulangan For",
    englishTerm: "For Loop",
    category: "Kontrol Alur",
    definition:
      "Struktur perulangan terukur dengan hitungan batas pasti, memiliki inisialisasi counter, kondisi batas berhenti, dan langkah perubahan nilai.",
    analogi:
      "Melakukan push-up sebanyak tepat 10 kali putaran berturut-turut.",
    exampleCode: `for (let i = 1; i <= 5; i++) {\n  console.log("Langkah ke-" + i);\n}`,
    relatedTerms: ["Perulangan While", "Array"],
  },
  {
    id: "infinite-loop",
    term: "Perulangan Tak Hingga",
    englishTerm: "Infinite Loop",
    category: "Kontrol Alur",
    definition:
      "Kondisi error logika di mana perulangan tidak pernah menemukan kondisi berhenti (selalu true), menyebabkan program terkunci atau crash.",
    analogi:
      "Mobil yang terus berputar di bundaran jalan raya tanpa pernah mengambil jalur keluar.",
    exampleCode: `// ⚠️ Hati-hati: perulangan ini tidak pernah berhenti!\nwhile (true) {\n  // lupa menambahkan perintah break;\n}`,
    relatedTerms: ["Perulangan While", "Bug & Debugging"],
  },
  {
    id: "array",
    term: "Array (Larik)",
    englishTerm: "Array",
    category: "Struktur Data",
    definition:
      "Struktur data berurutan yang dapat menyimpan banyak elemen atau nilai di dalam satu variabel tunggal, diakses melalui nomor indeks.",
    analogi:
      "Rak sepatu bertingkat dengan kotak-kotak bernomor tempat menyimpan sepatu secara berurutan.",
    exampleCode: `const bahasa = ["JavaScript", "Python", "Dart"];\nconsole.log(bahasa[0]); // "JavaScript"`,
    relatedTerms: ["Indeks Array", "Panjang Array"],
  },
  {
    id: "indeks-array",
    term: "Indeks Array",
    englishTerm: "Array Index",
    category: "Struktur Data",
    definition:
      "Nomor penanda posisi letak suatu elemen di dalam array. Di hampir semua bahasa koding modern, penomoran indeks selalu dimulai dari angka 0 (Zero-Based Indexing).",
    analogi:
      "Lantai dasar sebuah mall yang dinamai Lantai 0 (Ground) sebelum kamu naik ke Lantai 1.",
    exampleCode: `const data = ["A", "B", "C"];\n// indeks 0 = "A", indeks 1 = "B", indeks 2 = "C"`,
    relatedTerms: ["Array", "Panjang Array"],
  },
  {
    id: "panjang-array",
    term: "Panjang Array (Length)",
    englishTerm: "Array Length",
    category: "Struktur Data",
    definition:
      "Properti atau fungsi yang mengembalikan total jumlah elemen yang sedang tersimpan di dalam suatu array.",
    analogi:
      "Menghitung berapa banyak penumpang yang sedang berada di dalam satu gerbong kereta.",
    exampleCode: `const item = ["Buku", "Pensil", "Penggaris"];\nconsole.log(item.length); // 3`,
    relatedTerms: ["Array", "Indeks Array"],
  },
  {
    id: "fungsi",
    term: "Fungsi (Function)",
    englishTerm: "Function",
    category: "Fungsi & Modularitas",
    definition:
      "Sekumpulan baris kode mandiri yang dikelompokkan dan diberi nama untuk menjalankan tugas tertentu, dapat digunakan kembali berkali-kali tanpa menulis ulang.",
    analogi:
      "Mesin jus otomatis: kamu masukkan buah segar, mesin memprosesnya, lalu mengalirkan jus siap minum.",
    exampleCode: `function hitungLuas(panjang, lebar) {\n  return panjang * lebar;\n}\nlet luas = hitungLuas(10, 5); // 50`,
    relatedTerms: ["Parameter & Argumen", "Nilai Kembalian (Return)"],
  },
  {
    id: "parameter-argumen",
    term: "Parameter & Argumen",
    englishTerm: "Parameter & Argument",
    category: "Fungsi & Modularitas",
    definition:
      "Parameter adalah variabel penampung input pada deklarasi fungsi. Argumen adalah nilai nyata yang dikirimkan saat fungsi tersebut dipanggil.",
    analogi:
      "Parameter adalah lubang koin pada celengan, sedangkan argumen adalah koin Rp 1.000 yang kamu masukkan ke dalamnya.",
    exampleCode: `function sapa(nama) { // 'nama' adalah parameter\n  console.log("Halo " + nama);\n}\nsapa("Rian"); // "Rian" adalah argumen`,
    relatedTerms: ["Fungsi (Function)", "Nilai Kembalian (Return)"],
  },
  {
    id: "return-value",
    term: "Nilai Kembalian (Return)",
    englishTerm: "Return Value",
    category: "Fungsi & Modularitas",
    definition:
      "Hasil akhir atau output yang dikirimkan kembali oleh suatu fungsi ke baris kode yang memanggilnya setelah proses komputasi selesai.",
    analogi:
      "Struk belanjaan dan uang kembalian yang diserahkan kasir kepadamu setelah kamu membayar barang.",
    exampleCode: `function kuadrat(x) {\n  return x * x;\n}\nlet hasil = kuadrat(4); // hasil berisi 16`,
    relatedTerms: ["Fungsi (Function)", "Parameter & Argumen"],
  },
  {
    id: "scope",
    term: "Scope (Lingkup Variabel)",
    englishTerm: "Variable Scope",
    category: "Fungsi & Modularitas",
    definition:
      "Batas wilayah di dalam kode program di mana suatu variabel dapat diakses atau dikenali (Global Scope vs Local / Block Scope).",
    analogi:
      "Aturan keluarga yang hanya berlaku di dalam rumah sendiri vs hukum negara yang berlaku di mana pun kamu berada.",
    exampleCode: `function uji() {\n  let rahasia = "12345";\n}\n// console.log(rahasia); // ❌ Error: tidak bisa diakses dari luar`,
    relatedTerms: ["Variabel", "Fungsi (Function)"],
  },
  {
    id: "sql",
    term: "SQL",
    englishTerm: "Structured Query Language",
    category: "Database & SQL",
    definition:
      "Bahasa standar komputer yang digunakan untuk berkomunikasi, meminta, menyaring, dan mengelola data di dalam sistem database relasional.",
    analogi:
      "Formulir permintaan di perpustakaan nasional untuk menemukan buku tertentu dari jutaan rak buku.",
    exampleCode: `SELECT nama, skor FROM pengguna\nWHERE skor > 80\nORDER BY skor DESC;`,
    relatedTerms: ["Database", "Primary Key"],
  },
  {
    id: "database",
    term: "Database (Basis Data)",
    englishTerm: "Database",
    category: "Database & SQL",
    definition:
      "Kumpulan data terstruktur yang disimpan secara elektronik di sistem komputer, memungkinkan pencarian dan manipulasi data berkecepatan tinggi.",
    analogi:
      "Lemari arsip digital raksasa dengan laci dan map berlabel rapi yang bisa dicari dalam hitungan milidetik.",
    exampleCode: `INSERT INTO siswa (nama, kelas)\nVALUES ('Adit', 'X-RPL');`,
    relatedTerms: ["SQL", "Primary Key"],
  },
  {
    id: "primary-key",
    term: "Primary Key (Kunci Utama)",
    englishTerm: "Primary Key",
    category: "Database & SQL",
    definition:
      "Kolom penanda khusus pada tabel database yang nilainya wajib unik untuk setiap baris data, memastikan tidak ada data ganda atau tertukar.",
    analogi:
      "Nomor Induk Kependudukan (NIK) pada KTP atau NISN siswa yang tidak mungkin sama antar dua orang berbeda.",
    exampleCode: `CREATE TABLE user (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  email VARCHAR(255) UNIQUE\n);`,
    relatedTerms: ["Database", "SQL"],
  },
  {
    id: "bug-debugging",
    term: "Bug & Debugging",
    englishTerm: "Bug & Debugging",
    category: "Debugging & Algoritma",
    definition:
      "Bug adalah cacat atau kesalahan pada baris kode yang menyebabkan program gagal atau memberi hasil salah. Debugging adalah seni menemukan dan memperbaiki bug tersebut.",
    analogi:
      "Menemukan dan membetulkan kabel kendor pada lampu hias yang menyebabkan salah satu lampu tidak menyala.",
    exampleCode: `console.log("Cek nilai sebelum loop:", nilai);\ndebugger; // titik henti penelusuran`,
    relatedTerms: ["Sintaks", "Algoritma"],
  },
  {
    id: "algoritma",
    term: "Algoritma",
    englishTerm: "Algorithm",
    category: "Debugging & Algoritma",
    definition:
      "Urutan langkah-langkah logis dan sistematis yang terdefinisi dengan jelas untuk menyelesaikan suatu masalah atau mencapai tujuan tertentu.",
    analogi:
      "Buku panduan langkah demi langkah merakit meja atau resep memasak nasi goreng lezat.",
    exampleCode: `// 1. Terima masukan -> 2. Olah nilai -> 3. Cetak hasil`,
    relatedTerms: ["Sintaks", "Bug & Debugging"],
  },
  {
    id: "sintaks",
    term: "Sintaks (Syntax)",
    englishTerm: "Syntax",
    category: "Debugging & Algoritma",
    definition:
      "Kumpulan aturan tata bahasa penulisan kode pada suatu bahasa pemrograman. Pelanggaran aturan ini menghasilkan Syntax Error dan program tidak akan berjalan.",
    analogi:
      "Aturan tanda baca pada bahasa: kalimat harus diawali huruf kapital dan diakhiri tanda titik.",
    exampleCode: `let x = 10; // ✅ Sintaks valid\n// let = 10 x; // ❌ SyntaxError: format penulisan terbalik`,
    relatedTerms: ["Bug & Debugging", "Algoritma"],
  },
];
