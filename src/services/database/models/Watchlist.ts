import { query } from '../connection';

export interface WatchlistItem {
  id: number;
  user_id: number;
  movie_id: number | null;
  tv_id: number | null;
  media_type: 'movie' | 'tv';
  added_at: Date;
  priority: number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateWatchlistItem {
  user_id: number;
  movie_id?: number;
  tv_id?: number;
  media_type: 'movie' | 'tv';
  priority?: number;
  notes?: string;
}

export interface UpdateWatchlistItem {
  priority?: number;
  notes?: string;
}

export class WatchlistModel {
  static async findById(id: number): Promise<WatchlistItem | null> {
    const items = await query<WatchlistItem[]>(
      'SELECT * FROM watchlist WHERE id = ?',
      [id]
    );
    return items[0] || null;
  }

  static async findByUserAndMedia(
    userId: number,
    mediaType: 'movie' | 'tv',
    movieId?: number,
    tvId?: number
  ): Promise<WatchlistItem | null> {
    const items = await query<WatchlistItem[]>(
      'SELECT * FROM watchlist WHERE user_id = ? AND movie_id = ? AND tv_id = ? AND media_type = ?',
      [userId, movieId || null, tvId || null, mediaType]
    );
    return items[0] || null;
  }

  static async create(item: CreateWatchlistItem): Promise<WatchlistItem> {
    const result = await query<{ insertId: number }>(
      `INSERT INTO watchlist (
        user_id, movie_id, tv_id, media_type, priority, notes
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item.user_id,
        item.movie_id || null,
        item.tv_id || null,
        item.media_type,
        item.priority || 0,
        item.notes || null
      ]
    );
    return this.findById(result.insertId) as Promise<WatchlistItem>;
  }

  static async update(id: number, item: UpdateWatchlistItem): Promise<WatchlistItem | null> {
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (item.priority !== undefined) {
      updates.push('priority = ?');
      values.push(item.priority);
    }
    if (item.notes !== undefined) {
      updates.push('notes = ?');
      values.push(item.notes);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await query(
      `UPDATE watchlist SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query<{ affectedRows: number }>(
      'DELETE FROM watchlist WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async listByUser(
    userId: number,
    mediaType?: 'movie' | 'tv',
    limit = 20,
    offset = 0
  ): Promise<WatchlistItem[]> {
    const whereClause = mediaType
      ? 'WHERE user_id = ? AND media_type = ?'
      : 'WHERE user_id = ?';
    const params = mediaType
      ? [userId, mediaType, limit, offset]
      : [userId, limit, offset];

    return query<WatchlistItem[]>(
      `SELECT * FROM watchlist ${whereClause} ORDER BY priority DESC, added_at DESC LIMIT ? OFFSET ?`,
      params
    );
  }

  static async countByUser(userId: number, mediaType?: 'movie' | 'tv'): Promise<number> {
    const whereClause = mediaType
      ? 'WHERE user_id = ? AND media_type = ?'
      : 'WHERE user_id = ?';
    const params = mediaType ? [userId, mediaType] : [userId];

    const result = await query<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM watchlist ${whereClause}`,
      params
    );
    return result[0].count;
  }

  static async updatePriority(id: number, priority: number): Promise<void> {
    await query(
      'UPDATE watchlist SET priority = ? WHERE id = ?',
      [priority, id]
    );
  }
} 