import { apiClient, tokenStorage } from './api';
import {
  AuthResponseData,
  LoginDTO,
  RegisterDTO,
  User,
} from '../types/auth';
import { ApiSuccessResponse } from '../types/api';

export const authService = {
  async login(credentials: LoginDTO): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiSuccessResponse<AuthResponseData>>(
      '/auth/login',
      credentials
    );
    const authData = response.data.data;
    tokenStorage.setSession(authData.tokens, authData.user);
    return authData;
  },

  async register(data: RegisterDTO): Promise<User> {
    const response = await apiClient.post<ApiSuccessResponse<User>>(
      '/auth/registro',
      data
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore backend logout errors during local cleanup
    } finally {
      tokenStorage.clearSession();
    }
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiSuccessResponse<{ user: User }>>(
      '/auth/perfil'
    );
    const user = response.data.data.user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('vyrtium_user', JSON.stringify(user));
    }
    return user;
  },
};
