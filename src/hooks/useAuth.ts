import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

import { useState, useEffect } from 'react';
import { User } from '../types';

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
    const savedUser = localStorage.getItem('visa-genius-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('visa-genius-user');
      }
    }
    setLoading(false);
  }, []);

  const saveUser = (userData: User) => {
    localStorage.setItem('visa-genius-user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        isAuthenticated: true
      };
      
      saveUser(mockUser);
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Simulate Google OAuth
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name,
        isAuthenticated: true
      };
      
      saveUser(mockUser);
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('visa-genius-user');
    setUser(null);
  };

  const updateProfile = async (profile: Partial<User['profile']>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Simulate API call
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