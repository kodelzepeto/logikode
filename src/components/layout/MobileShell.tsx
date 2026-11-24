"use client";

import React, { useState, useSyncExternalStore } from "react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { WhatsNewModal } from "@/components/modals/WhatsNewModal";
import {
  APP_VERSION,
  getLastSeenVersion,
  shouldShowWhatsNew,
} from "@/lib/version";

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

function getSnapshot() {
  const lastSeen = getLastSeenVersion();
  return shouldShowWhatsNew(APP_VERSION, lastSeen);
}

function getServerSnapshot() {
  return false;
}

export function MobileShell({
  children,
  showTopBar = true,
  showBottomNav = true,
  className = "",
  disableAutoWhatsNew = false,
}: MobileShellProps) {
  const needsWhatsNew = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [isDismissed, setIsDismissed] = useState(false);

  const shouldShowModal = !disableAutoWhatsNew && needsWhatsNew && !isDismissed;

  return (
    <div className="min-h-screen bg-slate-200/60 flex flex-col justify-between items-center selection:bg-emerald-200 selection:text-emerald-900">
      <div className="w-full max-w-md min-h-screen bg-slate-50 border-x border-slate-200/70 shadow-sm relative flex flex-col pb-20">
        {showTopBar && <TopBar />}
        <main className={`flex-1 w-full flex flex-col ${className}`}>
          {children}
        </main>
        {showBottomNav && <BottomNav />}
      </div>

      {/* Modal Otomatis "Apa yang Baru" (Muncul 1x saat ada update baru) */}
      <WhatsNewModal
        isOpen={shouldShowModal}
        onClose={() => setIsDismissed(true)}
      />
    </div>
  );
}
