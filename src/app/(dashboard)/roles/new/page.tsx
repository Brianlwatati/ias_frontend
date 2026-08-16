"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { rolesApi } from "@/lib/api/roles";
import { productsApi } from "@/lib/api/products";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ApiError } from "@/types/api";

const roleSchema = z.object({
  name: z.string().min(2, "Name is required"),
  code: z
    .string()
    .min(1, "Code is required")
    .max(30, "Keep the code short")
    .regex(/^[A-Za-z0-9_-]+$/, "Letters, numbers, - and _ only"),
  scope: z.enum(["SYSTEM", "PRODUCT"]),
  productId: z.string().min(1, "Select a product"),
  roleScopeKey: z.string().min(1, "Scope key is required"),
  description: z.string().optional(),
});

type RoleForm = z.infer<typeof roleSchema>;

export default function NewRolePage() {
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      scope: "SYSTEM",
      productId: "",
      roleScopeKey: "SYSTEM",
      code: "",
    },
  });

  const scope = watch("scope");
  const selectedProductId = watch("productId");
  const roleName = watch("name");

  const selectedProduct = products?.data.find(
    (product) => String(product.id) === selectedProductId,
  );

  const generatedScopeKey =
    scope === "PRODUCT" && selectedProductId
      ? `PRODUCT:${selectedProductId}`
      : "SYSTEM";

  const generatedCode = (() => {
    const rawName = (roleName ?? "").trim();
    if (!rawName) return "";

    const normalized = rawName
      .replace(/[^a-zA-Z0-9\s_-]+/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.replace(/[^a-zA-Z0-9_-]/g, ""))
      .join("_");

    const base = normalized ? normalized.toUpperCase() : "ROLE";

    if (scope !== "PRODUCT" || !selectedProduct?.code) {
      return base;
    }

    return `${selectedProduct.code.toUpperCase()}_${base}`;
  })();

  useEffect(() => {
    setValue("roleScopeKey", generatedScopeKey, { shouldDirty: true });
    setValue("code", generatedCode, { shouldDirty: true });
  }, [generatedScopeKey, generatedCode, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: rolesApi.create,
    onSuccess: () => {
      toast.success("Role created");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      router.push("/roles");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not create role");
    },
  });

  function onSubmit(values: RoleForm) {
    mutate({
      name: values.name,
      code: values.code.trim().toUpperCase(),
      scope: values.scope,
      productId: values.scope === "PRODUCT" ? Number(values.productId) : 10000,
      roleScopeKey: values.roleScopeKey,
      description: values.description || undefined,
    });
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <Link
          href="/roles"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to roles
        </Link>
        <h1 className="mt-3 text-xl font-semibold text-slate-100">New role</h1>
        <p className="mt-1 text-sm text-slate-400">
          System roles apply platform-wide; product roles apply within one
          product.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card space-y-4 width-full"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="scope"
              className="text-sm font-medium text-slate-300"
            >
              Scope
            </label>
            <select id="scope" className="input" {...register("scope")}>
              <option value="SYSTEM">System</option>
              <option value="PRODUCT">Product</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="productId"
              className="text-sm font-medium text-slate-300"
            >
              Product
            </label>
            <Controller
              name="productId"
              control={control}
              render={({ field }) => (
                <select id="productId" className="input" {...field}>
                  <option value="">Select a product…</option>
                  {products?.data.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.code})
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.productId && (
              <p className="text-xs text-danger">{errors.productId.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="name"
            label="Role name"
            placeholder="Company Admin"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            id="code"
            label="Code"
            placeholder="HR_FINANCE"
            value={generatedCode || ""}
            onChange={(event) =>
              setValue("code", event.target.value, { shouldDirty: true })
            }
            error={errors.code?.message}
          />
        </div>

        <Input
          id="roleScopeKey"
          label="Scope key"
          placeholder={generatedScopeKey || "SYSTEM"}
          value={generatedScopeKey}
          onChange={(event) =>
            setValue("roleScopeKey", event.target.value, { shouldDirty: true })
          }
          error={errors.roleScopeKey?.message}
        />

        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-300"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="input resize-none"
            placeholder="Can manage users and settings within their own company"
            {...register("description")}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/roles">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create role"}
          </Button>
        </div>
      </form>
    </div>
  );
}
