"use client";

export function PaneHead({
  kicker,
  title,
  right,
}: {
  kicker: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-col gap-2 min-[600px]:flex-row min-[600px]:items-end min-[600px]:justify-between">
      <div>
        <div className="font-mono text-[9.5px] tracking-[0.14em] text-accent">
          {kicker}
        </div>
        <h2 className="m-0 font-display text-[23px] uppercase leading-[1.05] tracking-[0.03em] min-[760px]:text-[26px]">
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}

export function MiniCard({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-prts border border-line bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <h3 className="m-0 font-display text-[14px] uppercase tracking-[0.06em]">
          {title}
        </h3>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
