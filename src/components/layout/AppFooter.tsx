"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, Sparkles } from "lucide-react";

export function AppFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`w-full mt-10 mb-4 select-none ${className}`}>
      <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-3xl p-5 text-center shadow-2xs flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center shadow-2xs">
            <Image
              src="/logo.png"
              alt="LogiKode"
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <span className="font-black text-sm text-slate-800 tracking-tight">
            Logi<span className="text-emerald-500">Kode</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
            <span>v1.0</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-500 font-medium max-w-[280px] leading-relaxed mb-3">
          Platform interaktif untuk menguasai logika pemrograman dan dasar IT sejak dini.
        </p>

        {/* Attribution to Core Dev Group */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium pt-3 border-t border-slate-100 w-full justify-center">
          <span>Inisiatif oleh</span>
          <a
            href="https://core-dev-group.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-700 hover:text-emerald-600 transition-colors inline-flex items-center gap-1 group"
          >
            <span className="group-hover:underline">Core Dev Group</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-slate-400 mt-1">
          © {new Date().getFullYear()} Core Dev Group • Indonesia
        </p>
      </div>
    </footer>
  );
}
