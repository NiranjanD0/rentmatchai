import { USER_ROLES, type User, type UserRole } from '../constants/initialData';
import { apiRequest, jsonBody } from './apiClient';

const AUTH_SESSION_KEY = 'rentmatch_auth_session';

interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  role?: string | null;
  is_active: boolean;
  created_at: string;
}

interface ApiToken {
  access_token: string;
  token_type: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface RegisterData {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
}

function mapRole(role: string | null | undefined): UserRole {
  if (role === 'tenant') return USER_ROLES.TENANT;
  if (role === 'landlord') return USER_ROLES.PROPERTY_LISTER;
  throw new Error('The backend did not return a supported account role.');
}

function mapUser(apiUser: ApiUser, existing?: User): User {
  const role = apiUser.role == null ? existing?.role : mapRole(apiUser.role);
  if (!role) {
    throw new Error('The backend did not return a supported account role.');
  }

  return {
    id: apiUser.id,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    email: apiUser.email,
    passwordHash: null,
    role,
    phone: apiUser.phone || '',
    googleSub: null,
    avatar: existing?.avatar || '',
    company: existing?.company,
    isActive: apiUser.is_active,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.created_at,
    preferences: existing?.preferences ?? null,
  };
}

async function fetchCurrentUser(token: string, existing?: User): Promise<User> {
  const apiUser = await apiRequest<ApiUser>('/profile/', { token });
  return mapUser(apiUser, existing);
}

function readSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    return session?.token && session.user ? session : null;
  } catch {
    return null;
  }
}

export const JWTService = {
  isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
      if (!payload) return true;
      const claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '='))) as { exp?: number };
      return typeof claims.exp !== 'number' || claims.exp <= Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  },
};

export const AuthService = {
  async registerUser({
    firstName,
    lastName = '',
    email,
    password,
    role = USER_ROLES.TENANT,
    phone = '',
  }: RegisterData): Promise<AuthSession> {
    const normalizedEmail = email.trim().toLowerCase();
    await apiRequest<ApiUser>('/register', {
      method: 'POST',
      ...jsonBody({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: normalizedEmail,
        password,
        phone: phone.trim() || null,
        role: role === USER_ROLES.PROPERTY_LISTER ? 'landlord' : 'tenant',
      }),
    });
    return this.loginUser(normalizedEmail, password);
  },

  async loginUser(email: string, password: string): Promise<AuthSession> {
    const form = new URLSearchParams({ username: email.trim().toLowerCase(), password });
    const result = await apiRequest<ApiToken>('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const user = await fetchCurrentUser(result.access_token);
    const session = { token: result.access_token, user };
    this.setSession(session);
    return session;
  },

  async loginWithGoogle(
    idToken: string,
    preferredRole?: UserRole,
  ): Promise<AuthSession> {
    if (!idToken || typeof idToken !== 'string') {
      throw new Error('Google authentication failed: no credentials were provided.');
    }

    const backendRole = preferredRole === USER_ROLES.PROPERTY_LISTER ? 'landlord' : 'tenant';

    const result = await apiRequest<ApiToken>('/google', {
      method: 'POST',
      ...jsonBody({
        token: idToken,
        role: backendRole,
      }),
    });

    const user = await fetchCurrentUser(result.access_token);
    const session: AuthSession = { token: result.access_token, user };
    this.setSession(session);
    return session;
  },

  async restoreSession(): Promise<AuthSession | null> {
    const stored = readSession();
    if (!stored || JWTService.isTokenExpired(stored.token)) {
      this.clearSession();
      return null;
    }
    try {
      const user = await fetchCurrentUser(stored.token, stored.user);
      const session = { token: stored.token, user };
      this.setSession(session);
      return session;
    } catch {
      this.clearSession();
      return null;
    }
  },

  setSession(session: AuthSession): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    }
  },

  getSession(): AuthSession | null {
    return readSession();
  },

  clearSession(): void {
    if (typeof window !== 'undefined') window.localStorage.removeItem(AUTH_SESSION_KEY);
  },

  async sendPasswordResetOtp(email: string): Promise<{ message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    return apiRequest<{ message: string }>('/forgot-password', {
      method: 'POST',
      ...jsonBody({ email: normalizedEmail }),
    });
  },

  async verifyPasswordResetOtp(email: string, otp: string): Promise<{ valid: boolean; message?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    return apiRequest<{ valid: boolean; message?: string }>('/verify-otp', {
      method: 'POST',
      ...jsonBody({ email: normalizedEmail, otp: otp.trim() }),
    });
  },

  async resetPasswordWithOtp(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    return apiRequest<{ message: string }>('/reset-password', {
      method: 'POST',
      ...jsonBody({
        email: normalizedEmail,
        otp: otp.trim(),
        new_password: newPassword,
      }),
    });
  },

  async sendEmailVerificationOtp(email: string): Promise<{ message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    return apiRequest<{ message: string }>('/send-email-otp', {
      method: 'POST',
      ...jsonBody({ email: normalizedEmail }),
    });
  },

  async verifyEmailOtp(email: string, otp: string): Promise<{ valid: boolean; message?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    return apiRequest<{ valid: boolean; message?: string }>('/verify-email-otp', {
      method: 'POST',
      ...jsonBody({ email: normalizedEmail, otp: otp.trim() }),
    });
  },
};

export const ProfileService = {
  async updateProfile(
    token: string,
    user: User,
    changes: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'company' | 'preferences'>>,
  ): Promise<User> {
    const apiUser = await apiRequest<ApiUser>('/profile/', {
      method: 'PUT',
      token,
      ...jsonBody({
        first_name: changes.firstName,
        last_name: changes.lastName,
        phone: changes.phone,
      }),
    });
    const updatedUser = mapUser(apiUser, user);
    const preferences = changes.preferences;
    if (preferences) {
      await apiRequest('/profile/preferences', {
        method: 'PUT',
        token,
        ...jsonBody({
          budget_max: preferences.budgetMax,
          city: preferences.targetLocation,
        }),
      });
      updatedUser.preferences = { ...user.preferences, ...preferences } as User['preferences'];
    }
    if (changes.company !== undefined) updatedUser.company = changes.company;
    const session = AuthService.getSession();
    if (session?.token === token) AuthService.setSession({ token, user: updatedUser });
    return updatedUser;
  },

  async changePassword(token: string, oldPassword: string, newPassword: string): Promise<boolean> {
    await apiRequest<{ message: string }>('/profile/change-password', {
      method: 'POST',
      token,
      ...jsonBody({
        current_password: oldPassword,
        new_password: newPassword,
      }),
    });
    return true;
  },
};
