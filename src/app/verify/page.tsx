"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppFooter } from "@/components/layout/AppFooter";
import { ShieldCheck, Search, Award, ExternalLink, CheckCircle2 } from "lucide-react";

export default function VerifyIndexPage() {
  const router = useRouter();
  const [certId, setCertId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = certId.trim().toUpperCase();
    if (!clean) {
      setErrorMsg("Silakan masukkan ID Kredensial sertifikat.");
      return;
    }
    setErrorMsg("");
    router.push(`/verify/${clean}`);
  };

  return (
    <MobileShell showTopBar={true} showBottomNav={true}>
      <div className="w-full px-4 py-6 flex flex-col gap-5">
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xs border border-slate-700 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white mb-1">
            Verifikasi Kredensial Resmi
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            Pusat validasi sertifikat digital kompetensi koding yang diterbitkan oleh{" "}
            <strong className="text-emerald-400 font-bold">Core Dev Group Academy</strong>.
          </p>
        </div>

        {/* Form Pencarian ID */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <h2 className="text-sm font-black text-slate-800 tracking-tight mb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600" /> Cek Keaslian Sertifikat
          </h2>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Masukkan kode ID Kredensial yang tertera pada lembar sertifikat digital atau hasil pindai QR Code.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                value={certId}
                onChange={(e) => {
                  setCertId(e.target.value.toUpperCase());
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="CONTOH: LK-U1-85OW7U"
                className="w-full font-mono text-xs sm:text-sm font-bold uppercase tracking-wider px-3.5 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-hidden focus:border-emerald-500 transition-colors placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
              />
              {errorMsg && (
                <p className="text-rose-600 text-xs font-semibold mt-1.5 pl-1">
                  ⚠️ {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all select-none shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Verifikasi Kredensial</span>
            </button>
          </form>

          {/* Contoh Pencarian Cepat */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
            <span className="font-semibold">Contoh Terverifikasi:</span>
            <button
              type="button"
              onClick={() => setCertId("LK-U1-85OW7U")}
              className="font-mono text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 cursor-pointer font-bold transition-colors"
            >
              LK-U1-85OW7U
            </button>
          </div>
        </section>

        {/* Informasi Standar Kredensial Global */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" /> Standar Keabsahan Kredensial
          </h2>
          <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p>
                <strong>Tervalidasi di Cloud:</strong> Setiap sertifikat yang diterbitkan tersimpan secara permanen dalam ledger cloud Upstash Redis dan dapat diakses publik 24/7.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p>
                <strong>Didukung LinkedIn:</strong> Kredensial dapat langsung disematkan ke profil LinkedIn resmi pada bagian <em>Licenses & Certifications</em>.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p>
                <strong>Bebas Biaya:</strong> Dikelola oleh{" "}
                <a
                  href="https://core-dev-group.my.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-bold underline inline-flex items-center gap-0.5"
                >
                  Core Dev Group <ExternalLink className="w-3 h-3" />
                </a>{" "}
                untuk mendukung kemajuan literasi teknologi pelajar Indonesia.
              </p>
            </div>
          </div>
        </section>

        <AppFooter className="mt-2 mb-0" />
      </div>
    </MobileShell>
  );
}
