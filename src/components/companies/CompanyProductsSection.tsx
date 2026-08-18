"use client";

import { Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface CompanyProductsProps {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  status: string;
}

export interface CompanyProductsSectionProps {
  companyProducts: CompanyProductsProps[];
  products: Array<{ id: string | number; name: string; code: string }>;
  selectedProductId: string;
  setSelectedProductId: (value: string) => void;
  onAssign: () => void;
  isAssigning: boolean;
  onStatusChange?: (productId: number, status: string) => void;
  updatingProductId?: number | null;
}

export function CompanyProductsSection({
  companyProducts,
  products,
  selectedProductId,
  setSelectedProductId,
  onAssign,
  isAssigning,
  onStatusChange,
  updatingProductId,
}: CompanyProductsSectionProps) {
  const availableProducts = products.filter(
    (product) =>
      !companyProducts.some(
        (companyProduct) =>
          String(companyProduct.productId) === String(product.id),
      ),
  );

  return (
    <section className="card space-y-5 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-success/10 p-2 text-success">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Company products
          </h2>
          <p className="text-sm text-slate-400">
            Assign products available on this company
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <select
          className="input flex-1"
          value={selectedProductId}
          onChange={(event) => setSelectedProductId(event.target.value)}
        >
          <option value="">Select a product</option>
          {availableProducts.map((product) => (
            <option key={product.id} value={String(product.id)}>
              {product.name} ({product.code})
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="secondary"
          className="whitespace-nowrap"
          disabled={isAssigning || !selectedProductId}
          onClick={onAssign}
        >
          {isAssigning ? "Assigning…" : "Assign product"}
        </Button>
      </div>

      <div className="space-y-2">
        {companyProducts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-700 p-3 text-sm text-slate-400">
            No products assigned yet.
          </p>
        ) : (
          companyProducts.map((companyProduct) => (
            <div
              key={companyProduct.id}
              className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-2"
            >
              <div>
                <div className="font-medium text-slate-100">
                  {companyProduct.productName}
                </div>
                <div className="text-xs text-slate-400">
                  {companyProduct.productCode}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onStatusChange && (
                  <select
                    className="input h-auto px-2 py-1 text-sm"
                    value={companyProduct.status}
                    onChange={(e) =>
                      onStatusChange(companyProduct.id, e.target.value)
                    }
                    disabled={updatingProductId === companyProduct.id}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                )}
                <Badge
                  tone={
                    companyProduct.status === "ACTIVE"
                      ? "success"
                      : companyProduct.status === "SUSPENDED"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {updatingProductId === companyProduct.id
                    ? "Updating…"
                    : companyProduct.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
