import { Metadata } from "next";
import { GlossaryClient } from "@/components/glossary/GlossaryClient";

export const metadata: Metadata = {
  title: "Kamus Koding Mini — Istilah Logika & IT Ramah Pelajar | LogiKode",
  description:
    "Kamus istilah logika pemrograman dan konsep IT esensial (Variabel, Boolean, Loop, Array, Fungsi, SQL, Debugging) dengan analogi dunia nyata dan contoh kode praktis tanpa server.",
  keywords: [
    "kamus koding",
    "istilah pemrograman",
    "belajar logika koding",
    "kamus IT",
    "variabel",
    "boolean",
    "looping",
    "sql",
    "logikode",
    "core dev group",
  ],
  openGraph: {
    title: "Kamus Koding Mini — LogiKode by Core Dev Group",
    description:
      "Pelajari 25+ istilah logika koding esensial dengan penjelasan ramah pemula, analogi dunia nyata, dan contoh sintaks praktis.",
    url: "https://logi-kode.vercel.app/glossary",
    siteName: "LogiKode",
    locale: "id_ID",
    type: "website",
  },
};

export default function GlossaryPage() {
  return <GlossaryClient />;
}
