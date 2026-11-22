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
 * Menghasilkan Sertifikat Digital Kelulusan Unit (1600x1130 PNG) bergaya formal modern.
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

  // 1. Background Dasar Mewah (Slate Gelap)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#0b0f19");
  bgGrad.addColorStop(0.5, "#0f172a");
  bgGrad.addColorStop(1, "#111827");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Bingkai Emas & Emerald Ornate (Double Border)
  ctx.save();
  ctx.strokeStyle = "#eab308"; // Gold
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = "#10b981"; // Emerald
  ctx.lineWidth = 3;
  ctx.strokeRect(55, 55, width - 110, height - 110);
  ctx.restore();

  // Ornamen Sudut Emas
  const corners = [
    [70, 70],
    [width - 70, 70],
    [70, height - 70],
    [width - 70, height - 70],
  ];
  ctx.fillStyle = "#eab308";
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Header Ribbon / Institusi
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "4px";
  ctx.fillText("★ CORE DEV GROUP ACADEMY ★", width / 2, 140);

  // 4. Judul Sertifikat Utama
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 64px serif";
  ctx.fillText("SERTIFIKAT KELULUSAN", width / 2, 230);

  // Garis Emas di Bawah Judul
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 250, 260);
  ctx.lineTo(width / 2 + 250, 260);
  ctx.stroke();

  // 5. Pernyataan Penyerahan
  ctx.fillStyle = "#94a3b8";
  ctx.font = "italic 28px serif";
  ctx.fillText("Diberikan dengan penuh apresiasi dan kehormatan kepada:", width / 2, 330);

  // 6. Nama Pelajar (Sangat Menonjol)
  ctx.fillStyle = "#f8fafc";
  ctx.font = "900 68px sans-serif";
  const displayName = params.studentName.trim() || "Pelajar Hebat";
  ctx.fillText(displayName, width / 2, 440);

  // Garis Bawah Nama
  const textWidth = ctx.measureText(displayName).width;
  ctx.strokeStyle = "rgba(16, 185, 129, 0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - Math.max(250, textWidth / 2 + 30), 470);
  ctx.lineTo(width / 2 + Math.max(250, textWidth / 2 + 30), 470);
  ctx.stroke();

  // 7. Deskripsi Pencapaian
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "26px sans-serif";
  ctx.fillText(
    "Atas keberhasilannya menuntaskan seluruh materi kurikulum dan tantangan logika pemrograman pada:",
    width / 2,
    550
  );

  // 8. Nama Unit yang Dituntaskan (Badge Mewah)
  ctx.save();
  const unitBoxW = 900;
  const unitBoxH = 110;
  roundRect(ctx, width / 2 - unitBoxW / 2, 600, unitBoxW, unitBoxH, 24);
  const unitGrad = ctx.createLinearGradient(0, 600, 0, 710);
  unitGrad.addColorStop(0, "rgba(16, 185, 129, 0.2)");
  unitGrad.addColorStop(1, "rgba(6, 182, 212, 0.1)");
  ctx.fillStyle = unitGrad;
  ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 38px sans-serif";
  ctx.fillText(`UNIT ${params.unitNumber}: ${params.unitTitle.toUpperCase()}`, width / 2, 668);

  // 9. Informasi Kelulusan & Tanda Tangan
  const credId = `LK-${params.unitNumber}-${Math.abs(hashString(displayName + params.unitTitle)).toString(36).toUpperCase()}`;

  // Kiri: Tanggal
  ctx.textAlign = "left";
  ctx.fillStyle = "#94a3b8";
  ctx.font = "22px sans-serif";
  ctx.fillText("Tanggal Selesai:", 160, 840);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText(params.dateStr, 160, 875);

  ctx.fillStyle = "#64748b";
  ctx.font = "20px monospace";
  ctx.fillText(`ID: ${credId}`, 160, 915);

  // Kanan: Penerbit & Tanda Tangan
  ctx.textAlign = "right";
  ctx.fillStyle = "#94a3b8";
  ctx.font = "22px sans-serif";
  ctx.fillText("Diterbitkan Oleh:", width - 160, 840);

  ctx.fillStyle = "#10b981";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText("Core Dev Group", width - 160, 880);

  ctx.fillStyle = "#64748b";
  ctx.font = "20px sans-serif";
  ctx.fillText("https://core-dev-group.my.id", width - 160, 915);

  // 10. Watermark Bawah
  ctx.textAlign = "center";
  ctx.fillStyle = "#475569";
  ctx.font = "18px sans-serif";
  ctx.fillText(
    "LogiKode Platform — Didukung oleh Core Dev Group. Terverifikasi secara digital & bebas biaya.",
    width / 2,
    1030
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
