"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppFooter } from "@/components/layout/AppFooter";
import { CertificateRecord } from "@/types/certificate";
import {
  ShieldCheck,
  Award,
  Calendar,
  Building2,
  Share2,
  ExternalLink,
  Check,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function CertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || "").trim();

  const [cert, setCert] = useState<CertificateRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    fetch(`/api/certificates/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not Found");
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.success && data.certificate) {
            setCert(data.certificate);
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setNotFound(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getLinkedInAddUrl = () => {
    if (!cert) return "#";
    const certName = `LogiKode: ${cert.unitTitle}`;
    const orgName = "Core Dev Group";
    const certUrl = cert.verificationUrl || (typeof window !== "undefined" ? window.location.href : "");
    const certId = cert.id;

    return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
      certName
    )}&organizationName=${encodeURIComponent(orgName)}&issueYear=2026&issueMonth=11&certUrl=${encodeURIComponent(
      certUrl
    )}&certId=${encodeURIComponent(certId)}`;
  };

  return (
    <MobileShell showTopBar={true} showBottomNav={true}>
      <div className="w-full px-4 py-6 flex flex-col gap-5">
        {/* Tombol Kembali ke Halaman Cari */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/verify")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Pencarian Kredensial</span>
          </button>
          <span className="text-[11px] font-mono font-bold text-slate-400">
            ID: {id.toUpperCase()}
          </span>
        </div>

        {/* State Loading */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center gap-3">
            <Sparkles className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-xs font-bold text-slate-600">
              Menghubungkan ke Registry Kredensial Cloud...
            </p>
          </div>
        )}

        {/* State Tidak Ditemukan */}
        {!isLoading && notFound && (
          <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-xs text-center flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-base font-black text-slate-900 tracking-tight">
              Kredensial Tidak Ditemukan
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Nomor kredensial <strong className="font-mono text-slate-700 font-bold">#{id}</strong> tidak ditemukan di database resmi. Pastikan nomor ID tidak salah ketik atau sertifikat telah diterbitkan secara resmi.
            </p>
            <button
              type="button"
              onClick={() => router.push("/verify")}
              className="mt-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Coba Cari Nomor Lain
            </button>
          </div>
        )}

        {/* State Kredensial Sah (Valid) */}
        {!isLoading && cert && (
          <>
            {/* Header Status Valid */}
            <div className="bg-emerald-500 text-white rounded-3xl p-5 shadow-xs border border-emerald-600 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full mb-0.5">
                  ✓ Terverifikasi Resmi
                </div>
                <h1 className="text-sm font-black tracking-tight text-white">
                  Sertifikat Digital Sah & Terdaftar
                </h1>
                <p className="text-[11px] text-emerald-100 font-medium">
                  Tercatat secara permanen di ledger cloud Core Dev Group.
                </p>
              </div>
            </div>

            {/* Kartu Rincian Sertifikat */}
            <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              {/* Nama Siswa */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Diberikan Kepada:
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {cert.studentName}
                </h2>
              </div>

              {/* Kompetensi Unit */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Kompetensi yang Diselesaikan:
                </span>
                <p className="text-sm font-black text-slate-800">
                  Unit {cert.unitNumber}: {cert.unitTitle}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Lulus 100% seluruh level kurikulum logika pemrograman dan tantangan interaktif.
                </p>
              </div>

              {/* Meta Informasi (Grid 2 Kolom) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3" /> Tanggal Terbit
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    {cert.dateStr}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Building2 className="w-3 h-3" /> Lembaga Penerbit
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    {cert.issuer}
                  </p>
                </div>
              </div>

              {/* ID Kredensial Barcode Info */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    ID Kredensial Resmi:
                  </span>
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200 inline-block mt-0.5">
                    {cert.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Status Dokumen:
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">
                    ● Aktif Selamanya
                  </span>
                </div>
              </div>

              {/* Tombol Aksi: Tambah ke LinkedIn & Salin Link */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href={getLinkedInAddUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#0a66c2] hover:bg-[#004182] border-b-4 border-[#084e96] active:translate-y-1 active:border-b-0 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all select-none"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Tambahkan ke Profil LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tautan Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Salin Tautan Verifikasi</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Tombol Belajar di LogiKode */}
            <div className="text-center pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <span>Buka Kurikulum LogiKode & Belajar Gratis</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </>
        )}

        <AppFooter className="mt-2 mb-0" />
      </div>
    </MobileShell>
  );
}
