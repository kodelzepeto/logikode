import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { VoucherRewardType } from "@/lib/vouchers";

export interface LynkOrderRecord {
  orderId: string;
  rewardType: VoucherRewardType;
  productName: string;
  claimed: boolean;
  claimedAt: number | null;
  customerEmail?: string;
  createdAt: number;
}

/**
 * Health check untuk verifikasi Webhook URL di dashboard Lynk.id
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "LogiKode Lynk.id Webhook Receiver",
    timestamp: Date.now(),
  });
}

/**
 * Menerima sinyal transaksi sukses (completed order) dari Lynk.id
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Ekstrak data dari berbagai format payload Lynk.id / Payment Gateway
    const payload = body.data || body;
    const rawOrderId = String(
      payload.order_id ||
        payload.id ||
        payload.transaction_id ||
        payload.reference_id ||
        payload.invoice_number ||
        ""
    ).trim();

    if (!rawOrderId) {
      return NextResponse.json(
        { error: "Order ID tidak ditemukan dalam payload" },
        { status: 400 }
      );
    }

    const cleanOrderId = rawOrderId.replace(/^#+/, "").trim().toUpperCase();

    // Tentukan jenis hadiah berdasarkan nama produk di Lynk.id
    const productName = String(
      payload.product_name ||
        payload.item_name ||
        payload.title ||
        payload.name ||
        payload.product?.name ||
        ""
    ).toLowerCase();

    let rewardType: VoucherRewardType = "FREEZE";

    if (productName.includes("unlimited") || productName.includes("pro") || productName.includes("7")) {
      rewardType = "UNLIMITED_7D";
    } else if (
      productName.includes("refill") ||
      productName.includes("heart") ||
      productName.includes("nyawa")
    ) {
      rewardType = "REFILL";
    } else {
      rewardType = "FREEZE";
    }

    const orderRecord: LynkOrderRecord = {
      orderId: cleanOrderId,
      rewardType,
      productName: payload.product_name || productName || "Item LogiKode",
      claimed: false,
      claimedAt: null,
      customerEmail: payload.customer_email || payload.email || undefined,
      createdAt: Date.now(),
    };

    // Simpan order resmi yang telah dibayar ke Upstash Redis
    await redis.set(`order:${cleanOrderId}`, JSON.stringify(orderRecord));

    console.log(`[Lynk.id Webhook] Transaksi resmi terdaftar: #${cleanOrderId} (${rewardType})`);

    return NextResponse.json({
      success: true,
      message: `Transaksi #${cleanOrderId} berhasil didaftarkan ke sistem LogiKode`,
      order: orderRecord,
    });
  } catch (err: unknown) {
    console.error("[Lynk.id Webhook] Gagal memproses webhook:", err);
    return NextResponse.json(
      { error: "Internal Server Error saat memproses webhook" },
      { status: 500 }
    );
  }
}
