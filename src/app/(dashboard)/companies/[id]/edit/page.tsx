"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companiesApi } from "@/lib/api/companies";
import { productsApi } from "@/lib/api/products";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { Badge } from "@/components/ui/Badge";
import { CompanyDetailsSection } from "@/components/companies/CompanyDetailsSection";
import { CompanyStatusSection } from "@/components/companies/CompanyStatusSection";
import { CompanyProductsSection } from "@/components/companies/CompanyProductsSection";
import { CompanySubscriptionsSection } from "@/components/companies/CompanySubscriptionsSection";
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
});

const companyStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

type CompanyEditForm = z.infer<typeof companyEditSchema>;
type CompanyStatusForm = z.infer<typeof companyStatusSchema>;

export default function EditCompanyPage() {
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

  const { data: productsResponse } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list({ page: 1, pageSize: 100 }),
  });

  const { data: companyProducts = [] } = useQuery({
    queryKey: ["company-products", companyId],
    queryFn: () => companiesApi.getCompanyProducts(companyId),
    enabled: !!companyId,
  });

  const {
    data: subscriptionsData,
    isLoading: isLoadingSubscriptions,
    isError: isSubscriptionsError,
  } = useQuery({
    queryKey: ["subscriptions", companyId],
    queryFn: () => subscriptionsApi.list(companyId, { page: 1, pageSize: 20 }),
    enabled: !!companyId,
  });

  const products = productsResponse?.data ?? [];
  const subscriptions = subscriptionsData?.data ?? [];
  const [selectedProductId, setSelectedProductId] = useState("");
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(
    null,
  );

  const detailForm = useForm<CompanyEditForm>({
    resolver: zodResolver(companyEditSchema),
  });

  const statusForm = useForm<CompanyStatusForm>({
    resolver: zodResolver(companyStatusSchema),
    defaultValues: { status: "ACTIVE" },
  });

  useEffect(() => {
    if (!company) return;

    detailForm.reset({
      name: company.name,
      code: company.code,
      email: company.email,
      phone: company.phone,
    });
    statusForm.reset({ status: company.status });
  }, [company, detailForm, statusForm]);

  const { mutate: updateCompany, isPending: isUpdatingCompany } = useMutation({
    mutationFn: (values: CompanyEditForm) => {
      if (!companyId) {
        throw new Error("Company id is required");
      }

      return companiesApi.update(companyId, {
        name: values.name,
        code: values.code,
        email: values.email,
        phone: values.phone,
      });
    },
    onSuccess: () => {
      toast.success("Company details updated");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not update company details");
    },
  });

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: (values: CompanyStatusForm) => {
      if (!companyId) {
        throw new Error("Company id is required");
      }

      return companiesApi.updateStatus(companyId, values.status);
    },
    onSuccess: () => {
      toast.success("Company status updated");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not update company status");
    },
  });

  const { mutate: assignProduct, isPending: isAssigningProduct } = useMutation({
    mutationFn: ({ productId }: { productId: string | number }) => {
      if (!companyId) {
        throw new Error("Company id is required");
      }

      return companiesApi.assignProduct(companyId, productId);
    },
    onSuccess: () => {
      toast.success("Product assigned to company");
      setSelectedProductId("");
      queryClient.invalidateQueries({
        queryKey: ["company-products", companyId],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not assign product");
    },
  });

  const { mutate: updateProductStatus, isPending: isUpdatingProductStatus } =
    useMutation({
      mutationFn: ({
        productId,
        status,
      }: {
        productId: number;
        status: string;
      }) => {
        if (!companyId) {
          throw new Error("Company id is required");
        }

        return companiesApi.updateCompanyProductStatus(
          companyId,
          productId,
          status as "ACTIVE" | "INACTIVE" | "SUSPENDED",
        );
      },
      onSuccess: () => {
        toast.success("Product status updated");
        setUpdatingProductId(null);
        queryClient.invalidateQueries({
          queryKey: ["company-products", companyId],
        });
      },
      onError: (error: ApiError) => {
        toast.error(error.message ?? "Could not update product status");
        setUpdatingProductId(null);
      },
    });

  const onCompanySubmit = (values: CompanyEditForm) => {
    updateCompany(values);
  };

  const onStatusSubmit = (values: CompanyStatusForm) => {
    updateStatus(values);
  };

  if (!companyId) {
    return (
      <div className="max-w-3xl space-y-6">
        <p className="text-danger">Company id is missing.</p>
      </div>
    );
  }

  if (isLoading || !company) {
    return (
      <div className="max-w-3xl space-y-6">
        <p className="text-slate-400">Loading company…</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <Link
          href="/companies"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to companies
        </Link>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">
              {company.name}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Company profile, product access, and subscriptions.
            </p>
          </div>
          <Badge
            tone={
              company.status === "ACTIVE"
                ? "success"
                : company.status === "SUSPENDED"
                  ? "warning"
                  : "neutral"
            }
          >
            {company.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CompanyDetailsSection
          company={company}
          register={detailForm.register}
          errors={detailForm.formState.errors}
          isPending={isUpdatingCompany}
          handleSubmit={detailForm.handleSubmit}
          onSubmit={onCompanySubmit}
        />

        <CompanyStatusSection
          company={company}
          register={statusForm.register}
          errors={statusForm.formState.errors}
          isPending={isUpdatingStatus}
          handleSubmit={statusForm.handleSubmit}
          onSubmit={onStatusSubmit}
        />
      </div>

      <CompanyProductsSection
        companyProducts={companyProducts}
        products={products}
        selectedProductId={selectedProductId}
        setSelectedProductId={setSelectedProductId}
        onAssign={() => {
          if (!selectedProductId) return;
          assignProduct({ productId: selectedProductId });
        }}
        isAssigning={isAssigningProduct}
        onStatusChange={(productId, status) => {
          setUpdatingProductId(productId);
          updateProductStatus({ productId, status });
        }}
        updatingProductId={updatingProductId}
      />

      <CompanySubscriptionsSection
        subscriptions={subscriptions}
        isLoading={isLoadingSubscriptions}
        isError={isSubscriptionsError}
      />
    </div>
  );
}
