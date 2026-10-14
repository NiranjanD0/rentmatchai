'use client';

// React Context for Authentication & Profile State (Sprint 1)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthService, ProfileService, JWTService, type RegisterData } from '../services/authService';
import { USER_ROLES, type User, type UserRole } from '../constants/initialData';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLister: boolean;
  isTenant: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  register: (data: RegisterData) => Promise<{ user: User; token: string }>;
  loginWithGoogle: (preferredRole?: UserRole) => Promise<{ user: User; token: string }>;
  logout: () => void;
  updateProfile: (profileData: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'company' | 'preferences'>>) => Promise<User>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
  isAuthModalOpen: boolean;
  openAuthModal: (tab?: string, role?: UserRole) => void;
  closeAuthModal: () => void;
  authModalTab: string;
  setAuthModalTab: React.Dispatch<React.SetStateAction<string>>;
  authModalRole: UserRole;
  setAuthModalRole: React.Dispatch<React.SetStateAction<UserRole>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Global Auth Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<string>('login'); // 'login' | 'register'
  const [authModalRole, setAuthModalRole] = useState<UserRole>(USER_ROLES.TENANT);

  // Initialize session on mount
  useEffect(() => {
    try {
      const session = AuthService.getSession();
      if (session && session.user && session.token) {
        if (!JWTService.isTokenExpired(session.token)) {
          setUser(session.user);
          setToken(session.token);
        } else {
          AuthService.clearSession();
        }
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const openAuthModal = useCallback((tab = 'login', role: UserRole = USER_ROLES.TENANT) => {
    setAuthModalTab(tab);
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await AuthService.loginUser(email, password);
    setUser(res.user);
    setToken(res.token);
    closeAuthModal();
    return res;
  }, [closeAuthModal]);

  const register = useCallback(async (data: RegisterData) => {
    const res = await AuthService.registerUser(data);
    setUser(res.user);
    setToken(res.token);
    closeAuthModal();
    return res;
  }, [closeAuthModal]);

  const loginWithGoogle = useCallback(async (preferredRole?: UserRole) => {
    const res = await AuthService.loginWithGoogle(preferredRole);
    setUser(res.user);
    setToken(res.token);
    closeAuthModal();
    return res;
  }, [closeAuthModal]);

  const logout = useCallback(() => {
    AuthService.clearSession();
    setUser(null);
    setToken(null);
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'company' | 'preferences'>>) => {
    if (!user) throw new Error('Not authenticated');
    const updated = await ProfileService.updateProfile(user.id, profileData);
    setUser(updated);
    return updated;
  }, [user]);

  const changePassword = useCallback(async (oldPass: string, newPass: string) => {
    if (!user) throw new Error('Not authenticated');
    return ProfileService.changePassword(user.id, oldPass, newPass);
  }, [user]);

  const value: AuthContextValue = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLister: user?.role === USER_ROLES.PROPERTY_LISTER,
    isTenant: user?.role === USER_ROLES.TENANT,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    changePassword,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    authModalRole,
    setAuthModalRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
