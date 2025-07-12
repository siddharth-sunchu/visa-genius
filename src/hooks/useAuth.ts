import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

import { useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = authService.getStoredUser();
    if (savedUser) {
      setUser({
        ...savedUser,
        isAuthenticated: true
      });
    }
    setLoading(false);
  }, []);

  const saveUser = (userData: User) => {
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      const authenticatedUser: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        isAuthenticated: true
      };
      
      saveUser(authenticatedUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Simulate Google OAuth - you can implement actual Google OAuth here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: '1',
        email: 'user@gmail.com',
        name: 'Siddharth Sunchu',
        isAuthenticated: true
      };
      
      saveUser(mockUser);
    } catch (error) {
      throw new Error('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const response = await authService.register({ email, password, name });
      
      // Don't auto-login after registration, let them login manually
      // This follows the common pattern where registration requires email verification
      // or explicit login for security
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<User['profile']>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Simulate API call - implement actual profile update API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser: User = {
        ...user,
        profile: { ...user.profile, ...profile } as User['profile']
      };
      
      saveUser(updatedUser);
    } catch (error) {
      throw new Error('Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile
  };
}; 