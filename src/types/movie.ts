/* eslint-disable @typescript-eslint/no-empty-object-type */
// src/types/movie.ts

export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string;
  posterPath?: string;
  backdropPath?: string;
  adult: boolean;
  genreIds: number[];
  originalLanguage: string;
  popularity: number;
  voteCount: number;
  voteAverage: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  belongsToCollection?: MovieCollection;
  budget: number;
  genres: Genre[];
  homepage?: string;
  imdbId?: string;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  revenue: number;
  runtime?: number;
  spokenLanguages: SpokenLanguage[];
  status: MovieStatus;
  tagline?: string;
  credits?: MovieCredits;
  videos?: MovieVideos;
  images?: MovieImages;
  recommendations?: MovieRecommendations;
  similar?: MovieSimilar;
  reviews?: MovieReviews;
  keywords?: MovieKeywords;
  releaseDates?: MovieReleaseDates;
  watchProviders?: WatchProviders;
}

export interface MovieCollection {
  id: number;
  name: string;
  overview: string;
  posterPath?: string;
  backdropPath?: string;
  parts: Movie[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logoPath?: string;
  name: string;
  originCountry: string;
}

export interface ProductionCountry {
  iso31661: string;
  name: string;
}

export interface SpokenLanguage {
  englishName: string;
  iso6391: string;
  name: string;
}

export enum MovieStatus {
  RUMORED = 'Rumored',
  PLANNED = 'Planned',
  IN_PRODUCTION = 'In Production',
  POST_PRODUCTION = 'Post Production',
  RELEASED = 'Released',
  CANCELED = 'Canceled'
}

// Credits
export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  creditId: string;
  order: number;
  adult: boolean;
  gender?: number;
  knownForDepartment: string;
  originalName: string;
  popularity: number;
  profilePath?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  creditId: string;
  adult: boolean;
  gender?: number;
  knownForDepartment: string;
  originalName: string;
  popularity: number;
  profilePath?: string;
}

// Videos
export interface MovieVideos {
  results: MovieVideo[];
}

export interface MovieVideo {
  id: string;
  iso6391: string;
  iso31661: string;
  key: string;
  name: string;
  official: boolean;
  publishedAt: string;
  site: string;
  size: number;
  type: VideoType;
}

export enum VideoType {
  TRAILER = 'Trailer',
  TEASER = 'Teaser',
  CLIP = 'Clip',
  FEATURETTE = 'Featurette',
  BEHIND_THE_SCENES = 'Behind the Scenes',
  BLOOPERS = 'Bloopers'
}

// Images
export interface MovieImages {
  backdrops: MovieImage[];
  logos: MovieImage[];
  posters: MovieImage[];
}

export interface MovieImage {
  aspectRatio: number;
  height: number;
  iso6391?: string;
  filePath: string;
  voteAverage: number;
  voteCount: number;
  width: number;
}

