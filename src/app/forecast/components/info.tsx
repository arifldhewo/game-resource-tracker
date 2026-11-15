"use client";

import { createContext, useContext, useState } from "react";
import { InfoSheet } from "./info-sheet";

// The provider owns the open key so an InfoButton rendered outside it cannot
// silently do nothing: the context default stays a no-op only for safety.
const InfoContext = createContext<(key: string) => void>(() => {});

export const useInfo = () => useContext(InfoContext);

export function InfoProvider({ children }: { children: React.ReactNode }) {
  const [infoKey, setInfoKey] = useState<string | null>(null);
  return (
    <InfoContext.Provider value={setInfoKey}>
      {children}
      <InfoSheet infoKey={infoKey} onClose={() => setInfoKey(null)} />
    </InfoContext.Provider>
  );
}

export function InfoButton({ k, label }: { k: string; label?: string }) {
  const open = useInfo();
  return (
    <button
      type="button"
      data-info={k}
      aria-label={label ?? "Detail"}
      onClick={() => open(k)}
      className="inline-flex size-6 shrink-0 items-center justify-center text-muted-2 transition hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5" stroke="currentColor" />
        <path d="M6 5v4M6 3v.6" stroke="currentColor" strokeLinecap="round" />
      </svg>
    </button>
  );
}
