"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { companiesApi } from "@/lib/api/companies";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ApiError } from "@/types/api";
import type { CompanyProduct } from "@/types/company-product";

const subscriptionSchema = z.object({
  companyProductId: z.coerce.number().min(1, "Company product is required"),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(2, "Currency is required"),
  startsAt: z.string().min(1, "Start date is required"),
  endsAt: z.string().min(1, "End date is required"),
  autoRenew: z.boolean().default(true),
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;

export default function NewSubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId") ?? "";

  const { data: companiesData } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesApi.list({ page: 1, pageSize: 50 }),
  });

  const { data: companyProductsData, isLoading: isLoadingCompanyProducts } =
    useQuery({
      queryKey: ["company-products", companyId],
      queryFn: () => {
        if (!companyId) return [];
        return companiesApi.getCompanyProducts(companyId);
      },
      enabled: !!companyId,
    });

  const companyProducts = (companyProductsData ?? []) as CompanyProduct[];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionForm>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      amount: "1000.00",
      currency: "KES",
      autoRenew: true,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: SubscriptionForm) => {
      const toIsoDateTime = (value: string) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toISOString();
      };

      return subscriptionsApi.create(companyId, {
        companyProductId: values.companyProductId,
        amount: values.amount,
        currency: values.currency,
        startsAt: toIsoDateTime(values.startsAt),
        endsAt: toIsoDateTime(values.endsAt),
        autoRenew: values.autoRenew,
      });
    },
    onSuccess: () => {
      toast.success("Subscription created");
      router.push(`/subscriptions?companyId=${companyId}`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not create subscription");
    },
  });

  const selectedCompany = companiesData?.data.find(
    (company) => String(company.id) === companyId,
  );

  if (!companyId) {
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-slate-400">Please select a company first.</p>
        <Link href="/subscriptions">
          <Button type="button" variant="secondary">
            Back to subscriptions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-full space-y-6">
      <div>
        <Link
          href={`/subscriptions?companyId=${companyId}`}
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to subscriptions
        </Link>
        <h1 className="mt-3 text-xl font-semibold text-slate-100">
          New subscription
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Create a subscription for {selectedCompany?.name ?? "this company"}.
        </p>
      </div>

      <div className="card space-y-4">
        <label htmlFor="company" className="text-sm font-medium text-slate-300">
          Company
        </label>
        <select
          id="company"
          className="input"
          value={companyId}
          onChange={(e) =>
            router.push(`/subscriptions/new?companyId=${e.target.value}`)
          }
        >
          <option value="">Select a company</option>
          {companiesData?.data.map((company) => (
            <option key={company.id} value={String(company.id)}>
              {company.name} ({company.code})
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="card space-y-6"
      >
        <div className="space-y-1.5">
          <label
            htmlFor="companyProductId"
            className="text-sm font-medium text-slate-300"
          >
            Company product
          </label>
          <select
            id="companyProductId"
            className="input"
            disabled={isLoadingCompanyProducts || companyProducts.length === 0}
            defaultValue=""
            onChange={(e) =>
              setValue("companyProductId", Number(e.target.value), {
                shouldValidate: true,
              })
            }
          >
            <option value="">
              {isLoadingCompanyProducts
                ? "Loading company products..."
                : companyProducts.length === 0
                  ? "No company products available"
                  : "Select a company product"}
            </option>
            {companyProducts.map((companyProduct) => (
              <option key={companyProduct.id} value={companyProduct.id}>
                {companyProduct.productName} ({companyProduct.productCode})
              </option>
            ))}
          </select>
          {errors.companyProductId && (
            <p className="text-xs text-danger">
              {errors.companyProductId.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="amount"
            label="Amount"
            placeholder="1000.00"
            error={errors.amount?.message}
            {...register("amount")}
          />
          <Input
            id="currency"
            label="Currency"
            placeholder="KES"
            error={errors.currency?.message}
            {...register("currency")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="startsAt"
            type="datetime-local"
            label="Starts at"
            error={errors.startsAt?.message}
            {...register("startsAt")}
          />
          <Input
            id="endsAt"
            type="datetime-local"
            label="Ends at"
            error={errors.endsAt?.message}
            {...register("endsAt")}
          />
        </div>

        <div className="flex items-center gap-2">
          <input id="autoRenew" type="checkbox" {...register("autoRenew")} />
          <label htmlFor="autoRenew" className="text-sm text-slate-300">
            Auto renew
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href={`/subscriptions?companyId=${companyId}`}>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create subscription"}
          </Button>
        </div>
      </form>
    </div>
  );
}
