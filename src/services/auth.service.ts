import { apiClient, tokenStorage } from './api';
import {
  AuthResponseData,
  AuthTokens,
  LoginDTO,
  RegisterDTO,
  User,
} from '../types/auth';
import { ApiSuccessResponse } from '../types/api';

interface BackendLoginPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginDTO): Promise<AuthResponseData> {
    const response = await apiClient.post<
      ApiSuccessResponse<BackendLoginPayload>
    >('/auth/login', credentials);

    const { accessToken, refreshToken, user } = response.data.data;
    const tokens: AuthTokens = { accessToken, refreshToken };

    tokenStorage.setSession(tokens, user);
    return { user, tokens };
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
    const response = await apiClient.get<ApiSuccessResponse<User>>(
      '/auth/perfil'
    );
    const user = response.data.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('vyrtium_user', JSON.stringify(user));
    }
    return user;
  },
};
