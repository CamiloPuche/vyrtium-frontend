import { apiClient } from './api';
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../types/category';
import { ApiSuccessResponse } from '../types/api';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiSuccessResponse<Category[]>>(
      '/categories'
    );
    return response.data.data;
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await apiClient.get<ApiSuccessResponse<Category>>(
      `/categories/${id}`
    );
    return response.data.data;
  },

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    const response = await apiClient.post<ApiSuccessResponse<Category>>(
      '/categories',
      data
    );
    return response.data.data;
  },

  async updateCategory(
    id: string,
    data: UpdateCategoryDTO
  ): Promise<Category> {
    const response = await apiClient.put<ApiSuccessResponse<Category>>(
      `/categories/${id}`,
      data
    );
    return response.data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};
