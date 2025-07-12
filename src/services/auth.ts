import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  message: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export class AuthService {
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        API_ENDPOINTS.auth.login,
        credentials
      );
      
      if (response.token) {
        localStorage.setItem('visa-genius-token', response.token);
        localStorage.setItem('visa-genius-user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      
      if (status === 401 || status === 403) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
      
      throw new Error(message || 'Login failed. Please try again.');
    }
  }

  public async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiService.post<RegisterResponse>(
        API_ENDPOINTS.auth.register,
        userData
      );
      
      // Don't auto-login after registration
      // User will need to login separately for security
      
      return response;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      
      if (status === 409 || status === 400) {
        if (message && message.toLowerCase().includes('email')) {
          throw new Error('This email is already registered. Please use a different email or try logging in.');
        }
      }
      
      throw new Error(message || 'Registration failed. Please try again.');
    }
  }

  public async logout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.auth.logout);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('visa-genius-token');
      localStorage.removeItem('visa-genius-user');
    }
  }

  public async getAllUsers(): Promise<User[]> {
    try {
      return await apiService.get<User[]>(API_ENDPOINTS.users.getAll);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  public async healthCheck(): Promise<{ message: string }> {
    try {
      return await apiService.get<{ message: string }>(API_ENDPOINTS.health.check);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Health check failed');
    }
  }

  public getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('visa-genius-user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  public getStoredToken(): string | null {
    return localStorage.getItem('visa-genius-token');
  }

  public isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export const authService = new AuthService();