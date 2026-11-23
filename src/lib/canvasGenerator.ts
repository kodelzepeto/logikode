/**
 * Utility HTML5 Canvas Generator untuk LogiKode (100% Client-Side, Modal Rp 0)
 * Menghasilkan PNG resolusi tinggi untuk IG Story/WA Status (1080x1920)
 * dan Sertifikat Digital Kelulusan Unit (1600x1130).
 */

export interface StoryShareParams {
  streak: number;
  xp: number;
  completedCount: number;
  totalLevels: number;
  levelTitle?: string;
}

export interface UnitCertificateParams {
  studentName: string;
  unitTitle: string;
  unitNumber: number;
  dateStr: string;
}

/**
 * Memicu pengunduhan file gambar dari data URL di browser.
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  if (typeof window === "undefined") return;
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Menghasilkan Share Card PNG ukuran 1080x1920 (9:16 Story) untuk dipamerkan ke medsos.
 */
export async function generateStoryShareImage(
  params: StoryShareParams
): Promise<string> {
  const width = 1080;
  const height = 1920;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Gagal menginisialisasi 2D Canvas context");
  }

  // 1. Background Gradient (Dark Slate to Deep Indigo)
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, "#090d16");
  bgGradient.addColorStop(0.5, "#0f172a");
  bgGradient.addColorStop(1, "#1e1b4b");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Ambient Glow Spheres
  const glow1 = ctx.createRadialGradient(250, 350, 50, 250, 350, 600);
  glow1.addColorStop(0, "rgba(16, 185, 129, 0.25)");
  glow1.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(850, 1400, 50, 850, 1400, 650);
  glow2.addColorStop(0, "rgba(99, 102, 241, 0.22)");
  glow2.addColorStop(1, "rgba(99, 102, 241, 0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // 3. Logo Icon (Squircle dengan aksen Hijau-Cyan)
  const logoX = width / 2;
  const logoY = 320;
  const logoSize = 180;

  // Squircle background
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, logoX - logoSize / 2, logoY - logoSize / 2, logoSize, logoSize, 44);
  const logoGrad = ctx.createLinearGradient(
    logoX - logoSize / 2,
    logoY - logoSize / 2,
    logoX + logoSize / 2,
    logoY + logoSize / 2
  );
  logoGrad.addColorStop(0, "#00de8d");
  logoGrad.addColorStop(1, "#0284c7");
  ctx.fillStyle = logoGrad;
  ctx.shadowColor = "rgba(0, 222, 141, 0.4)";
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.restore();

  // Simbol < / > di dalam icon logo
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 84px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⚡", logoX, logoY);

  // 4. Header Text Brand
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 68px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("LogiKode", width / 2, 480);

  ctx.fillStyle = "#10b981";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText("BY CORE DEV GROUP", width / 2, 535);

  // 5. Main Headline Card
  ctx.save();
  roundRect(ctx, 90, 620, width - 180, 200, 36);
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 28px sans-serif";
  ctx.fillText("UPDATE PROGRES BELAJAR KODING", width / 2, 690);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 46px sans-serif";
  const mainLabel = params.levelTitle
    ? `Tuntas: ${params.levelTitle}`
    : "Menuju Mahir Logika Koding! 🚀";
  ctx.fillText(mainLabel, width / 2, 760);

  // 6. Tiga Kartu Statistik Utama
  const stats = [
    {
      icon: "🔥",
      title: "DAILY STREAK",
      value: `${params.streak} Hari`,
      color: "#f97316",
      cardY: 870,
    },
    {
      icon: "⚡",
      title: "TOTAL XP",
      value: `${params.xp} XP`,
      color: "#eab308",
      cardY: 1080,
    },
    {
      icon: "🏆",
      title: "LEVEL SELESAI",
      value: `${params.completedCount} / ${params.totalLevels}`,
      color: "#10b981",
      cardY: 1290,
    },
  ];

  stats.forEach((st) => {
    ctx.save();
    roundRect(ctx, 90, st.cardY, width - 180, 175, 32);
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Icon Circle
    ctx.font = "60px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(st.icon, 140, st.cardY + 105);

    // Label
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(st.title, 240, st.cardY + 70);

    // Value
    ctx.fillStyle = st.color;
    ctx.font = "900 52px sans-serif";
    ctx.fillText(st.value, 240, st.cardY + 130);
  });

  // 7. Motivational Call to Action
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "italic 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "\"Konsistensi mengalahkan bakat. Belajar logika koding seru dari HP!\"",
    width / 2,
    1560
  );

  // 8. Watermark Footer
  ctx.save();
  roundRect(ctx, 90, 1660, width - 180, 140, 28);
  ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
  ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 36px sans-serif";
  ctx.fillText("logikode • core-dev-group.my.id", width / 2, 1720);

  ctx.fillStyle = "#10b981";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("Belajar Logika Koding Gratis di Vercel", width / 2, 1765);

  return canvas.toDataURL("image/png");
}

