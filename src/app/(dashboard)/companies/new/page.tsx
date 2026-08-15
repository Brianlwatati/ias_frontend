"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companiesApi } from "@/lib/api/companies";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ApiError } from "@/types/api";

const companySchema = z.object({
  name: z.string().min(2, "Company name is required"),
  code: z
    .string()
    .min(1, "Code is required")
    .max(20, "Keep the code short")
    .regex(/^[A-Za-z0-9_-]+$/, "Letters, numbers, - and _ only"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
});

type CompanyForm = z.infer<typeof companySchema>;

export default function NewCompanyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyForm>({ resolver: zodResolver(companySchema) });

  const { mutate, isPending } = useMutation({
    mutationFn: companiesApi.create,
    onSuccess: () => {
      toast.success("Company created");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      router.push("/companies");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not create company");
    },
  });

  function onSubmit(values: CompanyForm) {
    mutate({
      name: values.name,
      code: values.code.toUpperCase(),
      email: values.email,
      phone: values.phone,
    });
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <Link
          href="/companies"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to companies
        </Link>
        <h1 className="mt-3 text-xl font-semibold text-slate-100">
          New company
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Create a company tenant with the core company details.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="name"
            label="Company name"
            placeholder="Sarah Bakery Limited"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            id="code"
            label="Code"
            placeholder="SBL"
            error={errors.code?.message}
            {...register("code")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="email"
            type="email"
            label="Company email"
            placeholder="sarahbakery@gmail.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="phone"
            label="Phone"
            placeholder="+254705161122"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/companies">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create company"}
          </Button>
        </div>
      </form>
    </div>
  );
}
