import { apiClient } from './api';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilterParams,
} from '../types/product';
import { PaginationMeta, PaginatedData } from '../types/api';

interface BackendProductsListResponse {
  success: boolean;
  data: Product[];
  meta: PaginationMeta;
}

export const productService = {
  // Public Landing Catalog (No Auth Required)
  async getPublicProducts(
    params?: ProductFilterParams
  ): Promise<PaginatedData<Product>> {
    const response = await apiClient.get<BackendProductsListResponse>(
      '/publico/productos',
      {
        params,
      }
    );
    return {
      items: response.data.data || [],
      meta: response.data.meta || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  },

  // Private Admin Products List
  async getProducts(
    params?: ProductFilterParams
  ): Promise<PaginatedData<Product>> {
    const response = await apiClient.get<BackendProductsListResponse>(
      '/products',
      {
        params,
      }
    );
    return {
      items: response.data.data || [],
      meta: response.data.meta || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<{
      success: boolean;
      data: Product;
    }>(`/products/${id}`);
    return response.data.data;
  },

  async createProduct(data: CreateProductDTO): Promise<Product> {
    if (data.image) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock.toString());
      formData.append('categoryId', data.categoryId);
      formData.append('image', data.image);

      const response = await apiClient.post<{
        success: boolean;
        data: Product;
      }>('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    }

    const response = await apiClient.post<{
      success: boolean;
      data: Product;
    }>('/products', data);
    return response.data.data;
  },

  async updateProduct(
    id: string,
    data: UpdateProductDTO
  ): Promise<Product> {
    if (data.image) {
      const formData = new FormData();
      if (data.name !== undefined) formData.append('name', data.name);
      if (data.description !== undefined)
        formData.append('description', data.description);
      if (data.price !== undefined)
        formData.append('price', data.price.toString());
      if (data.stock !== undefined)
        formData.append('stock', data.stock.toString());
      if (data.categoryId !== undefined)
        formData.append('categoryId', data.categoryId);
      formData.append('image', data.image);

      const response = await apiClient.put<{
        success: boolean;
        data: Product;
      }>(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    }

    const response = await apiClient.put<{
      success: boolean;
      data: Product;
    }>(`/products/${id}`, data);
    return response.data.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
