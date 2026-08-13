import { cn } from "@/lib/utils";

const TONES = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  neutral: "bg-slate-500/15 text-slate-300",
  brand: "bg-brand-500/15 text-brand-300",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span className={cn("badge", TONES[tone], className)}>{children}</span>
  );
}
