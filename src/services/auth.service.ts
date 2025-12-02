/**
 * AUTHENTICATION SERVICE
 * ======================
 * Handles all authentication-related API calls
 */

import apiClient, { handleApiError } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'auditor';
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'auditor';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// Backend API response structure
interface BackendAuthResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'auditor';
    lastLogin?: string;
  };
  token: string;
}

export interface UpdateDetailsData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<BackendAuthResponse>('/auth/register', data);
      
      console.log('📥 Backend Register Response:', response.data);
      
      // Transform backend response to match our interface
      const user: User = {
        _id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        role: response.data.data.role,
        createdAt: response.data.data.lastLogin || new Date().toISOString()
      };
      
      const authResponse: AuthResponse = {
        success: response.data.success,
        token: response.data.token,
        user: user
      };
      
      // Store token and user data
      if (authResponse.token) {
        localStorage.setItem('authToken', authResponse.token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ Stored in localStorage:', { token: '***', user });
      }
      
      return authResponse;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<BackendAuthResponse>('/auth/login', credentials);
      
      console.log('📥 Backend Login Response:', response.data);
      
      // Transform backend response to match our interface
      const user: User = {
        _id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        role: response.data.data.role,
        createdAt: response.data.data.lastLogin || new Date().toISOString()
      };
      
      const authResponse: AuthResponse = {
        success: response.data.success,
        token: response.data.token,
        user: user
      };
      
      // Store token and user data
      if (authResponse.token) {
        localStorage.setItem('authToken', authResponse.token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ Stored in localStorage:', { token: '***', user });
      }
      
      return authResponse;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user
   */
  async getMe(): Promise<User> {
    try {
      const response = await apiClient.get<BackendAuthResponse>('/auth/me');
      
      console.log('📥 Backend /me Response:', response.data);
      
      // Transform backend response to match our interface
      const user: User = {
        _id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        role: response.data.data.role,
        createdAt: response.data.data.lastLogin || new Date().toISOString()
      };
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user details
   */
  async updateDetails(data: UpdateDetailsData): Promise<User> {
    try {
      const response = await apiClient.put<{ success: boolean; user: User }>('/auth/update', data);
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data.user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      await apiClient.put('/auth/change-password', data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get stored user
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export default new AuthService();
