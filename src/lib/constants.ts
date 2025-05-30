// src/lib/constants.ts

import { 
  TMDBMovieListType, 
  TMDBTVListType, 
} from '@/types/tmdb';
import { 
  MovieSortBy, 
  WatchStatus, 
  WatchlistPriority, 
  RecommendationReason,
  ReleaseDateType,
  MovieNotificationType 
} from '@/types/movie';
import { 
  TVShowSortBy,
  TVNotificationType
} from '@/types/tv';
import { ToastType } from '@/types/common';
import {
  ReviewSortBy,
  ReviewReportReason,
  ReviewReportStatus,
} from '@/types/review';
import {
  CommentReportReason,
  CommentReportStatus,
} from '@/types/comment';
import {
  ActivityType,
  AdminAction,
} from '@/types/user';
import {
  UserRole,
  AuthProvider,
  AuthErrorCode
} from '@/types/auth';

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// TMDB Configuration
export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  SECURE_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY || '',
  DEFAULT_LANGUAGE: 'en-US',
  DEFAULT_REGION: 'US',
  ADULT_CONTENT: false,
} as const;

// Image Sizes
export const IMAGE_SIZES = {
  poster: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
  backdrop: ['w300', 'w780', 'w1280', 'original'],
  profile: ['w45', 'w185', 'h632', 'original'],
  logo: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
  still: ['w92', 'w185', 'w300', 'original'],
} as const;

// Default Image Sizes for different use cases
export const DEFAULT_IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_MOVIE_LIMIT: 20,
  DEFAULT_TV_LIMIT: 20,
  SEARCH_LIMIT: 20,
} as const;

// Movie Categories and Lists
export const MOVIE_LISTS: Record<TMDBMovieListType, string> = {
  popular: 'Popular Movies',
  top_rated: 'Top Rated Movies',
  now_playing: 'Now Playing',
  upcoming: 'Upcoming Movies',
} as const;

export const TV_LISTS: Record<TMDBTVListType, string> = {
  popular: 'Popular TV Shows',
  top_rated: 'Top Rated TV Shows',
  on_the_air: 'Currently Airing',
  airing_today: 'Airing Today',
} as const;

// Sort Options
export const MOVIE_SORT_OPTIONS = [
  { value: MovieSortBy.POPULARITY, label: 'Most Popular' },
  { value: MovieSortBy.RATING, label: 'Highest Rated' },
  { value: MovieSortBy.RELEASE_DATE, label: 'Newest First' },
  { value: MovieSortBy.TITLE, label: 'A-Z' },
  { value: MovieSortBy.REVENUE, label: 'Highest Grossing' },
] as const;

export const SORT_ORDERS = [
  { value: 'desc' as const, label: 'Descending' },
  { value: 'asc' as const, label: 'Ascending' },
] as const;

// Watch Status Options
export const WATCH_STATUS_OPTIONS = [
  { value: WatchStatus.NOT_STARTED, label: 'Not Started', color: '#6B7280' },
  { value: WatchStatus.WATCHING, label: 'Currently Watching', color: '#3B82F6' },
  { value: WatchStatus.COMPLETED, label: 'Completed', color: '#10B981' },
  { value: WatchStatus.ON_HOLD, label: 'On Hold', color: '#F59E0B' },
  { value: WatchStatus.DROPPED, label: 'Dropped', color: '#EF4444' },
  { value: WatchStatus.PLAN_TO_WATCH, label: 'Plan to Watch', color: '#8B5CF6' },
] as const;

// Watchlist Priority Options
export const WATCHLIST_PRIORITY_OPTIONS = [
  { value: WatchlistPriority.LOW, label: 'Low Priority', color: '#6B7280' },
  { value: WatchlistPriority.MEDIUM, label: 'Medium Priority', color: '#F59E0B' },
  { value: WatchlistPriority.HIGH, label: 'High Priority', color: '#EF4444' },
  { value: WatchlistPriority.URGENT, label: 'Urgent', color: '#DC2626' },
] as const;

// Rating System
export const RATING_SYSTEM = {
  MIN_RATING: 0.5,
  MAX_RATING: 5,
  STEP: 0.5,
  DEFAULT_RATING: 0,
} as const;

export const RATING_LABELS = {
  0.5: 'Terrible',
  1: 'Awful',
  1.5: 'Bad',
  2: 'Poor',
  2.5: 'Mediocre',
  3: 'Average',
  3.5: 'Good',
  4: 'Great',
  4.5: 'Excellent',
  5: 'Perfect',
} as const;

// Genres (TMDB Genre IDs)
export const MOVIE_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
} as const;

