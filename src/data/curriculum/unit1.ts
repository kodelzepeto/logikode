import { Unit } from "@/types/curriculum";

export const unit1: Unit = {
  id: "unit-1",
  title: "Unit 1: Logika Dasar & Variabel",
  description:
    "Pahami konsep variabel sebagai wadah data, macam-macam tipe data, dan cara menggunakan operator logika dasar.",
  levels: [
    {
      id: "level-1-1",
      title: "Mengenal Variabel",
      description: "Memahami apa itu variabel dan bagaimana data disimpan di memori komputer.",
      xpReward: 50,
      questions: [
        {
          id: "u1-l1-q1",
          type: "multiple_choice",
          prompt: "Apa analogi yang paling tepat untuk menggambarkan variabel dalam pemrograman?",
          options: [
            "Layar monitor untuk menampilkan gambar",
            "Sebuah kotak penyimpanan berlabel untuk menaruh suatu nilai",
            "Kabel listrik pengalir daya",
            "Tombol power komputer",
          ],
          correctIndex: 1,
          explanation:
            "Variabel bekerja seperti kotak penyimpanan berlabel. Nama variabel adalah labelnya, dan isinya adalah data/nilai yang disimpan di memori.",
        },
        {
          id: "u1-l1-q2",
          type: "fill_blank",
          prompt: "Lengkapi potongan kode berikut untuk membuat variabel bernama `namaPengguna`!",
          codeTemplate: "let ___ = \"Amin\";",
          options: ["123", "==", "namaPengguna", "+="],
          correctAnswer: "namaPengguna",
          explanation:
            "Kata kunci `let` diikuti oleh nama variabel yang kita buat, misalnya `namaPengguna`, lalu tanda `=` memberikan nilai awalnya.",
        },
        {
          id: "u1-l1-q3",
          type: "code_order",
          prompt: "Susun baris kode berikut dengan urutan yang benar untuk mencetak salam!",
          blocks: [
            "console.log(sapaan);",
            "let nama = \"Budi\";",
            "let sapaan = \"Halo \" + nama;",
          ],
          correctOrder: [
            "let nama = \"Budi\";",
            "let sapaan = \"Halo \" + nama;",
            "console.log(sapaan);",
          ],
          explanation:
            "Variabel `nama` harus dibuat terlebih dahulu sebelum bisa digabungkan ke dalam `sapaan`, lalu ditampilkan dengan `console.log`.",
        },
        {
          id: "u1-l1-q4",
          type: "multiple_choice",
          prompt: "Manakah gaya penamaan variabel yang baik dan mudah dibaca menurut konvensi camelCase?",
          options: [
            "TOTALSKORPEMAIN",
            "1_skor_total",
            "totalSkorPemain",
            "tot-skor-pemain",
          ],
          correctIndex: 2,
          explanation:
            "`totalSkorPemain` menggunakan gaya camelCase yang umum di JavaScript: huruf pertama kecil, kata selanjutnya diawali huruf besar, serta tidak diawali angka.",
        },
        {
          id: "u1-l1-q5",
          type: "fill_blank",
          prompt: "Ubah nilai variabel `skor` dari 10 menjadi 20!",
          codeTemplate: "let skor = 10;\nskor = ___;",
          options: ["let 20", "\"sepuluh\"", "20", "=="],
          correctAnswer: "20",
          explanation:
            "Untuk memperbarui nilai variabel yang sudah ada, kita tidak perlu menulis kata kunci `let` lagi, cukup panggil nama variabel dan beri nilai baru `20`.",
        },
      ],
    },
    {
      id: "level-1-2",
      title: "Tipe Data Fundamental",
      description: "Membedakan teks (String), angka (Number), dan nilai benar/salah (Boolean).",
      xpReward: 50,
      questions: [
        {
          id: "u1-l2-q1",
          type: "multiple_choice",
          prompt: "Tipe data apa yang digunakan untuk menyatakan kondisi Benar (`true`) atau Salah (`false`)?",
          options: ["String", "Number", "Array", "Boolean"],
          correctIndex: 3,
          explanation:
            "Tipe data Boolean hanya memiliki dua kemungkinan nilai: `true` (benar) atau `false` (salah). Sangat krusial untuk logika pengambilan keputusan.",
        },
        {
          id: "u1-l2-q2",
          type: "fill_blank",
          prompt: "Tentukan tipe data teks (String) yang tepat dengan tanda petik!",
          codeTemplate: "let bahasa = ___;",
          options: ["Indonesia", "true", "\"Indonesia\"", "123"],
          correctAnswer: "\"Indonesia\"",
          explanation:
            "Data bertipe String (teks) wajib diapit tanda petik, misalnya `\"Indonesia\"` atau `'Indonesia'` agar komputer memahaminya sebagai teks.",
        },
        {
          id: "u1-l2-q3",
          type: "code_order",
          prompt: "Urutkan deklarasi tipe data berikut: String, Number, dan Boolean!",
          blocks: [
            "let level = 1;",
            "let isAktif = true;",
            "let judul = \"LogiKode\";",
          ],
          correctOrder: [
            "let judul = \"LogiKode\";",
            "let level = 1;",
            "let isAktif = true;",
          ],
          explanation:
            "Ketiga baris mendeklarasikan String (`\"LogiKode\"`), Number (`1`), dan Boolean (`true`) secara teratur dan bersih.",
        },
        {
          id: "u1-l2-q4",
          type: "multiple_choice",
          prompt: "Jika kamu menjalankan operasi `typeof 42`, apa tipe data yang dihasilkan?",
          options: ["string", "number", "boolean", "undefined"],
          correctIndex: 1,
          explanation:
            "Angka bulat maupun desimal seperti 42 atau 3.14 memiliki tipe data dasar `number`.",
        },
        {
          id: "u1-l2-q5",
          type: "fill_blank",
          prompt: "Lengkapi kode agar variabel `isLoggedIn` menandakan pengguna telah login!",
          codeTemplate: "let isLoggedIn = ___;",
          options: ["\"true\"", "1", "yes", "true"],
          correctAnswer: "true",
          explanation:
            "Nilai boolean literal adalah kata kunci `true` tanpa tanda petik. Tanda petik `\"true\"` akan membuatnya menjadi teks (String).",
        },
      ],
    },
    {
      id: "level-1-3",
      title: "Operator & Perhitungan Logika",
      description: "Melakukan operasi aritmatika dan membandingkan dua nilai.",
      xpReward: 50,
      questions: [
        {
          id: "u1-l3-q1",
          type: "multiple_choice",
          prompt: "Operator apa yang digunakan untuk mencari sisa hasil pembagian (Modulus)?",
          options: ["/", "//", "%", "mod"],
          correctIndex: 2,
          explanation:
            "Operator `%` (Modulus) menghasilkan sisa dari pembagian bilangan. Contoh: `7 % 3` menghasilkan `1` karena 7 dibagi 3 adalah 2 bersisa 1.",
        },
        {
          id: "u1-l3-q2",
          type: "fill_blank",
          prompt: "Lengkapi operator untuk mengecek apakah `umur` lebih besar atau sama dengan 17!",
          codeTemplate: "let bolehPunyaKTP = umur ___ 17;",
          options: ["<=", ">=", "==", "!="],
          correctAnswer: ">=",
          explanation:
            "Operator `>=` berarti lebih dari atau sama dengan. Jika umur 17 atau lebih, hasilnya bernilai `true`.",
        },
        {
          id: "u1-l3-q3",
          type: "code_order",
          prompt: "Susun langkah menghitung harga akhir setelah diskon!",
          blocks: [
            "let hargaBayar = hargaAsli - diskon;",
            "let diskon = 20000;",
            "let hargaAsli = 100000;",
          ],
          correctOrder: [
            "let hargaAsli = 100000;",
            "let diskon = 20000;",
            "let hargaBayar = hargaAsli - diskon;",
          ],
          explanation:
            "Tentukan harga awal dan nilai diskon terlebih dahulu sebelum mengurangkannya untuk mendapatkan harga bayar.",
        },
        {
          id: "u1-l3-q4",
          type: "multiple_choice",
          prompt: "Apa hasil evaluasi logika dari ekspresi `(10 > 5) && (3 > 7)`?",
          options: ["true", "false", "undefined", "10"],
          correctIndex: 1,
          explanation:
            "Operator `&&` (DAN) memerlukan kedua sisi bernilai `true`. Karena `(3 > 7)` bernilai `false`, maka seluruh ekspresi bernilai `false`.",
        },
        {
          id: "u1-l3-q5",
          type: "fill_blank",
          prompt: "Lengkapi operator untuk memeriksa apakah nilai `a` TIDAK sama dengan `b`!",
          codeTemplate: "let isBerbeda = (a ___ b);",
          options: ["==", "!=", "=", "><"],
          correctAnswer: "!=",
          explanation:
            "Operator `!=` atau `!==` digunakan untuk memeriksa ketidaksamaan. Menghasilkan `true` jika kedua nilai berbeda.",
        },
      ],
    },
  ],
};
