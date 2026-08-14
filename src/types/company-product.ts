export interface CompanyProduct {
  id: number;
  companyId: number;
  companyName: string;
  companyCode: string;
  productId: number;
  productName: string;
  productCode: string;
  status: string;
  grantedAt: string;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
