import { z } from 'zod';

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .transform(val => val.trim()),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// User profile validations
export const userProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .transform(val => val.trim())
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  preferences: z.object({
    language: z.string().optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      recommendations: z.boolean().optional(),
      newReleases: z.boolean().optional(),
    }).optional(),
    privacy: z.object({
      showWatchlist: z.boolean().optional(),
      showRatings: z.boolean().optional(),
      showActivity: z.boolean().optional(),
    }).optional(),
    genrePreferences: z.array(z.number()).optional(),
  }).optional(),
});

export const userSearchSchema = z.object({
  query: z.string().optional(),
  role: z.enum(['user', 'moderator', 'admin']).optional(),
  provider: z.enum(['email', 'google', 'facebook']).optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'lastLoginAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
  feedback: z.string().max(1000, 'Feedback must be less than 1000 characters').optional(),
});

// Comment validation
export const commentSchema = z.object({
  content: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(2000, 'Comment must be less than 2000 characters')
    .transform(val => val.trim()),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .optional(),
  movieId: z.number().optional(),
  tvId: z.number().optional(),
  mediaType: z.enum(['movie', 'tv']),
});

export const commentUpdateSchema = z.object({
  content: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(2000, 'Comment must be less than 2000 characters')
    .transform(val => val.trim()),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .optional(),
});

export const commentFilterSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  sortBy: z.enum(['createdAt', 'rating', 'likes']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

// Review validation
export const reviewSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform(val => val.trim()),
  content: z
    .string()
    .min(50, 'Review must be at least 50 characters')
    .max(5000, 'Review must be less than 5000 characters')
    .transform(val => val.trim()),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  spoilerWarning: z.boolean().default(false),
  movieId: z.number().optional(),
  tvId: z.number().optional(),
  mediaType: z.enum(['movie', 'tv']),
});

export const reviewUpdateSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform(val => val.trim())
    .optional(),
  content: z
    .string()
    .min(50, 'Review must be at least 50 characters')
    .max(5000, 'Review must be less than 5000 characters')
    .transform(val => val.trim())
    .optional(),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .optional(),
  spoilerWarning: z.boolean().optional(),
});

export const reviewFilterSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  hasSpoilers: z.boolean().optional(),
  sortBy: z.enum(['createdAt', 'rating', 'helpfulCount', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
  userId: z.number().optional(),
});

// Reaction validation
export const reactionSchema = z.object({
  reactionType: z.enum(['like', 'helpful', 'funny']),
});

export type CommentFormData = z.infer<typeof commentSchema>;
export type CommentUpdateData = z.infer<typeof commentUpdateSchema>;
export type CommentFilterData = z.infer<typeof commentFilterSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ReviewUpdateData = z.infer<typeof reviewUpdateSchema>;
export type ReviewFilterData = z.infer<typeof reviewFilterSchema>;
export type ReactionData = z.infer<typeof reactionSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type UserProfileUpdateData = z.infer<typeof userProfileUpdateSchema>;
export type UserSearchData = z.infer<typeof userSearchSchema>;
export type DeleteAccountData = z.infer<typeof deleteAccountSchema>;

// Movie validations
export const movieSearchSchema = z.object({
  query: z.string().optional(),
  page: z.number().min(1).default(1),
  includeAdult: z.boolean().default(false),
  language: z.string().optional(),
  primaryReleaseYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  year: z.number().min(1900).max(new Date().getFullYear()).optional(),
  region: z.string().length(2).optional(),
  withGenres: z.array(z.number()).optional(),
  withoutGenres: z.array(z.number()).optional(),
  voteAverageGte: z.number().min(0).max(10).optional(),
  voteAverageLte: z.number().min(0).max(10).optional(),
  releaseDateGte: z.string().datetime().optional(),
  releaseDateLte: z.string().datetime().optional(),
  withRuntimeGte: z.number().min(0).optional(),
  withRuntimeLte: z.number().min(0).optional(),
  sortBy: z.enum(['popularity.desc', 'vote_average.desc', 'release_date.desc', 'title.asc', 'revenue.desc']).default('popularity.desc'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const movieReviewSchema = z.object({
  movieId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(2000).optional(),
  spoiler: z.boolean().default(false),
});

export const addToWatchlistSchema = z.object({
  movieId: z.number(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  notes: z.string().max(500).optional(),
  reminderDate: z.string().datetime().optional(),
});

export const movieWatchHistorySchema = z.object({
  movieId: z.number(),
  durationWatched: z.number().min(0).optional(),
  completed: z.boolean().optional(),
});

export const trendingMoviesSchema = z.object({
  timeWindow: z.enum(['day', 'week']).default('day'),
  page: z.number().min(1).default(1),
});

export type MovieSearchData = z.infer<typeof movieSearchSchema>;
export type MovieReviewData = z.infer<typeof movieReviewSchema>;
export type AddToWatchlistData = z.infer<typeof addToWatchlistSchema>;
export type MovieWatchHistoryData = z.infer<typeof movieWatchHistorySchema>;
export type TrendingMoviesData = z.infer<typeof trendingMoviesSchema>;

// TV validations
export const tvShowSearchSchema = z.object({
  query: z.string().optional(),
  page: z.number().min(1).default(1),
  includeAdult: z.boolean().default(false),
  language: z.string().optional(),
  firstAirDateYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  withGenres: z.array(z.number()).optional(),
  withoutGenres: z.array(z.number()).optional(),
  withNetworks: z.array(z.number()).optional(),
  voteAverageGte: z.number().min(0).max(10).optional(),
  voteAverageLte: z.number().min(0).max(10).optional(),
  airDateGte: z.string().datetime().optional(),
  airDateLte: z.string().datetime().optional(),
  sortBy: z.enum(['popularity.desc', 'vote_average.desc', 'first_air_date.desc', 'name.asc']).default('popularity.desc'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const tvReviewSchema = z.object({
  tvId: z.number(),
  seasonNumber: z.number().min(1).optional(),
  episodeNumber: z.number().min(1).optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(2000).optional(),
  spoiler: z.boolean().default(false),
});

export const addToTVWatchlistSchema = z.object({
  tvId: z.number(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  notes: z.string().max(500).optional(),
  reminderDate: z.string().datetime().optional(),
});

export const tvWatchHistorySchema = z.object({
  tvId: z.number(),
  seasonNumber: z.number().min(1).optional(),
  episodeNumber: z.number().min(1).optional(),
  durationWatched: z.number().min(0).optional(),
  completed: z.boolean().optional(),
});

export const episodeProgressSchema = z.object({
  episodeId: z.number(),
  seasonNumber: z.number().min(1),
  episodeNumber: z.number().min(1),
  duration: z.number().min(0),
  watchedDuration: z.number().min(0),
  completed: z.boolean().default(false),
});

export const seasonProgressSchema = z.object({
  seasonNumber: z.number().min(1),
  totalEpisodes: z.number().min(0),
  watchedEpisodes: z.number().min(0),
  currentEpisode: z.number().min(1),
  completed: z.boolean().default(false),
});

export type TVShowSearchData = z.infer<typeof tvShowSearchSchema>;
export type TVReviewData = z.infer<typeof tvReviewSchema>;
export type AddToTVWatchlistData = z.infer<typeof addToTVWatchlistSchema>;
export type TVWatchHistoryData = z.infer<typeof tvWatchHistorySchema>;
export type EpisodeProgressData = z.infer<typeof episodeProgressSchema>;
export type SeasonProgressData = z.infer<typeof seasonProgressSchema>;