"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ShoppingBag, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Belajar",
      href: "/",
      icon: BookOpen,
      isActive: pathname === "/" || pathname.startsWith("/lesson"),
      activeColor: "text-emerald-500",
      activeBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Toko",
      href: "/shop",
      icon: ShoppingBag,
      isActive: pathname === "/shop",
      activeColor: "text-amber-500",
      activeBg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Profil",
      href: "/profile",
      icon: User,
      isActive: pathname === "/profile",
      activeColor: "text-indigo-500",
      activeBg: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 shadow-lg max-w-md mx-auto transition-all">
      <div className="flex items-center justify-around px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all duration-200 select-none ${
                item.isActive
                  ? `${item.activeBg} font-black scale-105`
                  : "text-slate-400 hover:text-slate-600 font-medium"
              }`}
            >
              <Icon
                className={`w-6 h-6 transition-transform ${
                  item.isActive ? "scale-110" : ""
                }`}
              />
              <span className="text-[11px] mt-0.5 tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
