import { apiClient } from './api';
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../types/category';
import { ApiSuccessResponse } from '../types/api';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<
      ApiSuccessResponse<{ items: Category[] }>
    >('/categories');
    return response.data.data.items;
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await apiClient.get<
      ApiSuccessResponse<{ category: Category }>
    >(`/categories/${id}`);
    return response.data.data.category;
  },

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    const response = await apiClient.post<
      ApiSuccessResponse<{ category: Category }>
    >('/categories', data);
    return response.data.data.category;
  },

  async updateCategory(
    id: string,
    data: UpdateCategoryDTO
  ): Promise<Category> {
    const response = await apiClient.put<
      ApiSuccessResponse<{ category: Category }>
    >(`/categories/${id}`, data);
    return response.data.data.category;
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};
