"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/MobileShell";
import { AppFooter } from "@/components/layout/AppFooter";
import { useUserProgress } from "@/hooks/useUserProgress";
import { getAllLevels, CURRICULUM_UNITS } from "@/data/curriculum";
import { CertificateModal } from "@/components/certificate/CertificateModal";
import { WhatsNewModal } from "@/components/modals/WhatsNewModal";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { DailyQuestsCard } from "@/components/quests/DailyQuestsCard";
import { getDailyGoalConfig } from "@/lib/onboarding";
import {
  generateStoryShareImage,
  downloadDataUrl,
} from "@/lib/canvasGenerator";
import { APP_VERSION, getAppVersionBadge } from "@/lib/version";
import {
  Flame,
  Zap,
  Snowflake,
  Trophy,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Code2,
  Share2,
  Sparkles,
  Award,
  Search,
  Lock,
  ShieldCheck,
  Pencil,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { progress, resetProgress, isLoaded, completeOnboarding } = useUserProgress();
  const allLevels = getAllLevels();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedCertUnit, setSelectedCertUnit] = useState<{
    number: number;
    title: string;
  } | null>(null);
  const [lookupCertId, setLookupCertId] = useState("");
  const [lookupError, setLookupError] = useState("");

  const dailyGoalConfig = getDailyGoalConfig(progress.dailyGoal);

  const totalLevels = allLevels.length;
  const completedCount = isLoaded ? progress.completedLevels.length : 0;
  const progressPercent = Math.round((completedCount / totalLevels) * 100);

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const handleShareStory = async () => {
    setIsSharing(true);
    try {
      const dataUrl = await generateStoryShareImage({
        streak: progress.streak,
        xp: progress.xp,
        completedCount,
        totalLevels,
      });
      downloadDataUrl(dataUrl, "LogiKode-Progres-Story.png");
    } catch (err) {
      console.error("Gagal men-generate story:", err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleLookupCert = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lookupCertId.trim().toUpperCase();
    if (!clean) {
      setLookupError("Silakan masukkan ID Kredensial (contoh: LK-U1-85OW7U)");
      return;
    }
    setLookupError("");
    router.push(`/verify/${clean}`);
  };

  return (
    <MobileShell showTopBar={true} showBottomNav={true}>
      <div className="w-full px-4 py-6 flex flex-col gap-5">
        {/* User Header Avatar dengan Logo Resmi */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-slate-900 shrink-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="LogiKode"
              width={64}
              height={64}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-black text-slate-800 tracking-tight">
                {isLoaded && progress.userName ? progress.userName : "Pelajar LogiKode"}
              </h1>
              <button
                type="button"
                onClick={() => setShowOnboarding(true)}
                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                title="Ubah Nama & Target Belajar"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Mode Belajar Tanpa Login (Penyimpanan Lokal)
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3" /> Akun Aktif
              </span>
              <button
                type="button"
                onClick={() => setShowWhatsNew(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-full border border-slate-200 font-mono transition-colors cursor-pointer"
                title="Lihat Apa yang Baru"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                v{APP_VERSION}
              </button>
            </div>
          </div>
        </div>

        {/* Kartu Target Ritme Belajar Harian */}
        <section className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-xl shrink-0 shadow-inner">
              {dailyGoalConfig.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Harian
                </span>
                {dailyGoalConfig.badge && (
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                    {dailyGoalConfig.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xs font-black text-slate-800">
                {dailyGoalConfig.title} ({dailyGoalConfig.targetXp} XP / hari)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {dailyGoalConfig.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowOnboarding(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
          >
            Ubah
          </button>
        </section>

        {/* Notifikasi Sukses Reset */}
        {resetSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold p-3 rounded-2xl text-center animate-fadeIn">
            ✅ Progres belajar berhasil di-reset ke awal!
          </div>
        )}

        {/* Widget Misi Harian (Daily Quests) */}
        <DailyQuestsCard className="mb-4" />

        {/* Kartu Statistik & Tombol Pamer ke Story */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Statistik Belajar
            </h2>
            <span className="text-[11px] font-bold text-slate-500">
              Total {totalLevels} Level
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {/* Stat: Total XP */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3 text-center">
              <Zap className="w-5 h-5 mx-auto text-amber-500 fill-amber-500 mb-1" />
              <div className="text-lg font-black text-slate-800">
                {isLoaded ? progress.xp : 0}
              </div>
              <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                Total XP
              </div>
            </div>

            {/* Stat: Streak */}
            <div className="bg-orange-50/70 border border-orange-200/60 rounded-2xl p-3 text-center">
              <Flame className="w-5 h-5 mx-auto text-orange-500 fill-orange-500 mb-1" />
              <div className="text-lg font-black text-slate-800">
                {isLoaded ? progress.streak : 0}
              </div>
              <div className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                Streak Hari
              </div>
            </div>

            {/* Stat: Streak Freeze */}
            <div className="bg-sky-50/70 border border-sky-200/60 rounded-2xl p-3 text-center">
              <Snowflake className="w-5 h-5 mx-auto text-sky-500 mb-1" />
              <div className="text-lg font-black text-slate-800">
                {isLoaded ? progress.streakFreezes : 0}
              </div>
              <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                Freeze
              </div>
            </div>
          </div>

          {/* Progress Kurikulum */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-3.5">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-700">Penyelesaian Kurikulum</span>
              <span className="text-emerald-600">
                {completedCount} / {totalLevels} Level ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Tombol Bagikan ke Story */}
          <button
            type="button"
            onClick={handleShareStory}
            disabled={isSharing}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-b-4 border-indigo-800 active:translate-y-1 active:border-b-0 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSharing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Merender Story PNG...</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Bagikan ke Story (Download PNG)</span>
              </>
            )}
          </button>
        </section>

        {/* Seksi Sertifikat & Verifikasi Kredensial Resmi */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Sertifikat & Kredensial
            </h2>
            <Link
              href="/verify"
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5"
            >
              <span>Portal Verifikasi</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Selesaikan seluruh level pada suatu unit untuk mengklaim sertifikat digital resmi ber-QR Code dari <strong>Core Dev Group Academy</strong>.
          </p>

          {/* Form Pencarian Cepat Kredensial */}
          <form onSubmit={handleLookupCert} className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={lookupCertId}
                  onChange={(e) => {
                    setLookupCertId(e.target.value.toUpperCase());
                    if (lookupError) setLookupError("");
                  }}
                  placeholder="Cek ID: LK-U1-85OW7U"
                  className="w-full font-mono text-xs font-bold uppercase tracking-wider px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 transition-colors placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 border-b-2 border-emerald-700 active:translate-y-0.5 active:border-b-0 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer select-none transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cek</span>
              </button>
            </div>
            {lookupError && (
              <p className="text-rose-600 text-[11px] font-semibold mt-1">
                ⚠️ {lookupError}
              </p>
            )}
          </form>

          {/* Daftar Sertifikat per Unit Kurikulum */}
          <div className="space-y-3">
            {CURRICULUM_UNITS.map((unit, idx) => {
              const unitNum = parseInt(unit.id.replace(/\D/g, "")) || idx + 1;
              const completedLevelsInUnit = unit.levels.filter((l) =>
                progress.completedLevels.includes(l.id)
              ).length;
              const isCompleted =
                isLoaded &&
                unit.levels.length > 0 &&
                completedLevelsInUnit === unit.levels.length;
              const progressPct = Math.round(
                (completedLevelsInUnit / unit.levels.length) * 100
              );

              return (
                <div
                  key={unit.id}
                  className={`rounded-2xl p-3.5 border transition-all ${
                    isCompleted
                      ? "bg-gradient-to-r from-amber-50/60 to-emerald-50/60 border-amber-200/80 shadow-2xs"
                      : "bg-slate-50/70 border-slate-200/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          Unit {unitNum}
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tuntas
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-black text-slate-800 mt-1">
                        {unit.title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-slate-500">
                        {completedLevelsInUnit} / {unit.levels.length} Level
                      </span>
                    </div>
                  </div>

                  {/* Progress bar jika belum selesai */}
                  {!isCompleted && (
                    <div className="mt-2">
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
                        <Lock className="w-3 h-3 text-slate-400" /> Selesaikan {unit.levels.length - completedLevelsInUnit} level lagi untuk membuka sertifikat ini.
                      </p>
                    </div>
                  )}

                  {/* Tombol aksi jika tuntas */}
                  {isCompleted && (
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-amber-200/50">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCertUnit({ number: unitNum, title: unit.title })
                        }
                        className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 active:translate-y-0.5 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer select-none border-b-2 border-amber-700 active:border-b-0 transition-all"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Klaim / Unduh Sertifikat</span>
                      </button>
                      <Link
                        href="/verify"
                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs shrink-0"
                        title="Buka halaman verifikasi untuk mengecek keaslian ID kredensial"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verifikasi</span>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Kartu Branding Resmi Core Dev Group (WAJIB) */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-sm border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-500 rounded-xl text-white">
              <Code2 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-black tracking-tight text-white">
              LogiKode by Core Dev Group
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            LogiKode adalah platform edukasi logika koding mobile-first bergaya
            Duolingo, dirancang khusus oleh <strong>Core Dev Group</strong> untuk
            membantu pelajar dan mahasiswa baru Indonesia memahami cara berpikir
            komputasional secara gratis, ringan, dan menyenangkan.
          </p>
          <a
            href="https://core-dev-group.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all select-none"
          >
            <span>Kunjungi core-dev-group.my.id</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>

        {/* Zona Pengujian & Pengaturan Data */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <h2 className="text-sm font-black text-slate-800 tracking-tight mb-2">
            Zona Pengujian Aplikasi
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Ingin menguji alur belajar dari level 1 lagi? Kamu dapat menghapus
            seluruh progres lokal sewaktu-waktu.
          </p>

          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold rounded-2xl text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Progres Belajar
            </button>
          ) : (
            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-rose-700 font-black text-xs mb-1">
                <ShieldAlert className="w-4 h-4" /> Yakin Ingin Mereset Data?
              </div>
              <p className="text-[11px] text-rose-600 mb-3">
                XP, streak, dan level yang terbuka akan dikembalikan ke kondisi awal.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Ya, Reset Sekarang
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Badge Versi Aplikasi Resmi & Tombol Riwayat Update */}
        <div className="flex flex-col items-center justify-center gap-2 -mt-1 mb-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-500 text-[11px] font-bold font-mono select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>{getAppVersionBadge()}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowWhatsNew(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-800 text-xs font-bold transition-all shadow-2xs cursor-pointer select-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Lihat Riwayat Update & Catatan Rilis</span>
          </button>
        </div>

        {/* Footer Branding Resmi Core Dev Group */}
        <AppFooter className="mt-2 mb-0" />
      </div>

      {/* Modal Klaim / Unduh Sertifikat */}
      {selectedCertUnit && (
        <CertificateModal
          isOpen={true}
          onClose={() => setSelectedCertUnit(null)}
          unitNumber={selectedCertUnit.number}
          unitTitle={selectedCertUnit.title}
        />
      )}

      {/* Modal Apa yang Baru / Riwayat Update */}
      <WhatsNewModal
        isOpen={showWhatsNew}
        onClose={() => setShowWhatsNew(false)}
      />

      {/* Modal Onboarding / Personalisasi Profil */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={(name, goal) => {
          completeOnboarding(name, goal);
          setShowOnboarding(false);
        }}
        initialName={progress.userName}
        initialGoal={progress.dailyGoal}
      />
    </MobileShell>
  );
}