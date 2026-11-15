"use client";

import { cn } from "@/lib/utils/cn";
import type { Status } from "@/types/forecast";

const STATUS_CLASS: Record<Status, string> = {
  GUARANTEED: "bg-success text-card border-success",
  FEASIBLE: "text-success border-success/25 bg-success/10",
  LIKELY: "text-amber border-amber/30 bg-amber/10",
  DEFICIT: "text-danger border-danger/25 bg-danger/10",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.08em] whitespace-nowrap",
        STATUS_CLASS[status],
      )}
    >
      <span
        className={cn(
          "size-1 rounded-full",
          status === "GUARANTEED" ? "bg-card" : "bg-current",
        )}
      />
      {status}
    </span>
  );
}
