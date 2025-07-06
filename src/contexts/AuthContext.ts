import { createContext } from 'react';
import { User } from '../types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User['profile']>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 