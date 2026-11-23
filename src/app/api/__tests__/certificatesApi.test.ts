import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

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

import { POST as registerPost } from "../certificates/register/route";
import { GET as certGet } from "../certificates/[id]/route";

describe("Sistem Verifikasi Sertifikat & Registri Kredensial Global", () => {
  beforeEach(() => {
    mockRedisStorage.clear();
  });

  it("harus menolak pendaftaran jika ID atau Nama Siswa kosong", async () => {
    const req = new NextRequest("http://localhost:3000/api/certificates/register", {
      method: "POST",
      body: JSON.stringify({ studentName: "" }),
    });

    const res = await registerPost(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("harus berhasil mendaftarkan sertifikat resmi ke cloud ledger", async () => {
    const req = new NextRequest("http://localhost:3000/api/certificates/register", {
      method: "POST",
      body: JSON.stringify({
        id: "LK-U1-85OW7U",
        studentName: "MUHAMMAD AMIN",
        unitNumber: 1,
        unitTitle: "Unit 1: Logika Dasar & Variabel",
        dateStr: "23 November 2026",
      }),
    });

    const res = await registerPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.certificate.studentName).toBe("MUHAMMAD AMIN");
    expect(data.certificate.unitTitle).toBe("Logika Dasar & Variabel");
  });

  it("harus dapat memverifikasi sertifikat resmi berdasarkan ID kredensial", async () => {
    // 1. Daftarkan dulu
    const regReq = new NextRequest("http://localhost:3000/api/certificates/register", {
      method: "POST",
      body: JSON.stringify({
        id: "LK-U1-85OW7U",
        studentName: "MUHAMMAD AMIN",
        unitNumber: 1,
        unitTitle: "Logika Dasar & Variabel",
        dateStr: "23 November 2026",
      }),
    });
    await registerPost(regReq);

    // 2. Lookup kredensial
    const getReq = new NextRequest("http://localhost:3000/api/certificates/LK-U1-85OW7U");
    const res = await certGet(getReq, {
      params: Promise.resolve({ id: "LK-U1-85OW7U" }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.certificate.studentName).toBe("MUHAMMAD AMIN");
    expect(data.certificate.issuer).toBe("Core Dev Group Academy");
  });

  it("harus mendukung pencarian format alias lama (LK-1-85OW7U)", async () => {
    // 1. Daftarkan dengan LK-U1-85OW7U
    const regReq = new NextRequest("http://localhost:3000/api/certificates/register", {
      method: "POST",
      body: JSON.stringify({
        id: "LK-U1-85OW7U",
        studentName: "MUHAMMAD AMIN",
        unitNumber: 1,
        unitTitle: "Logika Dasar & Variabel",
        dateStr: "23 November 2026",
      }),
    });
    await registerPost(regReq);

    // 2. Lookup dengan alias LK-1-85OW7U
    const getReq = new NextRequest("http://localhost:3000/api/certificates/LK-1-85OW7U");
    const res = await certGet(getReq, {
      params: Promise.resolve({ id: "LK-1-85OW7U" }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.certificate.studentName).toBe("MUHAMMAD AMIN");
  });

  it("harus mengembalikan 404 jika ID kredensial palsu / tidak terdaftar", async () => {
    const getReq = new NextRequest("http://localhost:3000/api/certificates/LK-U1-FAKEID");
    const res = await certGet(getReq, {
      params: Promise.resolve({ id: "LK-U1-FAKEID" }),
    });

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.success).toBe(false);
  });
});
