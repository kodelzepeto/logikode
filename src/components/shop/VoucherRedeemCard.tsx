"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, CheckCircle2, AlertCircle } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";

export function VoucherRedeemCard() {
  const { applyVoucherReward, progress } = useUserProgress();
  const [voucherCode, setVoucherCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = voucherCode.trim().toUpperCase();
    if (!cleanCode) {
      setFeedback({
        type: "error",
        message: "Silakan ketikkan kode voucher terlebih dahulu.",
      });
      return;
    }

    // Pengecekan lokal apakah sudah pernah diklaim di perangkat ini
    if (progress.redeemedVouchers?.includes(cleanCode)) {
      setFeedback({
        type: "error",
        message: `Kode voucher "${cleanCode}" sudah pernah kamu klaim di perangkat ini!`,
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/vouchers/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        applyVoucherReward(data.rewardType, cleanCode);
        setFeedback({
          type: "success",
          message: data.message,
        });
        setVoucherCode("");
      } else {
        setFeedback({
          type: "error",
          message:
            data.message ||
            "Kode voucher tidak valid atau transaksi belum tercatat lunas di Lynk.id.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message:
          "Gagal menghubungkan ke server verifikasi. Periksa koneksi internetmu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col gap-3.5">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200/70">
          <Ticket className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight">
            Tukar Kode Voucher
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Punya kode dari pembelian QRIS atau giveaway? Masukkan di sini!
          </p>
        </div>
      </div>

      <form onSubmit={handleRedeem} className="flex flex-col gap-2.5">
        <div className="flex gap-2">
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => {
              setVoucherCode(e.target.value.toUpperCase());
              if (feedback) setFeedback(null);
            }}
            placeholder="MASUKKAN KODE VOUCHER"
            className="flex-1 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-hidden focus:border-emerald-500 transition-colors placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all select-none shadow-xs shrink-0 cursor-pointer ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Memeriksa..." : "Tukar"}
          </button>
        </div>

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`p-3 rounded-2xl text-xs font-bold flex items-start gap-2 ${
                feedback.type === "success"
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                  : "bg-rose-50 border border-rose-300 text-rose-800"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Petunjuk Redeem Lynk.id */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-[11px] text-slate-500 flex items-start gap-2">
        <span className="text-amber-500 text-xs shrink-0 mt-0.5">💡</span>
        <p className="leading-relaxed">
          Setelah menyelesaikan transaksi QRIS di Lynk.id, masukkan kode voucher resmi yang tertera di pesan bukti pembayaran Anda untuk mengaktifkan item secara instan.
        </p>
      </div>
    </div>
  );
}
