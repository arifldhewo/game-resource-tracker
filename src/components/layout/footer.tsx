"use client";

import Image from "next/image";
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
      <div className="flex flex-col items-center gap-3">
        <a
          href="https://ko-fi.com/ariflaksonodhewo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xs transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <Image
            src="/kofi-button.svg"
            alt="Support me on Ko-fi"
            width={223}
            height={30}
            className="h-7 w-auto"
          />
        </a>
        <p>
          PRTS FORECAST · {label} · v{version}
        </p>
      </div>
    </footer>
  );
}
