import { Category } from './category';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  image?: File;
  imageUrl?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  image?: File;
  imageUrl?: string;
}

export interface ProductFilterParams {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'price' | 'name' | 'stock';
  sortOrder?: 'ASC' | 'DESC';
}
