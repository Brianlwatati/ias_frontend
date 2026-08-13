"use client";

import { useQuery } from "@tanstack/react-query";
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

export default function ProductsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list({ page: 1, pageSize: 25 }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Products</h1>
          <p className="mt-1 text-sm text-slate-400">
            Applications/services each company can grant access to.
          </p>
        </div>
        <Link href="/products/new">
          <Button>New product</Button>
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell header>Name</TableCell>
            <TableCell header>Code</TableCell>
            <TableCell header>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell>Loading products…</TableCell>
            </TableRow>
          )}
          {isError && (
            <TableRow>
              <TableCell>
                Could not load products. Is ias_backend running?
              </TableCell>
            </TableRow>
          )}
          {data?.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                <code className="text-slate-400">{product.code}</code>
              </TableCell>
              <TableCell>
                <Badge
                  tone={product.status === "ACTIVE" ? "success" : "neutral"}
                >
                  {product.status === "ACTIVE" ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
