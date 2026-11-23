import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#10b981",
};

export const metadata: Metadata = {
  title: {
    default: "LogiKode — Belajar Logika Koding & Dasar IT",
    template: "%s | LogiKode",
  },
  description:
    "Platform edukasi logika koding dan dasar IT interaktif mobile-first berbahasa Indonesia bergaya Duolingo oleh Core Dev Group. Ringan, modal Rp 0, dan ramah kantong pelajar.",
  authors: [{ name: "Core Dev Group", url: "https://core-dev-group.my.id" }],
  creator: "Core Dev Group",
  publisher: "Core Dev Group",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://logi-kode.vercel.app"
  ),
  keywords: [
    "LogiKode",
    "Belajar Koding",
    "Logika Pemrograman",
    "Dasar IT",
    "Core Dev Group",
    "Kuis Koding",
    "Duolingo Koding Indonesia",
    "Kuis Algoritma",
    "Koding Pemula",
  ],
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "W0BaV53sZ9C7d0x3FCA30-apufMkGXpdzmZB7jHjjrQ",
  },
  openGraph: {
    title: "LogiKode — Belajar Logika Koding & Dasar IT",
    description:
      "Platform belajar logika koding interaktif mobile-first berbahasa Indonesia bergaya Duolingo oleh Core Dev Group.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://logi-kode.vercel.app",
    siteName: "LogiKode",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LogiKode — Belajar Logika Koding & Dasar IT",
    description:
      "Platform belajar logika koding interaktif mobile-first berbahasa Indonesia bergaya Duolingo oleh Core Dev Group.",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
