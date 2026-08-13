"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companiesApi } from "@/lib/api/companies";
import { productsApi } from "@/lib/api/products";
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
  productCodes: z.array(z.string()).default([]),
  admin: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

type CompanyForm = z.infer<typeof companySchema>;

export default function NewCompanyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list({ page: 1, pageSize: 100 }),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: { productCodes: [] },
  });

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
      productCodes: values.productCodes,
      admin: values.admin,
    });
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
        <h1 className="mt-3 text-xl font-semibold text-slate-100">New company</h1>
        <p className="mt-1 text-sm text-slate-400">
          Creates the tenant and its first admin user in one step.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="card space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">Company details</h2>
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

          <div className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Products</span>
            {!products?.data.length && (
              <p className="text-xs text-slate-500">
                No products yet —{" "}
                <Link href="/products/new" className="text-brand-400 hover:underline">
                  create one first
                </Link>{" "}
                or leave this empty and assign products later.
              </p>
            )}
            <Controller
              name="productCodes"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {products?.data.map((product) => {
                    const checked = field.value.includes(product.code);
                    return (
                      <label
                        key={product.code}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                          checked
                            ? "border-brand-500 bg-brand-500/10 text-brand-300"
                            : "border-surface-border text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checked}
                          onChange={() =>
                            field.onChange(
                              checked
                                ? field.value.filter((c) => c !== product.code)
                                : [...field.value, product.code]
                            )
                          }
                        />
                        {product.name} ({product.code})
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">First admin user</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="admin.firstName"
              label="First name"
              placeholder="Sarah"
              error={errors.admin?.firstName?.message}
              {...register("admin.firstName")}
            />
            <Input
              id="admin.lastName"
              label="Last name"
              placeholder="Bakerys"
              error={errors.admin?.lastName?.message}
              {...register("admin.lastName")}
            />
          </div>
          <Input
            id="admin.email"
            type="email"
            label="Admin email"
            placeholder="sarahbakery@gmail.com"
            error={errors.admin?.email?.message}
            {...register("admin.email")}
          />
          <Input
            id="admin.password"
            type="password"
            label="Admin password"
            placeholder="••••••••"
            error={errors.admin?.password?.message}
            {...register("admin.password")}
          />
        </section>

        <div className="flex justify-end gap-3">
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
