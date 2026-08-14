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
}

export interface UpdateCompanyPayload extends Partial<CreateCompanyPayload> {
  status?: CompanyStatus;
}
