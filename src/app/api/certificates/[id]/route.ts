import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { CertificateRecord } from "@/types/certificate";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id || "").trim().toUpperCase();

    if (!cleanId) {
      return NextResponse.json(
        { success: false, message: "ID Kredensial tidak valid." },
        { status: 400 }
      );
    }

    // 1. Cek di Upstash Redis
    let rawCert = await redis.get(`cert:${cleanId}`);

    // 2. Cek format alias jika belum ketemu
    if (!rawCert) {
      if (cleanId.startsWith("LK-U")) {
        const aliasId = cleanId.replace("LK-U", "LK-");
        rawCert = await redis.get(`cert:${aliasId}`);
      } else if (cleanId.startsWith("LK-")) {
        const aliasId = cleanId.replace("LK-", "LK-U");
        rawCert = await redis.get(`cert:${aliasId}`);
      }
    }

    if (!rawCert) {
      return NextResponse.json(
        {
          success: false,
          message: `Nomor Kredensial #${cleanId} tidak ditemukan dalam arsip resmi Core Dev Group Academy.`,
        },
        { status: 404 }
      );
    }

    const certRecord: CertificateRecord =
      typeof rawCert === "string" ? JSON.parse(rawCert) : (rawCert as CertificateRecord);

    return NextResponse.json({
      success: true,
      certificate: certRecord,
    });
  } catch (error) {
    console.error("[Certificate Lookup Error]:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat memverifikasi kredensial." },
      { status: 500 }
    );
  }
}
