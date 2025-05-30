import { query } from '../connection';

export interface Rating {
  id: number;
  user_id: number;
  movie_id: number | null;
  tv_id: number | null;
  media_type: 'movie' | 'tv';
  rating: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRating {
  user_id: number;
  movie_id?: number;
  tv_id?: number;
  media_type: 'movie' | 'tv';
  rating: number;
}

export interface UpdateRating {
  rating: number;
}

export class RatingModel {
  static async findById(id: number): Promise<Rating | null> {
    const ratings = await query<Rating[]>(
      'SELECT * FROM ratings WHERE id = ?',
      [id]
    );
    return ratings[0] || null;
  }

  static async findByUserAndMedia(
    userId: number,
    mediaType: 'movie' | 'tv',
    movieId?: number,
    tvId?: number
  ): Promise<Rating | null> {
    const ratings = await query<Rating[]>(
      'SELECT * FROM ratings WHERE user_id = ? AND movie_id = ? AND tv_id = ? AND media_type = ?',
      [userId, movieId || null, tvId || null, mediaType]
    );
    return ratings[0] || null;
  }

  static async create(rating: CreateRating): Promise<Rating> {
    const result = await query<{ insertId: number }>(
      `INSERT INTO ratings (
        user_id, movie_id, tv_id, media_type, rating
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        rating.user_id,
        rating.movie_id || null,
        rating.tv_id || null,
        rating.media_type,
        rating.rating
      ]
    );
    return this.findById(result.insertId) as Promise<Rating>;
  }

  static async update(id: number, rating: UpdateRating): Promise<Rating | null> {
    await query(
      'UPDATE ratings SET rating = ? WHERE id = ?',
      [rating.rating, id]
    );
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query<{ affectedRows: number }>(
      'DELETE FROM ratings WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async listByUser(
    userId: number,
    mediaType?: 'movie' | 'tv',
    limit = 20,
    offset = 0
  ): Promise<Rating[]> {
    const whereClause = mediaType
      ? 'WHERE user_id = ? AND media_type = ?'
      : 'WHERE user_id = ?';
    const params = mediaType
      ? [userId, mediaType, limit, offset]
      : [userId, limit, offset];

    return query<Rating[]>(
      `SELECT * FROM ratings ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      params
    );
  }

  static async listByMedia(
    mediaType: 'movie' | 'tv',
    movieId?: number,
    tvId?: number,
    limit = 20,
    offset = 0
  ): Promise<Rating[]> {
    return query<Rating[]>(
      `SELECT * FROM ratings 
       WHERE media_type = ? AND movie_id = ? AND tv_id = ? 
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [mediaType, movieId || null, tvId || null, limit, offset]
    );
  }

  static async countByUser(userId: number, mediaType?: 'movie' | 'tv'): Promise<number> {
    const whereClause = mediaType
      ? 'WHERE user_id = ? AND media_type = ?'
      : 'WHERE user_id = ?';
    const params = mediaType ? [userId, mediaType] : [userId];

    const result = await query<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM ratings ${whereClause}`,
      params
    );
    return result[0].count;
  }

  static async countByMedia(
    mediaType: 'movie' | 'tv',
    movieId?: number,
    tvId?: number
  ): Promise<number> {
    const result = await query<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM ratings 
       WHERE media_type = ? AND movie_id = ? AND tv_id = ?`,
      [mediaType, movieId || null, tvId || null]
    );
    return result[0].count;
  }

  static async getAverageRating(
    mediaType: 'movie' | 'tv',
    movieId?: number,
    tvId?: number
  ): Promise<number> {
    const result = await query<{ avg: number }[]>(
      `SELECT AVG(rating) as avg FROM ratings 
       WHERE media_type = ? AND movie_id = ? AND tv_id = ?`,
      [mediaType, movieId || null, tvId || null]
    );
    return result[0].avg || 0;
  }
} 