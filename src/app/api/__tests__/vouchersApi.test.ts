import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// In-memory mock storage untuk Redis
const mockRedisStorage = new Map<string, string>();

vi.mock("@/lib/redis", () => ({
  redis: {
    get: vi.fn(async (key: string) => {
      const val = mockRedisStorage.get(key);
      return val ? JSON.parse(val) : null;
    }),
    set: vi.fn(async (key: string, val: unknown) => {
      mockRedisStorage.set(
        key,
        typeof val === "string" ? val : JSON.stringify(val)
      );
      return "OK";
    }),
  },
}));

import { POST as webhookPost } from "../webhooks/lynkid/route";
import { POST as redeemPost } from "../vouchers/redeem/route";

describe("Lynk.id Webhooks & Upstash Redis Voucher Verification", () => {
  beforeEach(() => {
    mockRedisStorage.clear();
  });

  it("harus MENOLAK kode yang tidak pernah dibayar di Lynk.id (misal tebak-tebakan: FRZ-CDG-82915)", async () => {
    const req = new NextRequest("http://localhost:3000/api/vouchers/redeem", {
      method: "POST",
      body: JSON.stringify({ code: "FRZ-CDG-82915" }),
    });

    const res = await redeemPost(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toContain("TIDAK DITEMUKAN");
  });

  it("harus mendaftarkan order resmi via Lynk.id Webhook", async () => {
    const webhookReq = new NextRequest(
      "http://localhost:3000/api/webhooks/lynkid",
      {
        method: "POST",
        body: JSON.stringify({
          order_id: "82914",
          product_name: "1x Streak Freeze (Rp 2.000)",
          customer_email: "budi@gmail.com",
        }),
      }
    );

    const webhookRes = await webhookPost(webhookReq);
    const webhookData = await webhookRes.json();

    expect(webhookRes.status).toBe(200);
    expect(webhookData.success).toBe(true);
    expect(mockRedisStorage.has("order:82914")).toBe(true);
  });

  it("harus BERHASIL mengklaim jika order resmi ada di database Lynk.id (FRZ-CDG-82914)", async () => {
    // 1. Daftarkan order 82914 via webhook
    const webhookReq = new NextRequest(
      "http://localhost:3000/api/webhooks/lynkid",
      {
        method: "POST",
        body: JSON.stringify({
          order_id: "82914",
          product_name: "1x Streak Freeze",
        }),
      }
    );
    await webhookPost(webhookReq);

    // 2. Klaim voucher di LogiKode
    const redeemReq = new NextRequest(
      "http://localhost:3000/api/vouchers/redeem",
      {
        method: "POST",
        body: JSON.stringify({ code: "FRZ-CDG-82914" }),
      }
    );
    const res = await redeemPost(redeemReq);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.rewardType).toBe("FREEZE");
    expect(data.orderId).toBe("82914");
  });

  it("harus MENOLAK klaim kedua dari nomor order yang sama (Anti-Double Claim Global)", async () => {
    // 1. Daftarkan order
    const webhookReq = new NextRequest(
      "http://localhost:3000/api/webhooks/lynkid",
      {
        method: "POST",
        body: JSON.stringify({
          order_id: "82914",
          product_name: "1x Streak Freeze",
        }),
      }
    );
    await webhookPost(webhookReq);

    // 2. Klaim pertama (berhasil)
    const redeemReq1 = new NextRequest(
      "http://localhost:3000/api/vouchers/redeem",
      {
        method: "POST",
        body: JSON.stringify({ code: "FRZ-CDG-82914" }),
      }
    );
    const res1 = await redeemPost(redeemReq1);
    expect(res1.status).toBe(200);

    // 3. Klaim kedua dari perangkat mana pun (harus ditolak keras)
    const redeemReq2 = new NextRequest(
      "http://localhost:3000/api/vouchers/redeem",
      {
        method: "POST",
        body: JSON.stringify({ code: "FRZ-CDG-82914" }),
      }
    );
    const res2 = await redeemPost(redeemReq2);
    const data2 = await res2.json();

    expect(res2.status).toBe(400);
    expect(data2.success).toBe(false);
    expect(data2.message).toContain("SUDAH PERNAH DIKLAIM");
  });

  it("harus merespons 200 OK untuk tombol Test URL dari dashboard Lynk.id", async () => {
    const testReq = new NextRequest(
      "http://localhost:3000/api/webhooks/lynkid",
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    );
    const res = await webhookPost(testReq);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
