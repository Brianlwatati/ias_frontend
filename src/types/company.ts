export interface Company {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
}

export interface CreateCompanyPayload {
  name: string;
  slug: string;
  plan?: Company["plan"];
}

export interface UpdateCompanyPayload extends Partial<CreateCompanyPayload> {
  isActive?: boolean;
}
