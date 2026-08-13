export interface CompanyAdminPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateCompanyPayload {
  name: string;
  code: string;
  productCodes: string[];
  admin: CompanyAdminPayload;
  email: string;
  phone: string;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone: string;
}

export interface UpdateCompanyPayload extends Partial<CreateCompanyPayload> {
  status?: string;
}
