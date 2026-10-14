// Sprint 1: Authentication & Profile Service
// Implements JWT Service, Password Hasher, Auth Service, and Profile Service
// Aligned with Sprint 1 Class Diagram and State Machine

import { INITIAL_USERS, USER_ROLES, type User, type UserRole } from '../constants/initialData';

const USERS_STORAGE_KEY = 'rentmatch_users_db';
const AUTH_SESSION_KEY = 'rentmatch_auth_session';

// --- Password Hasher Component (Sprint 1 Class Diagram) ---
export const PasswordHasher = {
  // Simple deterministic hash simulation for client-side prototype
  // In production, bcrypt / argon2 is handled by FastAPI
  hashPassword(plainPassword: string): string {
    if (!plainPassword) return '';
    let hash = 0;
    for (let i = 0; i < plainPassword.length; i++) {
      const char = plainPassword.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `hash_v1_${Math.abs(hash).toString(16)}_${plainPassword.length}`;
  },

  verifyPassword(plainPassword: string, storedHash: string): boolean {
    if (!plainPassword || !storedHash) return false;
    // Also allow plaintext fallback for preseeded demo accounts
    if (storedHash === plainPassword) return true;
    return this.hashPassword(plainPassword) === storedHash;
  }
};

// --- JWT Service (Sprint 1 Class Diagram: Stateless JWT Design) ---
export const JWTService = {
  generateToken(userId: string, role: UserRole, email: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const payload = btoa(JSON.stringify({
      sub: userId,
      role: role,
      email: email,
      iat: now,
      exp: now + 60 * 60 * 24 // 24 hours expiry
    }));
    const signature = btoa(`sig_${userId}_${now}`);
    return `${header}.${payload}.${signature}`;
  },

  decodeToken(token: string): Record<string, unknown> | null {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payloadStr = atob(parts[1]);
      return JSON.parse(payloadStr);
    } catch {
      return null;
    }
  },

  extractUserId(token: string): string | null {
    const claims = this.decodeToken(token);
    return (claims?.sub as string) || null;
  },

  extractRole(token: string): UserRole | null {
    const claims = this.decodeToken(token);
    return (claims?.role as UserRole) || null;
  },

  isTokenExpired(token: string): boolean {
    const claims = this.decodeToken(token);
    if (!claims || !claims.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return (claims.exp as number) < now;
  },

  validateToken(token: string): boolean {
    if (!token) return false;
    return !this.isTokenExpired(token);
  }
};

// --- Helper to get and save users table in localStorage ---
function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

function saveStoredUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
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

// --- AuthService (Sprint 1 Class Diagram) ---
export const AuthService = {
  // Get all registered users (for debugging / admin)
  getAllUsers(): User[] {
    return getStoredUsers();
  },

  // State: Validating Registration -> User Registered or Registration Failed
  async registerUser({ firstName, lastName, email, password, role = USER_ROLES.TENANT, phone = '' }: RegisterData): Promise<{ user: User; token: string }> {
    // Artificial slight delay to demonstrate validating state in UI
    await new Promise((resolve) => setTimeout(resolve, 350));

    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    // Check unique email (Sprint 1 State Machine: check fields and role, unique email)
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      const error = Object.assign(new Error('An account with this email address already exists. Please log in.'), { code: 'EMAIL_EXISTS' });
      throw error;
    }

    if (!firstName?.trim()) {
      throw Object.assign(new Error('Please enter your first name.'), { code: 'INVALID_NAME' });
    }

    if (!password || password.length < 6) {
      throw Object.assign(new Error('Password must be at least 6 characters long.'), { code: 'WEAK_PASSWORD' });
    }

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      firstName: firstName.trim(),
      lastName: lastName?.trim() || '',
      email: normalizedEmail,
      passwordHash: PasswordHasher.hashPassword(password),
      role: role,
      phone: phone.trim() || '',
      googleSub: null,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName + ' ' + lastName)}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: role === USER_ROLES.TENANT ? {
        budgetMax: 25000,
        preferredBhk: '2',
        targetLocation: 'Gandhinagar'
      } : null
    };

    users.push(newUser);
    saveStoredUsers(users);

    // Issue JWT token
    const token = JWTService.generateToken(newUser.id, newUser.role, newUser.email);
    this.setSession({ token, user: newUser });

    return { user: newUser, token };
  },

  // State: Validating Login -> Authenticated or Login Failed
  async loginUser(email: string, plainPassword: string): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      throw Object.assign(new Error('No user found with this email. Please check or create an account.'), { code: 'USER_NOT_FOUND' });
    }

    const isMatch = PasswordHasher.verifyPassword(plainPassword, user.passwordHash || '');
    if (!isMatch) {
      throw Object.assign(new Error('Invalid password. Please verify and retry.'), { code: 'INVALID_CREDENTIALS' });
    }

    if (!user.isActive) {
      throw Object.assign(new Error('This account has been deactivated. Please contact support.'), { code: 'ACCOUNT_DEACTIVATED' });
    }

    const token = JWTService.generateToken(user.id, user.role, user.email);
    this.setSession({ token, user });

    return { user, token };
  },

  // "Continue with Google" OAuth integration
  async loginWithGoogle(preferredRole: UserRole = USER_ROLES.TENANT): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const users = getStoredUsers();
    // Simulate a Google profile returned from Google OAuth 2.0
    const googleEmail = 'google.user@example.com';
    let user = users.find((u) => u.email === googleEmail);

    if (!user) {
      user = {
        id: `usr-google-${Date.now()}`,
        firstName: 'Google',
        lastName: 'Account',
        email: googleEmail,
        passwordHash: null,
        role: preferredRole,
        phone: '+91 99887 76655',
        googleSub: 'google-oauth2|10928374650192',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          budgetMax: 20000,
          preferredBhk: '2',
          targetLocation: 'Gandhinagar'
        }
      };
      users.push(user);
      saveStoredUsers(users);
    }

    const token = JWTService.generateToken(user.id, user.role, user.email);
    this.setSession({ token, user });

    return { user, token };
  },

  // Session & Local Storage persistence
  setSession({ token, user }: AuthSession): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ token, user }));
    } catch {
      // ignore
    }
  },

  getSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      if (!session?.token || JWTService.isTokenExpired(session.token)) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(AUTH_SESSION_KEY);
    } catch {
      // ignore
    }
  },

  // Role Authorization Check (Sprint 1 Class Diagram: authorizeRole)
  authorizeRole(token: string, requiredRole: UserRole): boolean {
    if (!JWTService.validateToken(token)) return false;
    const role = JWTService.extractRole(token);
    return role === requiredRole;
  }
};