// Recommendations and Similar
export interface MovieRecommendations {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

export interface MovieSimilar extends MovieRecommendations { }

// Reviews
export interface MovieReviews {
  page: number;
  results: MovieReview[];
  totalPages: number;
  totalResults: number;
}

export interface MovieReview {
  id: string;
  author: string;
  authorDetails: ReviewAuthor;
  content: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface ReviewAuthor {
  name: string;
  username: string;
  avatarPath?: string;
  rating?: number;
}

// Keywords
export interface MovieKeywords {
  keywords: Keyword[];
}

export interface Keyword {
  id: number;
  name: string;
}

// Release Dates
export interface MovieReleaseDates {
  results: CountryReleaseDate[];
}

export interface CountryReleaseDate {
  iso31661: string;
  releaseDates: ReleaseDate[];
}

export interface ReleaseDate {
  certification: string;
  descriptors: string[];
  iso6391: string;
  note: string;
  releaseDate: string;
  type: ReleaseDateType;
}

export enum ReleaseDateType {
  PREMIERE = 1,
  THEATRICAL_LIMITED = 2,
  THEATRICAL = 3,
  DIGITAL = 4,
  PHYSICAL = 5,
  TV = 6
}

// Watch Providers
export interface WatchProviders {
  results: {
    [countryCode: string]: CountryWatchProviders;
  };
}

export interface CountryWatchProviders {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  ads?: WatchProvider[];
}

export interface WatchProvider {
  displayPriority: number;
  logoPath: string;
  providerId: number;
  providerName: string;
}

// Discover and Search
export interface DiscoverMovieParams {
  sortBy?: MovieSortBy;
  page?: number;
  includeAdult?: boolean;
  includeVideo?: boolean;
  language?: string;
  primaryReleaseYear?: number;
  primaryReleaseDateGte?: string;
  primaryReleaseDateLte?: string;
  releaseDateGte?: string;
  releaseDateLte?: string;
  withReleaseType?: ReleaseDateType[];
  year?: number;
  voteCountGte?: number;
  voteCountLte?: number;
  voteAverageGte?: number;
  voteAverageLte?: number;
  withCast?: string;
  withCrew?: string;
  withPeople?: string;
  withCompanies?: string;
  withGenres?: string;
  withoutGenres?: string;
  withKeywords?: string;
  withoutKeywords?: string;
  withRuntimeGte?: number;
  withRuntimeLte?: number;
  withOriginalLanguage?: string;
  withWatchProviders?: string;
  watchRegion?: string;
  withWatchMonetizationTypes?: string;
  withoutCompanies?: string;
  region?: string;
}

export enum MovieSortBy {
  POPULARITY_ASC = 'popularity.asc',
  POPULARITY_DESC = 'popularity.desc',
  RELEASE_DATE_ASC = 'release_date.asc',
  RELEASE_DATE_DESC = 'release_date.desc',
  REVENUE_ASC = 'revenue.asc',
  REVENUE_DESC = 'revenue.desc',
  PRIMARY_RELEASE_DATE_ASC = 'primary_release_date.asc',
  PRIMARY_RELEASE_DATE_DESC = 'primary_release_date.desc',
  ORIGINAL_TITLE_ASC = 'original_title.asc',
  ORIGINAL_TITLE_DESC = 'original_title.desc',
  VOTE_AVERAGE_ASC = 'vote_average.asc',
  VOTE_AVERAGE_DESC = 'vote_average.desc',
  VOTE_COUNT_ASC = 'vote_count.asc',
  VOTE_COUNT_DESC = 'vote_count.desc'
}

export interface MovieSearchParams {
  query: string;
  page?: number;
  includeAdult?: boolean;
  region?: string;
  year?: number;
  primaryReleaseYear?: number;
}

// Lists
export interface MovieListResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
  dates?: {
    maximum: string;
    minimum: string;
  };
}

// User-specific movie data
export interface UserMovieData {
  movieId: number;
  movie: Movie;
  isInWatchlist: boolean;
  userRating?: number;
  userComment?: string;
  watchedAt?: Date;
  addedToWatchlistAt?: Date;
  ratedAt?: Date;
}

// Movie filters for UI
export interface MovieFilters {
  genres?: number[];
  releaseYear?: {
    min?: number;
    max?: number;
  };
  rating?: {
    min?: number;
    max?: number;
  };
  runtime?: {
    min?: number;
    max?: number;
  };
  sortBy?: MovieSortBy;
  includeAdult?: boolean;
  language?: string;
  region?: string;
}

// Trending
export interface TrendingMoviesParams {
  timeWindow: 'day' | 'week';
  page?: number;
}

// Person (Actor/Director) details
export interface Person {
  id: number;
  name: string;
  biography: string;
  birthday?: string;
  deathday?: string;
  gender: number;
  homepage?: string;
  imdbId?: string;
  knownForDepartment: string;
  placeOfBirth?: string;
  popularity: number;
  profilePath?: string;
  adult: boolean;
  alsoKnownAs: string[];
}

export interface PersonMovieCredits {
  cast: MovieCastCredit[];
  crew: MovieCrewCredit[];
}

export interface MovieCastCredit extends Movie {
  character: string;
  creditId: string;
  order?: number;
}

export interface MovieCrewCredit extends Movie {
  job: string;
  department: string;
  creditId: string;
}