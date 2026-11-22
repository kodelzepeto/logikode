"use client";

import React, { useState } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { useUserProgress } from "@/hooks/useUserProgress";
import { isUnlimitedHeartsActive } from "@/lib/gamification";
import { QrisPaymentModal, QrisItemInfo } from "@/components/shop/QrisPaymentModal";
import { VoucherRedeemCard } from "@/components/shop/VoucherRedeemCard";
import {
  ShoppingBag,
  Snowflake,
  Heart,
  Infinity as InfinityIcon,
  Zap,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Sparkles,
} from "lucide-react";

export default function ShopPage() {
  const { progress, buyWithXP, isLoaded } = useUserProgress();
  const [activeQrisItem, setActiveQrisItem] = useState<QrisItemInfo | null>(null);
  const [purchaseAlert, setPurchaseAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const isUnlimited = isLoaded ? isUnlimitedHeartsActive(progress) : false;
  const userXP = isLoaded ? progress.xp : 0;
  const userHearts = isLoaded ? progress.hearts : 5;
  const userFreezes = isLoaded ? progress.streakFreezes : 0;

  // Tanggal kedaluwarsa Unlimited Hearts jika aktif
  const unlimitedExpiryDate =
    isUnlimited && progress.unlimitedHeartsUntil
      ? new Date(progress.unlimitedHeartsUntil).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

  const handleBuyXP = (itemType: "streak_freeze" | "refill_hearts") => {
    const res = buyWithXP(itemType);
    setPurchaseAlert({
      type: res.success ? "success" : "error",
      message: res.message,
    });
    setTimeout(() => {
      setPurchaseAlert(null);
    }, 4000);
  };

  const freezeQrisUrl =
    process.env.NEXT_PUBLIC_QRIS_FREEZE_URL ||
    "https://lynk.id/coredevgroup/freeze-2k";
  const refillQrisUrl =
    process.env.NEXT_PUBLIC_QRIS_REFILL_URL ||
    "https://lynk.id/coredevgroup/hearts-2k";
  const unlimitedQrisUrl =
    process.env.NEXT_PUBLIC_QRIS_UNLIMITED_URL ||
    "https://lynk.id/coredevgroup/unlimited-3k";

  return (
    <MobileShell showTopBar={true} showBottomNav={true}>
      <div className="w-full px-4 py-6 flex flex-col gap-5 select-none">
        {/* Banner Ringkasan Saldo User */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-5 shadow-xs border-b-4 border-amber-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-200" />
              <h1 className="text-lg font-black tracking-tight">
                Toko Ramah Pelajar
              </h1>
            </div>
            <div className="flex items-center gap-1 font-black text-xs bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-xl">
              <Zap className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
              <span>{userXP} XP</span>
            </div>
          </div>
          <p className="text-xs text-white/90 leading-relaxed">
            Dapatkan perlindungan streak dan nyawa tambahan via XP gratis atau
            mikrotransaksi QRIS ramah kantong pelajar (Rp 2.000 – Rp 3.000).
          </p>

          {/* Status Unlimited Hearts jika aktif */}
          {isUnlimited && (
            <div className="mt-3 bg-white/20 border border-white/30 rounded-2xl p-2.5 flex items-center gap-2 text-xs font-bold text-white">
              <InfinityIcon className="w-5 h-5 shrink-0" />
              <span>
                Unlimited Hearts aktif hingga{" "}
                <strong>{unlimitedExpiryDate}</strong> 🎉
              </span>
            </div>
          )}
        </div>

        {/* Notifikasi Hasil Transaksi */}
        {purchaseAlert && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2.5 animate-fadeIn ${
              purchaseAlert.type === "success"
                ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                : "bg-rose-50 border border-rose-300 text-rose-800"
            }`}
          >
            {purchaseAlert.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span className="leading-snug">{purchaseAlert.message}</span>
          </div>
        )}

        {/* Katalog Item Toko */}
        <section className="flex flex-col gap-3.5">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> Pilihan Item Belajar
          </h2>

          {/* Item 1: Streak Freeze */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
                <Snowflake className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">
                    Streak Freeze
                  </h3>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    Milikmu: {userFreezes}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Melindungi runtutan streak belajarmu jika terlewat 1 hari.
                </p>
              </div>
            </div>

            {/* Opsi Pembelian */}
            <div className="flex gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleBuyXP("streak_freeze")}
                className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>100 XP</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveQrisItem({
                    id: "freeze",
                    name: "1x Streak Freeze",
                    price: "Rp 2.000",
                    paymentUrl: freezeQrisUrl,
                    description:
                      "Voucher digital pelindung streak harian selama 1 hari.",
                  })
                }
                className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>QRIS Rp 2.000</span>
              </button>
            </div>
          </div>

          {/* Item 2: Isi Ulang 5 Hearts */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">
                    Isi Ulang 5 Hearts
                  </h3>
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Nyawa: {userHearts} / 5
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Pulihkan 5 nyawa seketika tanpa menunggu jeda regenerasi 30 menit.
                </p>
              </div>
            </div>

            {/* Opsi Pembelian */}
            <div className="flex gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                disabled={userHearts >= 5 || isUnlimited}
                onClick={() => handleBuyXP("refill_hearts")}
                className={`flex-1 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  userHearts >= 5 || isUnlimited
                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    : "bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold cursor-pointer"
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>50 XP</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveQrisItem({
                    id: "refill",
                    name: "Isi Ulang 5 Hearts Penuh",
                    price: "Rp 2.000",
                    paymentUrl: refillQrisUrl,
                    description:
                      "Voucher pemulihan instan 5 nyawa penuh untuk lanjut belajar.",
                  })
                }
                className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>QRIS Rp 2.000</span>
              </button>
            </div>
          </div>

          {/* Item 3: Unlimited Hearts 7 Hari */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs flex flex-col gap-3 relative overflow-hidden">
            <span className="absolute top-0 right-0 bg-emerald-500 text-white font-black text-[9px] uppercase px-3 py-1 rounded-bl-2xl tracking-wider shadow-xs">
              Paling Hemat
            </span>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <InfinityIcon className="w-6 h-6" />
              </div>
              <div className="flex-1 pr-14">
                <h3 className="text-sm font-black text-slate-900">
                  Unlimited Hearts (7 Hari)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Belajar sepuasnya tanpa batas nyawa selama seminggu penuh.
                </p>
              </div>
            </div>

            {/* Opsi Pembelian QRIS */}
            <div className="pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  setActiveQrisItem({
                    id: "unlimited",
                    name: "Unlimited Hearts (7 Hari Penuh)",
                    price: "Rp 3.000",
                    paymentUrl: unlimitedQrisUrl,
                    description:
                      "Voucher akses bebas salah tanpa takut kehabisan nyawa selama 7 hari.",
                  })
                }
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-emerald-100" />
                <span>Beli via QRIS (Rp 3.000)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Form Tukar Kode Voucher */}
        <VoucherRedeemCard />

        {/* Modal Pop-up QRIS */}
        <QrisPaymentModal
          isOpen={activeQrisItem !== null}
          onClose={() => setActiveQrisItem(null)}
          item={activeQrisItem}
        />

        {/* Footer Branding Resmi Core Dev Group (WAJIB) */}
        <footer className="mt-4 mb-2 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Built with ❤️ by{" "}
            <a
              href="https://core-dev-group.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-600 hover:underline"
            >
              Core Dev Group
            </a>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Solusi Belajar Logika Koding Modal Rp 0 untuk Generasi Muda Indonesia
          </p>
        </footer>
      </div>
    </MobileShell>
  );
}
