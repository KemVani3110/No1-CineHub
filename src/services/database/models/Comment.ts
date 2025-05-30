import { query } from '../connection';

export interface Comment {
  id: number;
  user_id: number;
  movie_id: number | null;
  tv_id: number | null;
  media_type: 'movie' | 'tv';
  content: string;
  rating: number | null;
  is_edited: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateComment {
  user_id: number;
  movie_id?: number;
  tv_id?: number;
  media_type: 'movie' | 'tv';
  content: string;
  rating?: number;
}

export interface UpdateComment {
  content: string;
  rating?: number;
}

export class CommentModel {
  static async findById(id: number): Promise<Comment | null> {
    const comments = await query<Comment[]>(
      'SELECT * FROM comments WHERE id = ?',
      [id]
    );
    return comments[0] || null;
  }

  static async findByUserAndMedia(
    userId: number,
    mediaType: 'movie' | 'tv',
    movieId?: number,
    tvId?: number
  ): Promise<Comment | null> {
    const comments = await query<Comment[]>(
      'SELECT * FROM comments WHERE user_id = ? AND movie_id = ? AND tv_id = ? AND media_type = ?',
      [userId, movieId || null, tvId || null, mediaType]
    );
    return comments[0] || null;
  }

  static async create(comment: CreateComment): Promise<Comment> {
    const result = await query<{ insertId: number }>(
      `INSERT INTO comments (
        user_id, movie_id, tv_id, media_type, content, rating
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        comment.user_id,
        comment.movie_id || null,
        comment.tv_id || null,
        comment.media_type,
        comment.content,
        comment.rating || null
      ]
    );
    return this.findById(result.insertId) as Promise<Comment>;
  }

  static async update(id: number, comment: UpdateComment): Promise<Comment | null> {
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    updates.push('content = ?');
    values.push(comment.content);

    if (comment.rating !== undefined) {
      updates.push('rating = ?');
      values.push(comment.rating);
    }

    updates.push('is_edited = TRUE');

    values.push(id);
    await query(
      `UPDATE comments SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query<{ affectedRows: number }>(
      'DELETE FROM comments WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async listByUser(
    userId: number,
    mediaType?: 'movie' | 'tv',
    limit = 20,
    offset = 0
  ): Promise<Comment[]> {
    const whereClause = mediaType
      ? 'WHERE user_id = ? AND media_type = ?'
      : 'WHERE user_id = ?';
    const params = mediaType
      ? [userId, mediaType, limit, offset]
      : [userId, limit, offset];

    return query<Comment[]>(
      `SELECT * FROM comments ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      params
    );
  }

  static async listByMedia(
    mediaType: 'movie' | 'tv',
    movieId?: number,
    tvId?: number,
    limit = 20,
    offset = 0
  ): Promise<Comment[]> {
    return query<Comment[]>(
      `SELECT * FROM comments 
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
      `SELECT COUNT(*) as count FROM comments ${whereClause}`,
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
      `SELECT COUNT(*) as count FROM comments 
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
      `SELECT AVG(rating) as avg FROM comments 
       WHERE media_type = ? AND movie_id = ? AND tv_id = ? AND rating IS NOT NULL`,
      [mediaType, movieId || null, tvId || null]
    );
    return result[0].avg || 0;
  }
} 