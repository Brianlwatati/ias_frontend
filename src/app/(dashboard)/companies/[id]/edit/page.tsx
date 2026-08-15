"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companiesApi } from "@/lib/api/companies";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ApiError } from "@/types/api";

const companyEditSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  code: z
    .string()
    .min(1, "Code is required")
    .max(20, "Keep the code short")
    .regex(/^[A-Za-z0-9_-]+$/, "Letters, numbers, - and _ only"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

type CompanyEditForm = z.infer<typeof companyEditSchema>;

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const queryClient = useQueryClient();
  const companyId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? (params.id[0] ?? "")
        : "";

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => companiesApi.get(companyId),
    enabled: !!companyId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyEditForm>({
    resolver: zodResolver(companyEditSchema),
  });

  useEffect(() => {
    if (!company) return;

    reset({
      name: company.name,
      code: company.code,
      email: company.email,
      phone: company.phone,
      status: company.status,
    });
  }, [company, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CompanyEditForm) => {
      if (!companyId) {
        throw new Error("Company id is required");
      }

      return companiesApi.update(companyId, {
        name: values.name,
        code: values.code,
        email: values.email,
        phone: values.phone,
        status: values.status,
      });
    },
    onSuccess: () => {
      toast.success("Company updated");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      router.push("/companies");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not update company");
    },
  });

  function onSubmit(values: CompanyEditForm) {
    mutate(values);
  }

  if (!companyId) {
    return (
      <div className="max-w-2xl space-y-6">
        <p className="text-danger">Company id is missing.</p>
      </div>
    );
  }

  if (isLoading || !company) {
    return (
      <div className="max-w-2xl space-y-6">
        <p className="text-slate-400">Loading company…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/companies"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to companies
        </Link>
        <h1 className="mt-3 text-xl font-semibold text-slate-100">
          Edit company
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Update company details and status.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <div className="grid grid-cols-2 gap-4">
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

        <div className="grid grid-cols-2 gap-4">
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

        <div className="space-y-1.5">
          <label
            htmlFor="status"
            className="text-sm font-medium text-slate-300"
          >
            Status
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

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/companies">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Update company"}
          </Button>
        </div>
      </form>
    </div>
  );
}
