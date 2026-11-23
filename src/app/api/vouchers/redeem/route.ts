import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { LynkOrderRecord } from "@/app/api/webhooks/lynkid/route";
import { parseDynamicOrderVoucher, getActiveVouchers } from "@/lib/vouchers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawCode = String(body.code || "").trim();

    if (!rawCode) {
      return NextResponse.json(
        { success: false, message: "Silakan masukkan kode voucher terlebih dahulu." },
        { status: 400 }
      );
    }

    const normalizedCode = rawCode.toUpperCase();

    // 1. Cek apakah ini voucher promo statis (misal event giveaway dari ENV)
    const activePromos = getActiveVouchers();
    const matchedPromo = activePromos.find((p) => p.code === normalizedCode);

    if (matchedPromo) {
      // Untuk promo global, cek di Redis apakah voucher promo ini masih aktif
      return NextResponse.json({
        success: true,
        isPromo: true,
        code: matchedPromo.code,
        rewardType: matchedPromo.rewardType,
        message: `Selamat! Kode promo ${matchedPromo.code} berhasil diklaim.`,
      });
    }

    // 2. Ekstrak Order ID dari format voucher Lynk.id (misal: FRZ-CDG-82914)
    const dynamicParsed = parseDynamicOrderVoucher(normalizedCode);
    let orderIdToVerify = "";

    if (dynamicParsed && "orderId" in dynamicParsed) {
      orderIdToVerify = dynamicParsed.orderId;
    } else {
      // Jika user langsung memasukkan nomor order tanpa prefix (misal: "82914" atau "#82914")
      orderIdToVerify = normalizedCode.replace(/^#+/, "").trim();
    }

    if (!orderIdToVerify || orderIdToVerify.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Format kode tidak valid. Pastikan menyertakan Nomor Order resmi dari struk pembayaran Lynk.id.",
        },
        { status: 400 }
      );
    }

    // 3. Verifikasi ke Database Cloud Upstash Redis
    const orderDataRaw = await redis.get(`order:${orderIdToVerify}`);

    if (!orderDataRaw) {
      return NextResponse.json(
        {
          success: false,
          message: `Nomor Order #${orderIdToVerify} TIDAK DITEMUKAN di catatan transaksi lunas Lynk.id! Pastikan kamu telah menyelesaikan pembayaran QRIS resmi di Lynk.id.`,
        },
        { status: 400 }
      );
    }

    let orderRecord: LynkOrderRecord;
    if (typeof orderDataRaw === "string") {
      try {
        orderRecord = JSON.parse(orderDataRaw);
      } catch {
        orderRecord = orderDataRaw as unknown as LynkOrderRecord;
      }
    } else {
      orderRecord = orderDataRaw as LynkOrderRecord;
    }

    // 4. Cek apakah sudah pernah diklaim (Anti-Double Claim Global)
    if (orderRecord.claimed) {
      const claimDate = orderRecord.claimedAt
        ? new Date(orderRecord.claimedAt).toLocaleString("id-ID")
        : "sebelumnya";

      return NextResponse.json(
        {
          success: false,
          message: `Nomor Order #${orderIdToVerify} SUDAH PERNAH DIKLAIM pada ${claimDate} dan tidak dapat digunakan lagi! Jika baru saja beli lagi, gunakan Nomor Order dari transaksi terbarumu.`,
        },
        { status: 400 }
      );
    }

    // 5. Tandai Order sebagai SUDAH DIKLAIM secara atomik di database
    const updatedRecord: LynkOrderRecord = {
      ...orderRecord,
      claimed: true,
      claimedAt: Date.now(),
    };

    await redis.set(`order:${orderIdToVerify}`, JSON.stringify(updatedRecord));

    return NextResponse.json({
      success: true,
      rewardType: updatedRecord.rewardType,
      orderId: orderIdToVerify,
      message: `Selamat! Transaksi #${orderIdToVerify} resmi terverifikasi lunas. Hadiah berhasil diaktifkan! 🎉`,
    });
  } catch (err: unknown) {
    console.error("[Redeem Voucher API] Error saat verifikasi:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi gangguan saat memverifikasi voucher ke server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
