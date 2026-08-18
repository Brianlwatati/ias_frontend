"use client";

import { BriefcaseBusiness } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Company } from "@/types/company";

export interface CompanyDetailsSectionProps {
  company: Company;
  register: any;
  errors: Record<string, { message?: string } | undefined>;
  isPending: boolean;
  handleSubmit: any;
  onSubmit: (values: {
    name: string;
    code: string;
    email: string;
    phone: string;
  }) => void;
}

export function CompanyDetailsSection({
  company,
  register,
  errors,
  isPending,
  handleSubmit,
  onSubmit,
}: CompanyDetailsSectionProps) {
  return (
    <section className="card space-y-5 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand-500/10 p-2 text-brand-300">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Company details
          </h2>
          <p className="text-sm text-slate-400">
            Basic information for {company.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            id="name"
            label="Company name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            id="code"
            label="Code"
            error={errors.code?.message}
            {...register("code")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            id="email"
            type="email"
            label="Company email"
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save details"}
          </Button>
        </div>
      </form>
    </section>
  );
}