export const TV_GENRES = {
  ACTION_ADVENTURE: 10759,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  KIDS: 10762,
  MYSTERY: 9648,
  NEWS: 10763,
  REALITY: 10764,
  SCIENCE_FICTION: 10765,
  SOAP: 10766,
  TALK: 10767,
  WAR_POLITICS: 10768,
  WESTERN: 37,
} as const;

// Date and Time
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  FULL: 'EEEE, MMMM dd, yyyy',
  YEAR_ONLY: 'yyyy',
  MONTH_YEAR: 'MMM yyyy',
} as const;

export const TIME_FORMATS = {
  SHORT: 'HH:mm',
  LONG: 'HH:mm:ss',
  AM_PM: 'h:mm a',
} as const;

// Release Date Types
export const RELEASE_DATE_TYPES = {
  [ReleaseDateType.PREMIERE]: 'Premiere',
  [ReleaseDateType.THEATRICAL_LIMITED]: 'Theatrical (Limited)',
  [ReleaseDateType.THEATRICAL]: 'Theatrical',
  [ReleaseDateType.DIGITAL]: 'Digital',
  [ReleaseDateType.PHYSICAL]: 'Physical',
  [ReleaseDateType.TV]: 'TV',
} as const;

// Recommendation Reasons
export const RECOMMENDATION_REASONS = {
  [RecommendationReason.SIMILAR_GENRE]: 'Similar Genre',
  [RecommendationReason.SIMILAR_MOVIE]: 'Similar Movie',
  [RecommendationReason.SAME_DIRECTOR]: 'Same Director',
  [RecommendationReason.SAME_CAST]: 'Same Cast',
  [RecommendationReason.SAME_COLLECTION]: 'Same Collection',
  [RecommendationReason.TRENDING]: 'Trending',
  [RecommendationReason.HIGH_RATED]: 'Highly Rated',
  [RecommendationReason.NEW_RELEASE]: 'New Release',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  [MovieNotificationType.NEW_TRAILER]: 'New Trailer Available',
  [MovieNotificationType.RELEASE_DATE]: 'Release Date Reminder',
  [MovieNotificationType.STREAMING_AVAILABLE]: 'Now Streaming',
  [MovieNotificationType.WATCHLIST_REMINDER]: 'Watchlist Reminder',
  [MovieNotificationType.RECOMMENDATION]: 'New Recommendation',
  [MovieNotificationType.COLLECTION_UPDATE]: 'Collection Update',
} as const;

// Toast Configuration
export const TOAST_CONFIG = {
  DEFAULT_DURATION: 5000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 7000,
  WARNING_DURATION: 5000,
  INFO_DURATION: 4000,
} as const;

export const TOAST_MESSAGES = {
  [ToastType.SUCCESS]: {
    LOGIN: 'Successfully logged in!',
    LOGOUT: 'Successfully logged out!',
    REGISTER: 'Account created successfully!',
    UPDATE_PROFILE: 'Profile updated successfully!',
    ADD_TO_WATCHLIST: 'Added to watchlist!',
    REMOVE_FROM_WATCHLIST: 'Removed from watchlist!',
    RATING_ADDED: 'Rating added successfully!',
    COMMENT_ADDED: 'Comment added successfully!',
    EPISODE_WATCHED: 'Episode marked as watched!',
    SEASON_WATCHED: 'Season marked as watched!',
    SHOW_WATCHED: 'Show marked as watched!',
  },
  [ToastType.ERROR]: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    NETWORK_ERROR: 'Network error. Please try again.',
    GENERIC_ERROR: 'Something went wrong. Please try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    EPISODE_NOT_FOUND: 'Episode not found.',
    SEASON_NOT_FOUND: 'Season not found.',
    SHOW_NOT_FOUND: 'Show not found.',
  },
  [ToastType.WARNING]: {
    UNSAVED_CHANGES: 'You have unsaved changes.',
    SESSION_EXPIRING: 'Your session is about to expire.',
    EPISODE_SPOILER: 'This episode contains spoilers.',
    SEASON_SPOILER: 'This season contains spoilers.',
  },
  [ToastType.INFO]: {
    LOADING: 'Loading...',
    SYNCING: 'Syncing data...',
    NEW_EPISODE: 'New episode available!',
    NEW_SEASON: 'New season available!',
  },
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  MAX_RECENT_SEARCHES: 5,
  MAX_SUGGESTIONS: 10,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  MOVIE_DETAILS_TTL: 30 * 60 * 1000, // 30 minutes
  SEARCH_RESULTS_TTL: 2 * 60 * 1000, // 2 minutes
  USER_DATA_TTL: 1 * 60 * 1000, // 1 minute
  STATIC_DATA_TTL: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Media Types
