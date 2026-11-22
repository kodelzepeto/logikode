"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, ExternalLink } from "lucide-react";

export interface QrisItemInfo {
  id: string;
  name: string;
  price: string;
  paymentUrl: string;
  description: string;
}

interface QrisPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: QrisItemInfo | null;
}

export function QrisPaymentModal({
  isOpen,
  onClose,
  item,
}: QrisPaymentModalProps) {
  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 relative select-none"
        >
          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-xl transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Modal */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0 border border-rose-200/80 shadow-2xs">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
                QRIS Ramah Pelajar
              </span>
              <h3 className="text-base font-black text-slate-900 tracking-tight mt-0.5">
                {item.name}
              </h3>
            </div>
          </div>

          {/* Kartu Harga & Deskripsi */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-4 text-center">
            <span className="text-xs text-slate-500 font-medium block">
              Nominal Pembayaran:
            </span>
            <span className="text-2xl font-black text-emerald-600 tracking-tight block my-0.5">
              {item.price}
            </span>
            <p className="text-[11px] text-slate-600 leading-snug">
              {item.description}
            </p>
          </div>

          {/* 3 Langkah Mudah */}
          <div className="flex flex-col gap-2.5 mb-5 text-xs text-slate-600">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Langkah Penyelesaian:
            </span>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p className="leading-snug">
                Klik tombol <strong>&ldquo;Buka Pembayaran QRIS&rdquo;</strong> di bawah.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p className="leading-snug">
                Selesaikan transaksi instan melalui Mayar / Lynk.id dengan
                e-wallet (GoPay, OVO, ShopeePay) atau Mobile Banking.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <p className="leading-snug">
                Salin <strong>Kode Voucher</strong> yang tertera di struk Lynk.id (format:{" "}
                <code className="text-emerald-700 font-mono font-bold bg-emerald-50 px-1 py-0.5 rounded">
                  PREFIX-NOMOR_ORDER
                </code>
                ), lalu tukarkan di kolom &ldquo;Tukar Kode Voucher&rdquo;.
              </p>
            </div>
          </div>

          {/* Tombol Menuju Halaman Pembayaran */}
          <div className="flex flex-col gap-2">
            <a
              href={item.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all select-none"
            >
              <span>Buka Pembayaran QRIS</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-colors"
            >
              Nanti Saja
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
