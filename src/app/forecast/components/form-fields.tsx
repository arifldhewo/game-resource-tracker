"use client";

import { InfoButton } from "./info";
import { cn } from "@/lib/utils/cn";

const CONTROL =
  "w-full rounded-prts border border-line bg-inset px-2.5 py-2 text-[14px] text-fg outline-none focus:border-accent/60";

export function Field({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-col gap-1.5", className)}>{children}</div>;
}

export function Label({
  children,
  info,
  htmlFor,
}: {
  children: React.ReactNode;
  info?: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-muted-2"
    >
      <span className="flex flex-wrap items-center gap-1.5">{children}</span>
      {info && <InfoButton k={info} />}
    </label>
  );
}

export function Select({
  value,
  onChange,
  children,
  id,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(CONTROL, "appearance-none", className)}
    >
      {children}
    </select>
  );
}

// Equal-weight choice row. "display" carries the display face and raised
// background, "mono" the mono face on an inset background.
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
  columns,
  variant = "display",
}: {
  options: readonly { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  columns: 2 | 4;
  variant?: "display" | "mono";
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("grid gap-1", columns === 2 ? "grid-cols-2" : "grid-cols-4")}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-prts border px-2 py-2",
              variant === "display"
                ? "font-display text-[11px] tracking-[0.08em]"
                : "font-mono text-[10px] tracking-[0.06em]",
              active
                ? "border-accent/50 bg-accent/10 text-accent"
                : cn(
                    "border-line text-muted hover:text-fg",
                    variant === "display" ? "bg-card-2" : "bg-inset",
                  ),
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
