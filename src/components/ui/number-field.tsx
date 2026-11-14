"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

const COMMIT_DELAY = 250;

interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export function NumberField({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  id,
  className,
  disabled,
}: NumberFieldProps) {
  const [text, setText] = useState(String(value));
  const focused = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!focused.current) setText(String(value));
  }, [value]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function commit(raw: string, force: boolean) {
    const parsed = parseFloat(raw);
    if (Number.isNaN(parsed)) {
      if (force) setText(String(value));
      return;
    }
    let next = parsed;
    if (typeof min === "number") next = Math.max(min, next);
    if (typeof max === "number") next = Math.min(max, next);
    if (next !== value) onChange(next);
    if (force) setText(String(next));
  }

  function schedule(raw: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      commit(raw, false);
    }, COMMIT_DELAY);
  }

  function flush(raw: string) {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    commit(raw, true);
  }

  return (
    <div
      className={cn(
        "flex items-center rounded-prts border border-line bg-inset focus-within:border-accent/60",
        disabled && "opacity-50",
        className,
      )}
    >
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={text}
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(e) => {
          setText(e.target.value);
          schedule(e.target.value);
        }}
        onBlur={(e) => {
          focused.current = false;
          flush(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") flush(e.currentTarget.value);
        }}
        className="w-full min-w-0 bg-transparent px-2.5 py-2 text-[14.5px] text-fg outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      {unit && (
        <span className="shrink-0 pr-2.5 font-mono text-[9px] tracking-widest text-muted-2">
          {unit}
        </span>
      )}
    </div>
  );
}
