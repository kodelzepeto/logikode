"use client";

import React, { useState, useSyncExternalStore } from "react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { WhatsNewModal } from "@/components/modals/WhatsNewModal";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { useUserProgress } from "@/hooks/useUserProgress";
import {
  APP_VERSION,
  getLastSeenVersion,
  shouldShowWhatsNew,
} from "@/lib/version";
import {
  shouldShowOnboarding,
  ONBOARDING_STORAGE_KEY,
} from "@/lib/onboarding";

interface MobileShellProps {
  children: React.ReactNode;
  showTopBar?: boolean;
  showBottomNav?: boolean;
  className?: string;
  disableAutoWhatsNew?: boolean;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getWhatsNewSnapshot() {
  const lastSeen = getLastSeenVersion();
  return shouldShowWhatsNew(APP_VERSION, lastSeen);
}

function getOnboardingSnapshot() {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(window.localStorage.getItem(ONBOARDING_STORAGE_KEY));
  } catch {
    return false;
  }
}

function getServerSnapshotFalse() {
  return false;
}

export function MobileShell({
  children,
  showTopBar = true,
  showBottomNav = true,
  className = "",
  disableAutoWhatsNew = false,
}: MobileShellProps) {
  const { progress, isLoaded, completeOnboarding } = useUserProgress();

  const needsWhatsNew = useSyncExternalStore(
    subscribe,
    getWhatsNewSnapshot,
    getServerSnapshotFalse
  );

  const hasOnboardingStorageFlag = useSyncExternalStore(
    subscribe,
    getOnboardingSnapshot,
    getServerSnapshotFalse
  );

  const [isWhatsNewDismissed, setIsWhatsNewDismissed] = useState(false);
  const [isOnboardingDismissed, setIsOnboardingDismissed] = useState(false);

  // Evaluasi apakah onboarding 3-slide harus muncul otomatis
  const needsOnboarding =
    isLoaded &&
    !isOnboardingDismissed &&
    shouldShowOnboarding(
      progress.onboardingCompleted,
      progress.completedLevels.length,
      hasOnboardingStorageFlag
    );

  // WhatsNew hanya muncul jika bukan pengguna baru yang sedang perlu onboarding
  const shouldShowWhatsNewModal =
    !disableAutoWhatsNew &&
    needsWhatsNew &&
    !isWhatsNewDismissed &&
    !needsOnboarding;

  return (
    <div className="min-h-screen bg-slate-200/60 flex flex-col justify-between items-center selection:bg-emerald-200 selection:text-emerald-900">
      <div className="w-full max-w-md min-h-screen bg-slate-50 border-x border-slate-200/70 shadow-sm relative flex flex-col pb-20">
        {showTopBar && <TopBar />}
        <main className={`flex-1 w-full flex flex-col ${className}`}>
          {children}
        </main>
        {showBottomNav && <BottomNav />}
      </div>

      {/* Modal Onboarding 3-Slide untuk Pengguna Baru */}
      <OnboardingModal
        isOpen={needsOnboarding}
        onClose={() => setIsOnboardingDismissed(true)}
        onComplete={(name, goal) => {
          completeOnboarding(name, goal);
          setIsOnboardingDismissed(true);
        }}
        initialName={progress.userName}
        initialGoal={progress.dailyGoal}
      />

      {/* Modal Otomatis "Apa yang Baru" (Muncul 1x saat ada update baru) */}
      <WhatsNewModal
        isOpen={shouldShowWhatsNewModal}
        onClose={() => setIsWhatsNewDismissed(true)}
      />
    </div>
  );
}
