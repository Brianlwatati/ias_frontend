"use client";

import { Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ManagedUser } from "@/types/user";

export interface UserStatusSectionProps {
  user: ManagedUser;
  register: any;
  errors: Record<string, { message?: string } | undefined>;
  isPending: boolean;
  handleSubmit: any;
  onSubmit: (values: { status: "ACTIVE" | "INACTIVE" | "PENDING" }) => void;
}

export function UserStatusSection({
  user,
  register,
  errors,
  isPending,
  handleSubmit,
  onSubmit,
}: UserStatusSectionProps) {
  return (
    <section className="card space-y-5 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-info/10 p-2 text-info">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Status</h2>
          <p className="text-sm text-slate-400">Manage user account status</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="status"
            className="text-sm font-medium text-slate-300"
          >
            Account status
          </label>
          <select
            id="status"
            className="input"
            {...register("status")}
            defaultValue={user.status}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="PENDING">PENDING</option>
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
