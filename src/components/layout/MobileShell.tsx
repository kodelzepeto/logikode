"use client";

import React from "react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

interface MobileShellProps {
  children: React.ReactNode;
  showTopBar?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

export function MobileShell({
  children,
  showTopBar = true,
  showBottomNav = true,
  className = "",
}: MobileShellProps) {
  return (
    <div className="min-h-screen bg-slate-200/60 flex flex-col justify-between items-center selection:bg-emerald-200 selection:text-emerald-900">
      <div className="w-full max-w-md min-h-screen bg-slate-50 border-x border-slate-200/70 shadow-sm relative flex flex-col pb-20">
        {showTopBar && <TopBar />}
        <main className={`flex-1 w-full flex flex-col ${className}`}>
          {children}
        </main>
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
