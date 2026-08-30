export interface Category {
  id: string;
  name: string;
  productsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDTO {
  name: string;
}

export interface UpdateCategoryDTO {
  name: string;
}
