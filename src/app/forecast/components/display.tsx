"use client";

import { cn } from "@/lib/utils/cn";

// Small bordered caption used in pane headers (archetype, "as of today", …).
export function MetaChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "w-fit rounded-prts border border-line bg-card px-2 py-1 font-mono text-[9.5px] tracking-widest text-muted-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatTile({
  label,
  value,
  sub,
  dataStat,
  tone,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  sub: React.ReactNode;
  dataStat?: string;
  tone?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-prts border border-line bg-card px-3 py-2.5",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-muted-2">
        {label}
      </div>
      <div
        data-stat={dataStat}
        className={cn(
          "font-display text-[26px] font-semibold leading-none",
          tone,
        )}
      >
        {value}
      </div>
      <div className="mt-1 font-mono text-[10px] text-muted-2">{sub}</div>
    </div>
  );
}

// Horizontal value bar with an optional benchmark tick.
export function Meter({
  value,
  color,
  tick,
  className,
}: {
  value: number;
  color: string;
  tick?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("relative block h-1 overflow-hidden bg-line-soft", className)}
    >
      <span
        className="absolute inset-y-0 left-0"
        style={{ width: value + "%", background: color }}
      />
      {tick != null && (
        <span
          className="absolute inset-y-0 w-px bg-fg/60"
          style={{ left: tick + "%" }}
        />
      )}
    </span>
  );
}
