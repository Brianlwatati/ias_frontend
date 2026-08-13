"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsApi } from "@/lib/api/products";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ApiError } from "@/types/api";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  code: z
    .string()
    .min(1, "Code is required")
    .max(20, "Keep the code short")
    .regex(/^[A-Za-z0-9_-]+$/, "Letters, numbers, - and _ only"),
  description: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({ resolver: zodResolver(productSchema) });

  const { mutate, isPending } = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      toast.success("Product created");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/products");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not create product");
    },
  });

  function onSubmit(values: ProductForm) {
    mutate({
      name: values.name,
      code: values.code.toUpperCase(),
      description: values.description || undefined,
    });
  }

  return (
    <div className="w-full max-w-none space-y-6">
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
        <h1 className="mt-3 text-xl font-semibold text-slate-100">
          New product
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Products can then be granted to companies by code.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card w-full space-y-4">
        <Input
          id="name"
          label="Name"
          placeholder="Rental Management System"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="code"
          label="Code"
          placeholder="RM"
          error={errors.code?.message}
          {...register("code")}
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
            placeholder="This is a rental management system api"
            {...register("description")}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/products">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
