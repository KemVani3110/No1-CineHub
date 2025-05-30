import { query } from '../connection';

export interface HistoryItem {
  id: number;
  user_id: number;
  movie_id: number | null;
  tv_id: number | null;
  media_type: 'movie' | 'tv';
  watched_at: Date;
  watch_duration: number | null;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateHistoryItem {
  user_id: number;
  movie_id?: number;
  tv_id?: number;
  media_type: 'movie' | 'tv';
  watch_duration?: number;
  completed?: boolean;
}

export interface UpdateHistoryItem {
  watch_duration?: number;
  completed?: boolean;
}

export class HistoryModel {
  static async findById(id: number): Promise<HistoryItem | null> {
    const items = await query<HistoryItem[]>(
      'SELECT * FROM watch_history WHERE id = ?',
      [id]
    );
    return items[0] || null;
  }

  static async findByUserAndMedia(
    userId: number,
    mediaType: 'movie' | 'tv',
    movieId?: number,
    tvId?: number
  ): Promise<HistoryItem | null> {
    const items = await query<HistoryItem[]>(
      'SELECT * FROM watch_history WHERE user_id = ? AND movie_id = ? AND tv_id = ? AND media_type = ?',
      [userId, movieId || null, tvId || null, mediaType]
    );
    return items[0] || null;
  }

  static async create(item: CreateHistoryItem): Promise<HistoryItem> {
    const result = await query<{ insertId: number }>(
      `INSERT INTO watch_history (
        user_id, movie_id, tv_id, media_type, watch_duration, completed
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item.user_id,
        item.movie_id || null,
        item.tv_id || null,
        item.media_type,
        item.watch_duration || null,
        item.completed || false
      ]
    );
    return this.findById(result.insertId) as Promise<HistoryItem>;
  }

  static async update(id: number, item: UpdateHistoryItem): Promise<HistoryItem | null> {
    const updates: string[] = [];
    const values: (number | boolean | null)[] = [];

    if (item.watch_duration !== undefined) {
      updates.push('watch_duration = ?');
      values.push(item.watch_duration);
    }
    if (item.completed !== undefined) {
      updates.push('completed = ?');
      values.push(item.completed);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await query(
      `UPDATE watch_history SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query<{ affectedRows: number }>(
      'DELETE FROM watch_history WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async listByUser(
    userId: number,
    mediaType?: 'movie' | 'tv',
    limit = 20,
    offset = 0
  ): Promise<HistoryItem[]> {
    const whereClause = mediaType
      ? 'WHERE user_id = ? AND media_type = ?'
      : 'WHERE user_id = ?';
    const params = mediaType
      ? [userId, mediaType, limit, offset]
      : [userId, limit, offset];

    return query<HistoryItem[]>(
      `SELECT * FROM watch_history ${whereClause} ORDER BY watched_at DESC LIMIT ? OFFSET ?`,
      params
    );
  }

  static async listByMedia(
    mediaType: 'movie' | 'tv',
    movieId?: number,
    tvId?: number,
    limit = 20,
    offset = 0
  ): Promise<HistoryItem[]> {
    return query<HistoryItem[]>(
      `SELECT * FROM watch_history 
       WHERE media_type = ? AND movie_id = ? AND tv_id = ? 
       ORDER BY watched_at DESC LIMIT ? OFFSET ?`,
      [mediaType, movieId || null, tvId || null, limit, offset]
    );
  }

  static async countByUser(userId: number, mediaType?: 'movie' | 'tv'): Promise<number> {
    const whereClause = mediaType
      ? 'WHERE user_id = ? AND media_type = ?'
      : 'WHERE user_id = ?';
    const params = mediaType ? [userId, mediaType] : [userId];

    const result = await query<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM watch_history ${whereClause}`,
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
      `SELECT COUNT(*) as count FROM watch_history 
       WHERE media_type = ? AND movie_id = ? AND tv_id = ?`,
      [mediaType, movieId || null, tvId || null]
    );
    return result[0].count;
  }

  static async getTotalWatchTime(userId: number): Promise<number> {
    const result = await query<{ total: number }[]>(
      'SELECT COALESCE(SUM(watch_duration), 0) as total FROM watch_history WHERE user_id = ?',
      [userId]
    );
    return result[0].total;
  }

  static async getCompletedCount(userId: number): Promise<number> {
    const result = await query<{ count: number }[]>(
      'SELECT COUNT(*) as count FROM watch_history WHERE user_id = ? AND completed = TRUE',
      [userId]
    );
    return result[0].count;
  }
} 