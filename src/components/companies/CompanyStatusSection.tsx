"use client";

import { Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Company } from "@/types/company";

export interface CompanyStatusSectionProps {
  company: Company;
  register: any;
  errors: Record<string, { message?: string } | undefined>;
  isPending: boolean;
  handleSubmit: any;
  onSubmit: (values: { status: "ACTIVE" | "INACTIVE" | "SUSPENDED" }) => void;
}

export function CompanyStatusSection({
  company,
  register,
  errors,
  isPending,
  handleSubmit,
  onSubmit,
}: CompanyStatusSectionProps) {
  return (
    <section className="card space-y-5 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-warning/10 p-2 text-warning">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Status</h2>
          <p className="text-sm text-slate-400">
            Managed separately through the status API
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="status"
            className="text-sm font-medium text-slate-300"
          >
            Current status
          </label>
          <select
            id="status"
            className="input"
            {...register("status")}
            defaultValue={company.status}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
          {errors.status && (
            <p className="text-xs text-danger">{errors.status.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="secondary" disabled={isPending}>
            {isPending ? "Updating…" : "Update status"}
          </Button>
        </div>
      </form>
    </section>
  );
}
