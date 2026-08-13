export interface Product {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  status?: string;
}
