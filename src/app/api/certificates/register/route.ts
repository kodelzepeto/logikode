import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { CertificateRecord } from "@/types/certificate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawId = String(body.id || "").trim().toUpperCase();
    const studentName = String(body.studentName || "").trim();
    const unitNumber = Number(body.unitNumber) || 1;
    const unitTitle = String(body.unitTitle || "").trim();
    const dateStr = String(body.dateStr || "").trim();

    if (!rawId || !studentName) {
      return NextResponse.json(
        { success: false, message: "ID Kredensial dan Nama Siswa wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUnitTitle = unitTitle.replace(/^unit\s*\d+[\s:\-–—]+/i, "").trim();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://logi-kode.vercel.app";

    const certRecord: CertificateRecord = {
      id: rawId,
      studentName: studentName.toUpperCase(),
      unitNumber,
      unitTitle: cleanUnitTitle || `Unit ${unitNumber}`,
      dateStr: dateStr || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      issuedAt: Date.now(),
      issuer: "Core Dev Group Academy",
      issuerUrl: "https://core-dev-group.my.id",
      status: "VALID",
      verificationUrl: `${baseUrl}/verify/${rawId}`,
    };

    // Simpan ke Upstash Redis
    await redis.set(`cert:${rawId}`, JSON.stringify(certRecord));

    // Jika formatnya LK-U1-..., simpan juga alias LK-1-... agar keduanya valid dicari
    if (rawId.startsWith("LK-U")) {
      const aliasId = rawId.replace("LK-U", "LK-");
      await redis.set(`cert:${aliasId}`, JSON.stringify({ ...certRecord, id: aliasId }));
    } else if (rawId.startsWith("LK-")) {
      const aliasId = rawId.replace("LK-", "LK-U");
      await redis.set(`cert:${aliasId}`, JSON.stringify({ ...certRecord, id: aliasId }));
    }

    return NextResponse.json({
      success: true,
      message: "Sertifikat berhasil didaftarkan ke registri kredensial global.",
      certificate: certRecord,
    });
  } catch (error) {
    console.error("[Certificate Register Error]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mendaftarkan sertifikat ke database." },
      { status: 500 }
    );
  }
}
