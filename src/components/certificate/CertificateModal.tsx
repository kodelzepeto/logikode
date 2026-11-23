"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Download, Sparkles, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  generateUnitCertificate,
  downloadDataUrl,
  computeCertificateId,
} from "@/lib/canvasGenerator";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitNumber: number;
  unitTitle: string;
}

export function CertificateModal({
  isOpen,
  onClose,
  unitNumber,
  unitTitle,
}: CertificateModalProps) {
  const [studentName, setStudentName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [registeredCertId, setRegisteredCertId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    setIsGenerating(true);
    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const credId = computeCertificateId(
        studentName.trim(),
        unitNumber,
        unitTitle
      );
      setRegisteredCertId(credId);

      // Daftarkan ke API registry cloud (Upstash Redis)
      await fetch("/api/certificates/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: credId,
          studentName: studentName.trim(),
          unitNumber,
          unitTitle,
          dateStr,
        }),
      }).catch((err) => console.warn("Offline cert register fallback:", err));

      const dataUrl = await generateUnitCertificate({
        studentName: studentName.trim(),
        unitNumber,
        unitTitle,
        dateStr,
      });

      const cleanFileName = `Sertifikat-LogiKode-Unit-${unitNumber}-${studentName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")}.png`;

      downloadDataUrl(dataUrl, cleanFileName);
      setIsDone(true);
    } catch (err) {
      console.error("Gagal membuat sertifikat:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden"
        >
          {/* Tombol Tutup */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-inner border border-amber-200">
            <Award className="w-9 h-9" />
          </div>

          <h3 className="text-xl font-black text-center text-slate-900 tracking-tight">
            Klaim Sertifikat Unit {unitNumber}
          </h3>
          <p className="text-xs text-center text-slate-500 mt-1 mb-4 leading-relaxed">
            Selamat telah menuntaskan seluruh materi di <strong>{unitTitle}</strong>! Masukkan namamu untuk dicetak di sertifikat resmi.
          </p>

          <form onSubmit={handleDownload} className="space-y-3.5">
            <div>
              <label
                htmlFor="studentName"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Nama Lengkap Penerima:
              </label>
              <input
                id="studentName"
                type="text"
                required
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  setIsDone(false);
                }}
                placeholder="Contoh: Muhammad Amin"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-hidden text-sm font-semibold text-slate-800 placeholder:text-slate-400 transition-colors"
              />
            </div>

            {isDone && (
              <div className="flex flex-col gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Sertifikat berhasil diunduh ke perangkatmu! 🏆</span>
                </div>
                {registeredCertId && (
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60 text-[11px]">
                    <span className="font-mono text-slate-600 font-semibold">
                      ID: {registeredCertId}
                    </span>
                    <Link
                      href={`/verify/${registeredCertId}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 underline"
                    >
                      <span>Cek Verifikasi</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating || !studentName.trim()}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 border-b-4 border-amber-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Merender Sertifikat PNG...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh Sertifikat (PNG)</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-400 mt-3">
            Diterbitkan oleh Core Dev Group (core-dev-group.my.id) • 100% Gratis
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
