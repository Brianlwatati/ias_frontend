"use client";

import { User } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ManagedUser } from "@/types/user";

export interface UserDetailsSectionProps {
  user: ManagedUser;
  register: any;
  errors: Record<string, { message?: string } | undefined>;
  isPending: boolean;
  handleSubmit: any;
  onSubmit: (values: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => void;
}

export function UserDetailsSection({
  user,
  register,
  errors,
  isPending,
  handleSubmit,
  onSubmit,
}: UserDetailsSectionProps) {
  return (
    <section className="card space-y-5 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand-500/10 p-2 text-brand-300">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">User details</h2>
          <p className="text-sm text-slate-400">
            Basic information for {user.firstName} {user.lastName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            id="firstName"
            label="First name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            id="lastName"
            label="Last name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            id="email"
            type="email"
            label="Email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="phone"
            label="Phone"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Role</label>
          <div className="rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100">
            {user.roleName || user.roleCode || "No role assigned"}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save details"}
          </Button>
        </div>
      </form>
    </section>
  );
}
