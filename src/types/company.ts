export type CompanyStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface CreateCompanyPayload {
  name: string;
  code: string;
  email: string;
  phone: string;
}

export interface Company {
  id: number | string;
  name: string;
  code: string;
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone: string;
  // Not confirmed against the backend yet — optional so nothing breaks if
  // these fields aren't present in the API response. Used on receipts.
  address?: string;
  taxId?: string;
  logoUrl?: string;
}

export interface UpdateCompanyPayload extends Partial<CreateCompanyPayload> {
  status?: CompanyStatus;
}