export const MEDIA_TYPES = {
  MOVIE: 'movie' as const,
  TV: 'tv' as const,
} as const;

// Video Types
export const VIDEO_TYPES = {
  TRAILER: 'Trailer',
  TEASER: 'Teaser',
  CLIP: 'Clip',
  FEATURETTE: 'Featurette',
  BEHIND_SCENES: 'Behind the Scenes',
  BLOOPERS: 'Bloopers',
} as const;

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
} as const;

// Responsive Breakpoints
export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  SLOWER: 500,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
] as const;

// Countries/Regions
export const REGIONS = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
] as const;

// Default Values
export const DEFAULTS = {
  MOVIE_POSTER: '/images/no-poster.png',
  MOVIE_BACKDROP: '/images/no-backdrop.png',
  USER_AVATAR: '/images/default-avatar.png',
  COMPANY_LOGO: '/images/no-logo.png',
  PROFILE_IMAGE: '/images/no-profile.png',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_RATING: 'Rating must be between 0.5 and 5',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  INVALID_FILE_TYPE: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  EPISODE_NOT_FOUND: 'Episode not found',
  SEASON_NOT_FOUND: 'Season not found',
  SHOW_NOT_FOUND: 'TV Show not found',
  INVALID_SEASON_NUMBER: 'Invalid season number',
  INVALID_EPISODE_NUMBER: 'Invalid episode number',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: 'Account created successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Successfully logged out',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_SENT: 'Email sent successfully',
  ITEM_SAVED: 'Item saved successfully',
  ITEM_DELETED: 'Item deleted successfully',
  REVIEW_SUBMITTED: 'Review submitted successfully',
  RATING_SAVED: 'Rating saved successfully',
  EPISODE_WATCHED: 'Episode marked as watched',
  SEASON_WATCHED: 'Season marked as watched',
  SHOW_WATCHED: 'TV Show marked as watched',
  EPISODE_PROGRESS_SAVED: 'Episode progress saved',
  SEASON_PROGRESS_SAVED: 'Season progress saved',
  SHOW_PROGRESS_SAVED: 'Show progress saved',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'cinehub_auth_token',
  REFRESH_TOKEN: 'cinehub_refresh_token',
  USER_PREFERENCES: 'cinehub_user_preferences',
  THEME: 'cinehub_theme',
  LANGUAGE: 'cinehub_language',
  RECENT_SEARCHES: 'cinehub_recent_searches',
  WATCHLIST_FILTERS: 'cinehub_watchlist_filters',
  MOVIE_FILTERS: 'cinehub_movie_filters',
  TV_FILTERS: 'cinehub_tv_filters',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_TV_SHOWS: true,
  ENABLE_SOCIAL_FEATURES: true,
  ENABLE_RECOMMENDATIONS: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_PWA: true,
  ENABLE_ANALYTICS: true,
  ENABLE_PUSH_NOTIFICATIONS: false,
} as const;

// External Links
export const EXTERNAL_LINKS = {
  TMDB: 'https://www.themoviedb.org',
  IMDB: 'https://www.imdb.com',
  YOUTUBE: 'https://www.youtube.com',
  GITHUB: 'https://github.com',
  PRIVACY_POLICY: '/privacy',
  TERMS_OF_SERVICE: '/terms',
  SUPPORT: '/support',
  ABOUT: '/about',
} as const;

// TV Show Sort Options
export const TV_SHOW_SORT_OPTIONS = [
  { value: TVShowSortBy.POPULARITY, label: 'Most Popular' },
  { value: TVShowSortBy.RATING, label: 'Highest Rated' },
  { value: TVShowSortBy.FIRST_AIR_DATE, label: 'Newest First' },
  { value: TVShowSortBy.NAME, label: 'A-Z' },
] as const;

// TV Show Notification Types
export const TV_NOTIFICATION_TYPES = {
  [TVNotificationType.NEW_EPISODE]: 'New Episode Available',
  [TVNotificationType.NEW_SEASON]: 'New Season Available',
  [TVNotificationType.SERIES_FINALE]: 'Series Finale',
  [TVNotificationType.WATCHLIST_REMINDER]: 'Watchlist Reminder',
  [TVNotificationType.RECOMMENDATION]: 'New Recommendation',
} as const;

// Review Sort Options
export const REVIEW_SORT_OPTIONS = [
  { value: ReviewSortBy.CREATED_AT, label: 'Most Recent' },
  { value: ReviewSortBy.RATING, label: 'Highest Rated' },
  { value: ReviewSortBy.HELPFUL, label: 'Most Helpful' },
  { value: ReviewSortBy.UPDATED_AT, label: 'Recently Updated' },
] as const;

