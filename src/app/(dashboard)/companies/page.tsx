"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companiesApi } from "@/lib/api/companies";
import { productsApi } from "@/lib/api/products";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function CompaniesPage() {
  const queryClient = useQueryClient();
  const [selectedProductIds, setSelectedProductIds] = useState<
    Record<string, string>
  >({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesApi.list({ page: 1, pageSize: 25 }),
  });

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list({ page: 1, pageSize: 100 }),
  });

  const products = useMemo(() => productsData?.data ?? [], [productsData]);

  const { mutate: assignProduct, isPending } = useMutation({
    mutationFn: ({
      companyId,
      productId,
    }: {
      companyId: string | number;
      productId: string | number;
    }) => companiesApi.assignProduct(companyId, productId),
    onSuccess: () => {
      toast.success("Product assigned to company");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Could not assign product to company");
    },
  });

  const handleAssign = (
    companyId: string | number,
    productId: string | number,
  ) => {
    if (!productId) {
      toast.error("Please select a product first");
      return;
    }

    assignProduct({ companyId, productId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Companies</h1>
          <p className="mt-1 text-sm text-slate-400">
            Tenants provisioned on this IAS instance.
          </p>
        </div>
        <Link href="/companies/new">
          <Button>New company</Button>
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell header>Name</TableCell>
            <TableCell header>Code</TableCell>
            <TableCell header>Status</TableCell>
            <TableCell header>Email</TableCell>
            <TableCell header>Phone</TableCell>
            <TableCell header>Assign product</TableCell>
            <TableCell header>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell>Loading companies…</TableCell>
            </TableRow>
          )}
          {isError && (
            <TableRow>
              <TableCell>
                Could not load companies. Is ias_backend running?
              </TableCell>
            </TableRow>
          )}
          {data?.data.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>
                <code className="text-slate-400">{company.code}</code>
              </TableCell>

              <TableCell>
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
              </TableCell>
              <TableCell>{company.email ?? "—"}</TableCell>
              <TableCell>{company.phone ?? "—"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <select
                    className="input h-9 min-w-[140px] px-2 py-1"
                    value={selectedProductIds[String(company.id)] ?? ""}
                    onChange={(e) =>
                      setSelectedProductIds((prev) => ({
                        ...prev,
                        [String(company.id)]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={String(product.id)}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                    disabled={
                      isPending || !selectedProductIds[String(company.id)]
                    }
                    onClick={() =>
                      handleAssign(
                        company.id,
                        selectedProductIds[String(company.id)] ?? "",
                      )
                    }
                  >
                    Assign
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Link href={`/companies/${company.id}/edit`}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                  >
                    Edit
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
