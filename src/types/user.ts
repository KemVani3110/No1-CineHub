// src/types/user.ts

import { UserRole, AuthProvider, User as BaseUser } from './auth';

export interface UserProfile extends BaseUser {
    preferences?: UserPreferences;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
        marketing: boolean;
    };
    privacy: {
        showEmail: boolean;
        showActivity: boolean;
        showWatchlist: boolean;
    };
}

export interface UserStats {
    watchlistCount: number;
    reviewCount: number;
    ratingCount: number;
    lastActive?: Date;
    totalWatchTime?: number;
    favoriteGenres?: string[];
    favoriteActors?: string[];
    favoriteDirectors?: string[];
}

export interface UserActivity {
    id: string;
    type: 'watchlist' | 'review' | 'rating' | 'login' | 'profile_update';
    description: string;
    metadata?: any;
    createdAt: Date;
}

// Admin-specific types
export interface AdminUserView extends BaseUser {
    stats: UserStats;
    recentActivity: UserActivity[];
}

// User search and filtering
export interface UserSearchParams {
    query?: string;
    role?: UserRole;
    provider?: AuthProvider;
    isActive?: boolean;
    emailVerified?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
    sortBy?: 'name' | 'email' | 'createdAt' | 'lastLoginAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

// User management actions
export interface UserAction {
    type: 'activate' | 'deactivate' | 'delete' | 'change_role' | 'reset_password';
    userId: string;
    metadata?: any;
}

// User session
export interface UserSession {
    id: string;
    userId: string;
    deviceInfo: {
        browser: string;
        os: string;
        device: string;
        ip: string;
    };
    lastActive: Date;
    createdAt: Date;
    expiresAt: Date;
}

// User notification preferences
export interface UserNotificationSettings {
    email: {
        enabled: boolean;
        frequency: 'immediate' | 'daily' | 'weekly';
        types: {
            watchlist: boolean;
            reviews: boolean;
            system: boolean;
            marketing: boolean;
        };
    };
    push: {
        enabled: boolean;
        types: {
            watchlist: boolean;
            reviews: boolean;
            system: boolean;
        };
    };
}

// User security settings
export interface UserSecuritySettings {
    twoFactorEnabled: boolean;
    twoFactorMethod?: 'authenticator' | 'sms' | 'email';
    loginNotifications: boolean;
    sessionTimeout: number;
    lastPasswordChange: Date;
    trustedDevices: {
        id: string;
        name: string;
        lastUsed: Date;
    }[];
}

// User export data
export interface UserExportData {
    profile: UserProfile;
    preferences: UserPreferences;
    stats: UserStats;
    activity: UserActivity[];
    sessions: UserSession[];
    notifications: UserNotificationSettings;
    security: UserSecuritySettings;
}