// Review Report Reasons
export const REVIEW_REPORT_REASONS = {
  [ReviewReportReason.SPAM]: 'Spam',
  [ReviewReportReason.INAPPROPRIATE]: 'Inappropriate Content',
  [ReviewReportReason.SPOILERS]: 'Contains Spoilers',
  [ReviewReportReason.HARASSMENT]: 'Harassment',
  [ReviewReportReason.COPYRIGHT]: 'Copyright Violation',
  [ReviewReportReason.FAKE]: 'Fake Review',
  [ReviewReportReason.OTHER]: 'Other',
} as const;

// Review Report Status
export const REVIEW_REPORT_STATUS = {
  [ReviewReportStatus.PENDING]: 'Pending Review',
  [ReviewReportStatus.REVIEWED]: 'Under Review',
  [ReviewReportStatus.RESOLVED]: 'Resolved',
  [ReviewReportStatus.DISMISSED]: 'Dismissed',
} as const;

// Comment Report Reasons
export const COMMENT_REPORT_REASONS = {
  [CommentReportReason.SPAM]: 'Spam',
  [CommentReportReason.INAPPROPRIATE]: 'Inappropriate Content',
  [CommentReportReason.HARASSMENT]: 'Harassment',
  [CommentReportReason.SPOILER]: 'Contains Spoilers',
  [CommentReportReason.OFF_TOPIC]: 'Off Topic',
  [CommentReportReason.OTHER]: 'Other',
} as const;

// Comment Report Status
export const COMMENT_REPORT_STATUS = {
  [CommentReportStatus.PENDING]: 'Pending Review',
  [CommentReportStatus.REVIEWED]: 'Under Review',
  [CommentReportStatus.RESOLVED]: 'Resolved',
  [CommentReportStatus.DISMISSED]: 'Dismissed',
} as const;

// User Roles
export const USER_ROLES = {
  [UserRole.USER]: 'User',
  [UserRole.MODERATOR]: 'Moderator',
  [UserRole.ADMIN]: 'Administrator',
} as const;

// Auth Providers
export const AUTH_PROVIDERS = {
  [AuthProvider.EMAIL]: 'Email',
  [AuthProvider.GOOGLE]: 'Google',
  [AuthProvider.FACEBOOK]: 'Facebook',
} as const;

// Activity Types
export const ACTIVITY_TYPES = {
  [ActivityType.WATCHED]: 'Watched',
  [ActivityType.RATED]: 'Rated',
  [ActivityType.ADDED_TO_WATCHLIST]: 'Added to Watchlist',
  [ActivityType.REMOVED_FROM_WATCHLIST]: 'Removed from Watchlist',
  [ActivityType.COMMENTED]: 'Commented',
  [ActivityType.LIKED]: 'Liked',
} as const;

// Admin Actions
export const ADMIN_ACTIONS = {
  [AdminAction.USER_CREATED]: 'User Created',
  [AdminAction.USER_UPDATED]: 'User Updated',
  [AdminAction.USER_DELETED]: 'User Deleted',
  [AdminAction.USER_ACTIVATED]: 'User Activated',
  [AdminAction.USER_DEACTIVATED]: 'User Deactivated',
  [AdminAction.ROLE_CHANGED]: 'Role Changed',
  [AdminAction.PASSWORD_RESET]: 'Password Reset',
  [AdminAction.AVATAR_UPLOADED]: 'Avatar Uploaded',
} as const;

// Auth Error Messages
export const AUTH_ERROR_MESSAGES = {
  [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
  [AuthErrorCode.EMAIL_ALREADY_EXISTS]: 'Email already exists',
  [AuthErrorCode.EMAIL_NOT_VERIFIED]: 'Email not verified',
  [AuthErrorCode.ACCOUNT_DISABLED]: 'Account is disabled',
  [AuthErrorCode.WEAK_PASSWORD]: 'Password is too weak',
  [AuthErrorCode.INVALID_TOKEN]: 'Invalid token',
  [AuthErrorCode.TOKEN_EXPIRED]: 'Token has expired',
  [AuthErrorCode.SOCIAL_AUTH_ERROR]: 'Social authentication failed',
  [AuthErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many attempts, please try again later',
} as const;

// User Preferences
export const DEFAULT_USER_PREFERENCES = {
  language: 'en',
  notifications: {
    email: true,
    push: true,
    recommendations: true,
    newReleases: true,
  },
  privacy: {
    showWatchlist: true,
    showRatings: true,
    showActivity: true,
  },
} as const;

// Database Configuration
export const DATABASE_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cinehub',
  port: 3306,
} as const;