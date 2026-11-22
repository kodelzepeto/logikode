import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LogiKode — Belajar Logika Koding & Dasar IT",
    short_name: "LogiKode",
    description:
      "Platform belajar logika koding interaktif mobile-first bergaya Duolingo oleh Core Dev Group.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#10b981",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
