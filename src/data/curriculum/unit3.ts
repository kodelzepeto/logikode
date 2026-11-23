import { Unit } from "@/types/curriculum";

export const unit3: Unit = {
  id: "unit-3",
  title: "Unit 3: Perulangan (For, While, & Pola Loop)",
  description:
    "Pelajari cara mengotomasi tugas berulang dengan For loop, While loop, variabel akumulator, dan pencegahan infinite loop.",
  levels: [
    {
      id: "level-3-1",
      title: "Dasar Perulangan For",
      description: "Memahami struktur perulangan terhitung untuk menjalankan instruksi berulang kali.",
      xpReward: 50,
      questions: [
        {
          id: "u3-l1-q1",
          type: "multiple_choice",
          prompt: "Apa alasan utama mengapa kita membutuhkan perulangan (loop) dalam pemrograman?",
          options: [
            "Membuat ukuran file program menjadi lebih berat",
            "Menghindari menulis kode berulang secara manual (DRY - Don't Repeat Yourself)",
            "Menghapus variabel secara acak dari memori",
            "Mengubah warna teks di layar komputer",
          ],
          correctIndex: 1,
          explanation:
            "Perulangan memungkinkan komputer menjalankan sekumpulan instruksi berulang kali tanpa kita harus menyalin-tempel baris kode yang sama.",
        },
        {
          id: "u3-l1-q2",
          type: "fill_blank",
          prompt: "Lengkapi operator increment agar nilai `i` bertambah 1 di setiap putaran loop!",
          codeTemplate: "for (let i = 0; i < 5; i___) {\n  console.log(i);\n}",
          options: ["--", "++", "==", "**"],
          correctAnswer: "++",
          explanation:
            "Operator `i++` adalah singkatan dari `i = i + 1`, bertugas menambah nilai pencacah sebesar 1 di akhir setiap iterasi.",
        },
        {
          id: "u3-l1-q3",
          type: "code_order",
          prompt: "Susun baris kode berikut dengan urutan yang benar untuk mencetak angka 1 sampai 3!",
          blocks: [
            "  console.log(i);",
            "}",
            "for (let i = 1; i <= 3; i++) {",
          ],
          correctOrder: [
            "for (let i = 1; i <= 3; i++) {",
            "  console.log(i);",
            "}",
          ],
          explanation:
            "Header `for` mendeklarasikan inisialisasi `i = 1`, kondisi `i <= 3`, dan increment `i++`, diikuti isi perulangan yang diapit kurung kurawal.",
        },
        {
          id: "u3-l1-q4",
          type: "multiple_choice",
          prompt: "Berapa kali loop berikut akan dieksekusi?",
          codeSnippet: "for (let i = 0; i < 4; i++) {\n  console.log(\"Halo!\");\n}",
          options: ["3 kali", "5 kali", "Tak terhingga", "4 kali"],
          correctIndex: 3,
          explanation:
            "Loop berjalan saat `i = 0`, `i = 1`, `i = 2`, dan `i = 3` (total 4 kali). Saat `i = 4`, kondisi `4 < 4` bernilai false sehingga loop berhenti.",
        },
        {
          id: "u3-l1-q5",
          type: "fill_blank",
          prompt: "Lengkapi nilai awal `i` agar perulangan hanya mencetak angka genap positif mulai dari 2!",
          codeTemplate: "for (let i = ___; i <= 10; i += 2) {\n  console.log(i);\n}",
          options: ["1", "2", "0", "10"],
          correctAnswer: "2",
          explanation:
            "Memulai dari `i = 2` dengan step `i += 2` akan mencetak deret bilangan genap: 2, 4, 6, 8, 10.",
        },
      ],
    },
    {
      id: "level-3-2",
      title: "Perulangan While & Kondisi Berhenti",
      description: "Mengontrol perulangan berbasis kondisi dinamis dan mencegah terjadinya infinite loop.",
      xpReward: 50,
      questions: [
        {
          id: "u3-l2-q1",
          type: "multiple_choice",
          prompt: "Kapan situasi paling tepat untuk memilih perulangan `while` dibandingkan `for`?",
          options: [
            "Ketika kita ingin program berhenti secara mendadak",
            "Hanya saat program sedang offline",
            "Ketika jumlah putaran belum diketahui pasti dan bergantung pada kondisi eksternal",
            "Saat kita tidak ingin menggunakan variabel sama sekali",
          ],
          correctIndex: 2,
          explanation:
            "`while` sangat ideal untuk kondisi dinamis, misalnya menunggu respon jaringan atau selama nyawa pemain masih tersisa (`while (nyawa > 0)`).",
        },
        {
          id: "u3-l2-q2",
          type: "fill_blank",
          prompt: "Lengkapi nama fungsi aksi di dalam while loop selama baterai masih di atas 10%!",
          codeTemplate: "while (baterai > 10) {\n  ___();\n  baterai -= 5;\n}",
          options: ["10", "true", "jalankanMesin", "break"],
          correctAnswer: "jalankanMesin",
          explanation:
            "Fungsi `jalankanMesin()` akan terus dipanggil selama ekspresi logika `baterai > 10` bernilai true.",
        },
        {
          id: "u3-l2-q3",
          type: "code_order",
          prompt: "Susun logika hitung mundur (countdown) roket dari 3 sampai 1!",
          blocks: [
            "  console.log(detik);",
            "let detik = 3;",
            "}",
            "while (detik > 0) {",
            "  detik--;",
          ],
          correctOrder: [
            "let detik = 3;",
            "while (detik > 0) {",
            "  console.log(detik);",
            "  detik--;",
            "}",
          ],
          explanation:
            "Inisialisasi `detik = 3`, lalu selama `detik > 0` cetak angkanya, dan kurangi `detik--` agar loop akhirnya berhenti.",
        },
        {
          id: "u3-l2-q4",
          type: "multiple_choice",
          prompt: "Apa bahaya dari 'Infinite Loop' bagi browser atau komputer pengguna?",
          codeSnippet: "while (true) {\n  console.log(\"Jalan terus...\");\n}",
          options: [
            "Komputer akan langsung mati korsleting",
            "Aplikasi hang/freeze karena CPU terjebak memproses tanpa henti",
            "File kode terhapus secara otomatis",
            "Kecepatan internet menjadi 2 kali lebih cepat",
          ],
          correctIndex: 1,
          explanation:
            "Infinite loop menghabiskan alokasi thread pemrosesan CPU, menyebabkan tab browser tidak responsif hingga dipaksa tutup.",
        },
        {
          id: "u3-l2-q5",
          type: "fill_blank",
          prompt: "Kata kunci apa yang digunakan untuk menghentikan dan keluar dari loop seketika?",
          codeTemplate: "if (tombolStopDitekan) {\n  ___;\n}",
          options: ["continue", "return", "break", "exit"],
          correctAnswer: "break",
          explanation:
            "Kata kunci `break` langsung memutus aliran perulangan saat itu juga dan melompat ke baris kode setelah blok loop.",
        },
      ],
    },
    {
      id: "level-3-3",
      title: "Pola Loop & Akumulasi Data",
      description: "Memanfaatkan pola akumulator untuk menjumlahkan data dan menyaring informasi.",
      xpReward: 50,
      questions: [
        {
          id: "u3-l3-q1",
          type: "multiple_choice",
          prompt: "Apa yang dimaksud dengan variabel 'akumulator' dalam algoritma perulangan?",
          options: [
            "Alat pendingin mesin server komputer",
            "Tipe data khusus untuk menyimpan suara",
            "Variabel yang menampung dan menjumlahkan hasil perhitungan di setiap iterasi",
            "Tombol navigasi di browser",
          ],
          correctIndex: 2,
          explanation:
            "Akumulator diawali dengan nilai dasar (misal 0), lalu ditambahkan dengan nilai baru di tiap putaran loop (`total += nilai`).",
        },
        {
          id: "u3-l3-q2",
          type: "fill_blank",
          prompt: "Lengkapi operator untuk menambahkan harga belanjaan ke dalam akumulator `totalBelanja`!",
          codeTemplate: "totalBelanja ___ hargaBarang;",
          options: ["-=", "+=", "==", "*="],
          correctAnswer: "+=",
          explanation:
            "Operator `+=` menambahkan nilai operan kanan ke variabel di sisi kiri (`totalBelanja = totalBelanja + hargaBarang`).",
        },
        {
          id: "u3-l3-q3",
          type: "code_order",
          prompt: "Susun baris kode untuk menghitung total saldo dari array transaksi!",
          blocks: [
            "  total += item;",
            "console.log(total);",
            "let total = 0;",
            "}",
            "for (let item of [10, 20, 30]) {",
          ],
          correctOrder: [
            "let total = 0;",
            "for (let item of [10, 20, 30]) {",
            "  total += item;",
            "}",
            "console.log(total);",
          ],
          explanation:
            "Akumulator `total` diinisialisasi 0, lalu perulangan `for...of` menambahkan setiap angka, menghasilkan output 60.",
        },
        {
          id: "u3-l3-q4",
          type: "multiple_choice",
          prompt: "Apa perbedaan utama antara kata kunci `continue` dan `break` di dalam perulangan?",
          options: [
            "`continue` menghapus variabel, sedangkan `break` menutup program",
            "`continue` hanya untuk angka ganjil, sedangkan `break` untuk angka genap",
            "Keduanya sama persis tanpa perbedaan",
            "`continue` melompati sisa iterasi saat ini dan lanjut ke iterasi berikutnya, sedangkan `break` menghentikan seluruh loop",
          ],
          correctIndex: 3,
          explanation:
            "`continue` hanya melewatkan giliran saat ini dan langsung berpindah ke putaran berikutnya, tanpa menghentikan keseluruhan perulangan.",
        },
        {
          id: "u3-l3-q5",
          type: "code_order",
          prompt: "Susun loop bertingkat (nested loop) untuk mencetak koordinat grid 2x2!",
          blocks: [
            "    console.log(x, y);",
            "for (let x = 0; x < 2; x++) {",
            "}",
            "  for (let y = 0; y < 2; y++) {",
            "  }",
          ],
          correctOrder: [
            "for (let x = 0; x < 2; x++) {",
            "  for (let y = 0; y < 2; y++) {",
            "    console.log(x, y);",
            "  }",
            "}",
          ],
          explanation:
            "Loop luar mengontrol sumbu `x` dan loop dalam mengontrol sumbu `y`, menghasilkan pasangan koordinat (0,0), (0,1), (1,0), (1,1).",
        },
      ],
    },
  ],
};
