import { Unit } from "@/types/curriculum";

export const unit4: Unit = {
  id: "unit-4",
  title: "Unit 4: Dasar SQL & Database (SELECT, WHERE, INSERT)",
  description:
    "Pelajari bahasa query SQL untuk berinteraksi dengan database relasional: mengambil data, memfilter kondisi, dan manipulasi data.",
  levels: [
    {
      id: "level-4-1",
      title: "Mengenal Database & Query SELECT",
      description: "Memahami struktur tabel database dan mengambil data menggunakan perintah SELECT.",
      xpReward: 50,
      questions: [
        {
          id: "u4-l1-q1",
          type: "multiple_choice",
          prompt: "Apa kepanjangan dari SQL dan fungsi utamanya dalam pengembangan perangkat lunak?",
          options: [
            "Simple Quick Link — protokol transfer kabel internet",
            "System Quality Logic — software pengujian hardware komputer",
            "Structured Query Language — bahasa standar untuk mengelola data pada database relasional",
            "Standard Query Loop — pustaka grafis animasi 3D",
          ],
          correctIndex: 2,
          explanation:
            "SQL (Structured Query Language) digunakan di berbagai database populer seperti PostgreSQL, MySQL, dan SQLite untuk query dan manipulasi data.",
        },
        {
          id: "u4-l1-q2",
          type: "fill_blank",
          prompt: "Lengkapi kata kunci perintah untuk mengambil seluruh data dari tabel `siswa`!",
          codeTemplate: "___ * FROM siswa;",
          options: ["GET", "SELECT", "FETCH", "SHOW"],
          correctAnswer: "SELECT",
          explanation:
            "Perintah `SELECT` adalah perintah dasar SQL yang wajib digunakan saat kita ingin membaca atau mengambil data dari suatu tabel.",
        },
        {
          id: "u4-l1-q3",
          type: "code_order",
          prompt: "Susun baris query SQL yang benar untuk mengambil kolom nama dan email dari tabel `pengguna`!",
          blocks: [
            "FROM pengguna;",
            "SELECT nama, email",
          ],
          correctOrder: [
            "SELECT nama, email",
            "FROM pengguna;",
          ],
          explanation:
            "Klausa `SELECT` menyebutkan nama-nama kolom yang diinginkan, kemudian diikuti oleh klausa `FROM` yang menunjuk tabel asal data.",
        },
        {
          id: "u4-l1-q4",
          type: "multiple_choice",
          prompt: "Apa fungsi dari simbol tanda bintang (`*`) pada query `SELECT * FROM produk;`?",
          options: [
            "Mengalikan seluruh harga produk dengan angka 2",
            "Mengambil semua kolom yang tersedia di dalam tabel tersebut",
            "Menghapus tabel produk secara permanen",
            "Membuat cadangan data di komputer lokal",
          ],
          correctIndex: 1,
          explanation:
            "Tanda bintang (`*`) bertindak sebagai wildcard yang mewakili seluruh kolom yang ada pada skema tabel.",
        },
        {
          id: "u4-l1-q5",
          type: "fill_blank",
          prompt: "Lengkapi kata kunci agar hasil query diurutkan dari skor terbesar ke terkecil (menurun)!",
          codeTemplate: "SELECT * FROM nilai ORDER BY skor ___ ;",
          options: ["ASC", "TOP", "DESC", "DOWN"],
          correctAnswer: "DESC",
          explanation:
            "`DESC` (Descending) mengurutkan data dari nilai tertinggi ke terendah, sedangkan `ASC` (Ascending) dari terkecil ke terbesar.",
        },
      ],
    },
    {
      id: "level-4-2",
      title: "Menyaring Data dengan WHERE",
      description: "Memfilter baris data yang relevan menggunakan kondisi logika dan operator pembanding.",
      xpReward: 50,
      questions: [
        {
          id: "u4-l2-q1",
          type: "multiple_choice",
          prompt: "Klausa apa yang digunakan dalam SQL untuk menyaring baris data berdasarkan kriteria tertentu?",
          options: [
            "FILTER",
            "IF",
            "CHECK",
            "WHERE",
          ],
          correctIndex: 3,
          explanation:
            "Klausa `WHERE` mengevaluasi setiap baris data dan hanya mengembalikan baris yang memenuhi ekspresi logika yang ditentukan.",
        },
        {
          id: "u4-l2-q2",
          type: "fill_blank",
          prompt: "Lengkapi operator pembanding untuk mencari siswa yang berumur 17 tahun ke atas!",
          codeTemplate: "SELECT * FROM siswa WHERE umur ___ 17;",
          options: ["==", ">=", "=>", "<>"],
          correctAnswer: ">=",
          explanation:
            "Operator `>=` (lebih besar sama dengan) memastikan batas minimal umur 17 tahun ikut terpilih dalam hasil query.",
        },
        {
          id: "u4-l2-q3",
          type: "code_order",
          prompt: "Susun query SQL untuk mencari siswa jurusan 'RPL' dengan nilai di atas 85!",
          blocks: [
            "WHERE jurusan = 'RPL'",
            "SELECT nama, nilai",
            "AND nilai > 85;",
            "FROM siswa",
          ],
          correctOrder: [
            "SELECT nama, nilai",
            "FROM siswa",
            "WHERE jurusan = 'RPL'",
            "AND nilai > 85;",
          ],
          explanation:
            "Klausa `WHERE` menyaring `jurusan = 'RPL'` dan operator `AND` menggabungkan syarat tambahan `nilai > 85`.",
        },
        {
          id: "u4-l2-q4",
          type: "multiple_choice",
          prompt: "Kapan kita menggunakan operator `OR` di dalam klausa WHERE?",
          options: [
            "Saat kita ingin baris terpilih jika SALAH SATU kondisi terpenuhi",
            "Saat kita ingin menghapus seluruh data tabel",
            "Saat semua kondisi wajib bernilai benar secara serentak",
            "Saat ingin mengurutkan data secara acak",
          ],
          correctIndex: 0,
          explanation:
            "Operator `OR` mengembalikan nilai TRUE jika minimal ada satu kondisi yang terpenuhi di antara pilihan yang diberikan.",
        },
        {
          id: "u4-l2-q5",
          type: "fill_blank",
          prompt: "Lengkapi karakter wildcard untuk mencari produk yang berawalan kata 'Kopi'!",
          codeTemplate: "SELECT * FROM produk WHERE nama LIKE 'Kopi___';",
          options: ["*", "?", "%", "#"],
          correctAnswer: "%",
          explanation:
            "Dalam operator `LIKE` SQL, simbol `%` mewakili nol atau lebih karakter apa pun, sehingga `'Kopi%'` mencocokkan 'Kopi Susu', 'Kopi Hitam', dst.",
        },
      ],
    },
    {
      id: "level-4-3",
      title: "Menambah & Mengubah Data",
      description: "Memanipulasi data dengan perintah INSERT INTO dan UPDATE secara aman.",
      xpReward: 50,
      questions: [
        {
          id: "u4-l3-q1",
          type: "multiple_choice",
          prompt: "Perintah SQL apa yang digunakan untuk menambahkan baris data baru ke dalam sebuah tabel?",
          options: [
            "ADD ROW",
            "INSERT INTO",
            "NEW RECORD",
            "PUT DATA",
          ],
          correctIndex: 1,
          explanation:
            "Sintaks standar SQL untuk menyimpan baris data baru adalah `INSERT INTO nama_tabel (kolom) VALUES (nilai);`.",
        },
        {
          id: "u4-l3-q2",
          type: "fill_blank",
          prompt: "Lengkapi kata kunci penampung nilai pada perintah penambahan data!",
          codeTemplate: "INSERT INTO pengguna (nama, role)\n___ ('Budi', 'siswa');",
          options: ["DATA", "SET", "VALUES", "ITEMS"],
          correctAnswer: "VALUES",
          explanation:
            "Kata kunci `VALUES` menampung tuple nilai yang akan dipetakan sesuai urutan kolom yang didefinisikan sebelumnya.",
        },
        {
          id: "u4-l3-q3",
          type: "code_order",
          prompt: "Susun perintah penambahan data baru ke tabel produk!",
          blocks: [
            "VALUES ('Buku Koding', 45000);",
            "INSERT INTO produk (nama, harga)",
          ],
          correctOrder: [
            "INSERT INTO produk (nama, harga)",
            "VALUES ('Buku Koding', 45000);",
          ],
          explanation:
            "Baris pertama menentukan tabel target dan kolom-kolomnya, diikuti baris `VALUES` yang memberikan nilai spesifiknya.",
        },
        {
          id: "u4-l3-q4",
          type: "multiple_choice",
          prompt: "Mengapa sangat krusial menyertakan klausa WHERE saat mengeksekusi perintah UPDATE atau DELETE?",
          codeSnippet: "UPDATE siswa SET status = 'Lulus'; -- Tanpa WHERE!",
          options: [
            "Karena query akan otomatis ditolak oleh compiler",
            "Karena database akan otomatis terkunci selama 24 jam",
            "Karena tanpa WHERE, perubahan akan menimpa SELURUH baris data yang ada di tabel!",
            "Karena data akan digandakan menjadi 2 kali lipat",
          ],
          correctIndex: 2,
          explanation:
            "Tanpa `WHERE`, perintah `UPDATE` atau `DELETE` akan berdampak pada 100% baris di tabel, yang berpotensi menyebabkan bencana kehilangan/kerusakan data.",
        },
        {
          id: "u4-l3-q5",
          type: "code_order",
          prompt: "Susun query UPDATE yang aman dengan klausa WHERE untuk memperbarui harga produk id 10!",
          blocks: [
            "WHERE id = 10;",
            "UPDATE produk",
            "SET harga = 50000",
          ],
          correctOrder: [
            "UPDATE produk",
            "SET harga = 50000",
            "WHERE id = 10;",
          ],
          explanation:
            "`UPDATE produk` menentukan tabel, `SET harga = 50000` mendefinisikan perubahan nilai, dan `WHERE id = 10` memastikan hanya 1 produk spesifik yang diperbarui.",
        },
      ],
    },
  ],
};
