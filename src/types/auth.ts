/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/auth.ts

import { User as NextAuthUser } from "next-auth";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role: string;
}

export interface ProfileUpdateData {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
}

export interface ForgotPasswordData {
    email: string;
    token?: string;
    newPassword?: string;
}

export interface AuthState {
    user: AuthUser | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

export interface AuthStore {
    user: AuthUser | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    setUser: (user: AuthUser | null) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<AuthUser>) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

export interface SocialAuthProvider {
    id: string;
    name: string;
    type: string;
    signIn: () => Promise<void>;
}

export interface User {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    role: UserRole;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    provider?: AuthProvider;
    providerId?: string;
}

export enum UserRole {
    USER = 'user',
    MODERATOR = 'moderator',
    ADMIN = 'admin'
}

export enum AuthProvider {
    EMAIL = 'email',
    GOOGLE = 'google',
    FACEBOOK = 'facebook'
}

export interface AuthSession {
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: Date;
    issuedAt: Date;
}

export interface SocialAuthResult {
    user: User;
    token: string;
    refreshToken: string;
    isNewUser: boolean;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirm {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AuthError {
    code: AuthErrorCode;
    message: string;
    field?: string;
}

export enum AuthErrorCode {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
    ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
    WEAK_PASSWORD = 'WEAK_PASSWORD',
    INVALID_TOKEN = 'INVALID_TOKEN',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    SOCIAL_AUTH_ERROR = 'SOCIAL_AUTH_ERROR',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

export interface AuthConfig {
    tokenExpiry: number;
    refreshTokenExpiry: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
}

export interface LoginResponse {
    success: boolean;
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
    message?: string;
}

export interface RegisterResponse {
    success: boolean;
    user: User;
    message: string;
    requiresEmailVerification?: boolean;
}

export interface LogoutResponse {
    success: boolean;
    message: string;
}

export interface EmailVerificationRequest {
    email: string;
}

export interface EmailVerificationConfirm {
    token: string;
    email: string;
}

// Firebase Auth types
export interface FirebaseUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    providerId: string;
}

export interface FirebaseAuthResult {
    user: FirebaseUser;
    credential?: any;
    operationType?: string;
    additionalUserInfo?: {
        isNewUser: boolean;
        providerId: string;
        profile?: any;
    };
}

// NextAuth.js integration types
export interface NextAuthSession {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: UserRole;
    };
    expires: string;
}

export interface NextAuthToken {
    sub?: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    role?: UserRole;
    provider?: AuthProvider;
    iat?: number;
    exp?: number;
    jti?: string;
}