/**
 * Menghasilkan Sertifikat Digital Kelulusan Unit (1600x1130 PNG) berdesain prestisius & formal.
 */
export async function generateUnitCertificate(
  params: UnitCertificateParams
): Promise<string> {
  const width = 1600;
  const height = 1130;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Gagal menginisialisasi 2D Canvas context");
  }

  // 1. Background Dasar Mewah (Obsidian & Royal Navy Radial Glow)
  const bgGrad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    80,
    width / 2,
    height / 2,
    850
  );
  bgGrad.addColorStop(0, "#0c1527");
  bgGrad.addColorStop(0.5, "#080e1a");
  bgGrad.addColorStop(1, "#04070e");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 1b. Pola Guilloche / Watermark Geometris Lembut di Pusat
  ctx.save();
  ctx.lineWidth = 1;
  const rings = [160, 220, 280, 340, 400];
  rings.forEach((r, idx) => {
    ctx.strokeStyle =
      idx % 2 === 0
        ? "rgba(234, 179, 8, 0.03)"
        : "rgba(16, 185, 129, 0.035)";
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 - 30, r, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();

  // 2. Bingkai Emas & Emerald Ornate (Triple Luxury Frame)
  ctx.save();
  // Bingkai Luar Emas
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 4;
  ctx.strokeRect(38, 38, width - 76, height - 76);

  // Bingkai Tipis Tengah
  ctx.strokeStyle = "rgba(234, 179, 8, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Bingkai Dalam Emerald
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  // Garis Halus Inset
  ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
  ctx.lineWidth = 1;
  ctx.strokeRect(70, 70, width - 140, height - 140);
  ctx.restore();

  // Ornamen Berlian Emas di Sudut (4 Corners)
  const drawCornerDiamond = (cx: number, cy: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 12);
    ctx.lineTo(cx + 12, cy);
    ctx.lineTo(cx, cy + 12);
    ctx.lineTo(cx - 12, cy);
    ctx.closePath();
    ctx.fillStyle = "#eab308";
    ctx.fill();
    ctx.strokeStyle = "#fef08a";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Titik Pusat
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
    ctx.restore();
  };

  const corners = [
    [60, 60],
    [width - 60, 60],
    [60, height - 60],
    [width - 60, height - 60],
  ];
  corners.forEach(([cx, cy]) => drawCornerDiamond(cx, cy));

  // 3. Header Institusi
  ctx.textAlign = "center";
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 22px sans-serif";
  ctx.letterSpacing = "5px";
  ctx.fillText("★  CORE DEV GROUP ACADEMY  ★", width / 2, 128);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 13px sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText(
    "LEMBAGA PENGEMBANGAN LOGIKA & DASAR IT INDONESIA",
    width / 2,
    154
  );

  // 4. Judul Sertifikat Utama
  ctx.fillStyle = "#f8fafc";
  ctx.font = "900 58px serif";
  ctx.letterSpacing = "2px";
  ctx.fillText("SERTIFIKAT KELULUSAN", width / 2, 230);

  ctx.fillStyle = "#eab308";
  ctx.font = "bold 16px sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("CERTIFICATE OF COMPLETION & EXCELLENCE", width / 2, 262);

  // Garis Emas Hiasan dengan Berlian di Tengah
  ctx.save();
  ctx.strokeStyle = "rgba(234, 179, 8, 0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 240, 285);
  ctx.lineTo(width / 2 - 18, 285);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width / 2 + 18, 285);
  ctx.lineTo(width / 2 + 240, 285);
  ctx.stroke();

  // Mini Diamond di tengah garis
  ctx.beginPath();
  ctx.moveTo(width / 2, 285 - 6);
  ctx.lineTo(width / 2 + 6, 285);
  ctx.lineTo(width / 2, 285 + 6);
  ctx.lineTo(width / 2 - 6, 285);
  ctx.closePath();
  ctx.fillStyle = "#eab308";
  ctx.fill();
  ctx.restore();

  // 5. Pernyataan Penyerahan
  ctx.fillStyle = "#94a3b8";
  ctx.font = "italic 24px serif";
  ctx.letterSpacing = "0px";
  ctx.fillText(
    "Diberikan dengan penuh apresiasi dan kehormatan kepada:",
    width / 2,
    340
  );

  // 6. Nama Pelajar (Besar, Jelas, Menonjol)
  const displayName = params.studentName.trim() || "Pelajar Hebat";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 64px sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillText(displayName.toUpperCase(), width / 2, 428);

  // Garis Bawah Nama dengan Gradasi
  const textW = Math.max(
    340,
    ctx.measureText(displayName.toUpperCase()).width + 60
  );
  const nameLineGrad = ctx.createLinearGradient(
    width / 2 - textW / 2,
    0,
    width / 2 + textW / 2,
    0
  );
  nameLineGrad.addColorStop(0, "rgba(16, 185, 129, 0)");
  nameLineGrad.addColorStop(0.2, "rgba(16, 185, 129, 0.8)");
  nameLineGrad.addColorStop(0.5, "rgba(234, 179, 8, 0.9)");
  nameLineGrad.addColorStop(0.8, "rgba(16, 185, 129, 0.8)");
  nameLineGrad.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.strokeStyle = nameLineGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - textW / 2, 452);
  ctx.lineTo(width / 2 + textW / 2, 452);
  ctx.stroke();

  // 7. Deskripsi Pencapaian (Dua Baris Rapi, TIDAK MELEBAR ke Garis Tepi)
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "22px sans-serif";
  ctx.letterSpacing = "0.5px";
  ctx.fillText(
    "Atas dedikasi dan keberhasilannya menyelesaikan seluruh materi kurikulum,",
    width / 2,
    512
  );
  ctx.fillText(
    "kuis interaktif, serta tantangan penalaran logika pemrograman komputer pada:",
    width / 2,
    546
  );

  // 8. Nama Unit yang Dituntaskan (Badge Mewah & TIDAK REDUNDAN)
  // Menghilangkan duplikasi kata 'Unit X:' jika unitTitle sudah memilikinya
  const cleanUnitTitle = params.unitTitle
    .replace(/^unit\s*\d+[\s:\-–—]+/i, "")
    .trim();
  const unitLabel = `UNIT ${params.unitNumber}: ${cleanUnitTitle.toUpperCase()}`;

  ctx.save();
  const unitBoxW = 940;
  const unitBoxH = 96;
  const unitBoxX = width / 2 - unitBoxW / 2;
  const unitBoxY = 595;
  roundRect(ctx, unitBoxX, unitBoxY, unitBoxW, unitBoxH, 20);

  const unitGrad = ctx.createLinearGradient(
    0,
    unitBoxY,
    0,
    unitBoxY + unitBoxH
  );
  unitGrad.addColorStop(0, "rgba(16, 185, 129, 0.2)");
  unitGrad.addColorStop(1, "rgba(6, 182, 212, 0.08)");
  ctx.fillStyle = unitGrad;
  ctx.strokeStyle = "rgba(234, 179, 8, 0.6)";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  // Mini Pill Tag di atas kotak unit
  const tagW = 230;
  const tagH = 24;
  roundRect(ctx, width / 2 - tagW / 2, unitBoxY - 12, tagW, tagH, 12);
  ctx.fillStyle = "#064e3b";
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#34d399";
  ctx.font = "bold 11px sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText("KOMPETENSI TERCAPAI", width / 2, unitBoxY + 4);

  // Teks Judul Unit
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 32px sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText(unitLabel, width / 2, unitBoxY + 58);
  ctx.restore();

  // 9. Medali Segel Emas / Golden Rosette Seal Resmi (Tengah Bawah)
  const sealX = width / 2;
  const sealY = 825;

  ctx.save();
  // Pita Segel Bawah (Ribbons)
  // Pita Kiri
  ctx.beginPath();
  ctx.moveTo(sealX - 25, sealY + 25);
  ctx.lineTo(sealX - 45, sealY + 85);
  ctx.lineTo(sealX - 28, sealY + 75);
  ctx.lineTo(sealX - 10, sealY + 85);
  ctx.lineTo(sealX - 12, sealY + 30);
  ctx.closePath();
  ctx.fillStyle = "#047857";
  ctx.fill();
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Pita Kanan
  ctx.beginPath();
  ctx.moveTo(sealX + 12, sealY + 30);
  ctx.lineTo(sealX + 10, sealY + 85);
  ctx.lineTo(sealX + 28, sealY + 75);
  ctx.lineTo(sealX + 45, sealY + 85);
  ctx.lineTo(sealX + 25, sealY + 25);
  ctx.closePath();
  ctx.fillStyle = "#047857";
  ctx.fill();
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Gerigi Medali (Rosette 16 Points)
  const numTeeth = 16;
  const outerRadius = 52;
  const innerRadius = 45;
  ctx.beginPath();
  for (let i = 0; i < numTeeth * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / numTeeth;
    const x = sealX + r * Math.cos(angle);
    const y = sealY + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  const sealGrad = ctx.createRadialGradient(
    sealX,
    sealY,
    10,
    sealX,
    sealY,
    outerRadius
  );
  sealGrad.addColorStop(0, "#fef08a");
  sealGrad.addColorStop(0.6, "#eab308");
  sealGrad.addColorStop(1, "#b45309");
  ctx.fillStyle = sealGrad;
  ctx.fill();
  ctx.strokeStyle = "#fef9c3";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Lingkaran Dalam Segel
  ctx.beginPath();
  ctx.arc(sealX, sealY, 36, 0, Math.PI * 2);
  ctx.fillStyle = "#0f172a";
  ctx.fill();
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Teks Dalam Segel
  ctx.fillStyle = "#eab308";
  ctx.font = "bold 10px sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("★ RESMI ★", sealX, sealY - 12);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 12px sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillText("VERIFIED", sealX, sealY + 4);

  ctx.fillStyle = "#34d399";
  ctx.font = "bold 10px sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("CORE DEV", sealX, sealY + 18);
  ctx.restore();

  // 10. Kolom Kiri: Verifikasi & Tanggal
  const credId = `LK-U${params.unitNumber}-${Math.abs(hashString(displayName + params.unitTitle)).toString(36).toUpperCase().padStart(6, "0")}`;

  ctx.textAlign = "left";
  ctx.letterSpacing = "1px";
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("TANGGAL KELULUSAN:", 160, 785);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText(params.dateStr, 160, 818);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("NO. KREDENSIAL VERIFIKASI:", 160, 868);

  // Badge Kredensial Monospace
  roundRect(ctx, 160, 882, 240, 36, 10);
  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 16px monospace";
  ctx.fillText(credId, 175, 906);

  ctx.fillStyle = "#10b981";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("● Status: Terverifikasi Digital Resmi", 160, 942);

  // 11. Kolom Kanan: Tanda Tangan & Penerbit
  ctx.textAlign = "right";
  ctx.letterSpacing = "1px";
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("DITERBITKAN OLEH:", width - 160, 785);

  // Simulasi Tanda Tangan Digital Grafis (Cursive Bezier Curve)
  ctx.save();
  ctx.strokeStyle = "#34d399";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  const sigX = width - 360;
  const sigY = 825;
  ctx.moveTo(sigX + 20, sigY);
  ctx.bezierCurveTo(
    sigX + 50,
    sigY - 25,
    sigX + 70,
    sigY + 20,
    sigX + 110,
    sigY - 15
  );
  ctx.bezierCurveTo(
    sigX + 140,
    sigY - 35,
    sigX + 130,
    sigY + 15,
    sigX + 170,
    sigY - 5
  );
  ctx.bezierCurveTo(sigX + 185, sigY + 5, sigX + 195, sigY - 15, sigX + 215, sigY);
  ctx.stroke();

  // Garis Bawah Tanda Tangan
  ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width - 360, 842);
  ctx.lineTo(width - 160, 842);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("DEWAN PENILAI AKADEMIK", width - 160, 870);

  ctx.fillStyle = "#10b981";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText("Core Dev Group", width - 160, 895);

  ctx.fillStyle = "#64748b";
  ctx.font = "13px sans-serif";
  ctx.fillText("https://core-dev-group.my.id", width - 160, 918);

  ctx.fillStyle = "#475569";
  ctx.font = "italic 11px sans-serif";
  ctx.fillText("Platform Belajar Logika Koding Modal Rp 0", width - 160, 938);

  // 12. Watermark & Legal Bawah
  ctx.textAlign = "center";
  ctx.fillStyle = "#475569";
  ctx.font = "13px sans-serif";
  ctx.letterSpacing = "0.5px";
  ctx.fillText(
    "LogiKode Platform — Didukung oleh Core Dev Group (core-dev-group.my.id). Terverifikasi secara digital & bebas biaya untuk pelajar.",
    width / 2,
    1042
  );

  return canvas.toDataURL("image/png");
}

/**
 * Helper menggambar persegi sudut membulat pada HTML5 Canvas.
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Helper menghasilkan hash numerik sederhana untuk ID sertifikat konsisten.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
