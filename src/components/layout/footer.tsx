"use client";

import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  "/": "LANDING",
  "/forecast": "PAHE BUILD",
  "/roadmap": "ROADMAP",
  "/settings": "SETTINGS",
};

export function Footer() {
  const pathname = usePathname();
  const normalized = pathname.replace(/\/$/, "") || "/";
  const label = LABELS[normalized] ?? "LANDING";
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";

  return (
    <footer className="mt-16 border-t border-line px-5.5 py-6 text-center font-mono text-[10px] tracking-widest text-muted-2">
      PRTS FORECAST · {label} · v{version}
    </footer>
  );
}
