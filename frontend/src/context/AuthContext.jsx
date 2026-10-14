// React Context for Authentication & Profile State (Sprint 1)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthService, ProfileService, JWTService } from '../services/authService.js';
import { USER_ROLES } from '../constants/initialData.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global Auth Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [authModalRole, setAuthModalRole] = useState(USER_ROLES.TENANT);

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

  const openAuthModal = useCallback((tab = 'login', role = USER_ROLES.TENANT) => {
    setAuthModalTab(tab);
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await AuthService.loginUser(email, password);
    setUser(res.user);
    setToken(res.token);
    closeAuthModal();
    return res;
  }, [closeAuthModal]);

  const register = useCallback(async (data) => {
    const res = await AuthService.registerUser(data);
    setUser(res.user);
    setToken(res.token);
    closeAuthModal();
    return res;
  }, [closeAuthModal]);

  const loginWithGoogle = useCallback(async (preferredRole) => {
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

  const updateProfile = useCallback(async (profileData) => {
    if (!user) throw new Error('Not authenticated');
    const updated = await ProfileService.updateProfile(user.id, profileData);
    setUser(updated);
    return updated;
  }, [user]);

  const changePassword = useCallback(async (oldPass, newPass) => {
    if (!user) throw new Error('Not authenticated');
    return ProfileService.changePassword(user.id, oldPass, newPass);
  }, [user]);

  const value = {
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
