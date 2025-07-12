import { createContext } from 'react';
import { User } from '../types';
import { RegisterResponse } from '../services/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<User['profile']>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 