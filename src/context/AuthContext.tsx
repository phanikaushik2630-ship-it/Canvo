import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { 
  getMeApi, 
  loginApi, 
  registerApi, 
  sendPasswordResetOtpApi, 
  verifyOtpAndResetPasswordApi, 
  removeStoredToken, 
  getStoredToken 
} from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  sendResetOtp: (email: string) => Promise<{ success: boolean; message: string; email: string; simulatedOtp?: string }>;
  verifyResetOtp: (email: string, otp: string, newPassword: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot_password';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot_password') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot_password'>('login');

  useEffect(() => {
    async function loadUser() {
      if (getStoredToken()) {
        try {
          const res = await getMeApi();
          setUser(res.user || res);
        } catch (err) {
          removeStoredToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    setUser(res.user || res);
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await registerApi(name, email, password);
    setUser(res.user || res);
    setIsAuthModalOpen(false);
  };

  const sendResetOtp = async (email: string) => {
    return await sendPasswordResetOtpApi(email);
  };

  const verifyResetOtp = async (email: string, otp: string, newPassword: string) => {
    const res = await verifyOtpAndResetPasswordApi(email, otp, newPassword);
    setUser(res.user || res);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      sendResetOtp,
      verifyResetOtp,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      setAuthModalMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
