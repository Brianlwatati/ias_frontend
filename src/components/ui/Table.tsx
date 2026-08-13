import { cn } from "@/lib/utils";

export function Table({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-surface-border", className)}>
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-surface-border bg-surface-raised/60 text-xs uppercase tracking-wide text-slate-400">
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-surface-border">{children}</tbody>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-surface-raised/40">{children}</tr>;
}

export function TableCell({
  children,
  header = false,
}: {
  children: React.ReactNode;
  header?: boolean;
}) {
  const Tag = header ? "th" : "td";
  return <Tag className="px-4 py-3 align-middle">{children}</Tag>;
}