// --- ProfileService (Sprint 1 Class Diagram) ---
export const ProfileService = {
  getProfile(userId: string): User | null {
    const users = getStoredUsers();
    return users.find((u) => u.id === userId) || null;
  },

  async updateProfile(userId: string, { firstName, lastName, phone, company, preferences }: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'company' | 'preferences'>>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      throw new Error('User profile not found.');
    }

    const current = users[index];
    const updated: User = {
      ...current,
      firstName: firstName !== undefined ? firstName.trim() : current.firstName,
      lastName: lastName !== undefined ? lastName.trim() : current.lastName,
      phone: phone !== undefined ? phone.trim() : current.phone,
      company: company !== undefined ? company?.trim() : current.company,
      preferences: preferences !== undefined ? { ...current.preferences, ...preferences } as User['preferences'] : current.preferences,
      updatedAt: new Date().toISOString()
    };

    users[index] = updated;
    saveStoredUsers(users);

    // Update active session if currently logged in
    const session = AuthService.getSession();
    if (session && session.user.id === userId) {
      AuthService.setSession({ token: session.token, user: updated });
    }

    return updated;
  },

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found.');

    const user = users[index];
    if (user.passwordHash && !PasswordHasher.verifyPassword(oldPassword, user.passwordHash)) {
      throw new Error('Current password does not match.');
    }

    user.passwordHash = PasswordHasher.hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();
    users[index] = user;
    saveStoredUsers(users);

    return true;
  }
};
