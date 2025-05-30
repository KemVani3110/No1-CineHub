import { query } from '../connection';

export interface User {
  id: number;
  email: string;
  password_hash: string | null;
  name: string;
  avatar: string | null;
  role: 'user' | 'admin' | 'moderator';
  is_active: boolean;
  email_verified: boolean;
  email_verified_at: Date | null;
  provider: 'local' | 'google' | 'facebook' | 'github';
  provider_id: string | null;
  remember_token: string | null;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
  login_attempts: number;
  locked_until: Date | null;
}

export interface CreateUser {
  email: string;
  password_hash?: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'moderator';
  provider?: 'local' | 'google' | 'facebook' | 'github';
  provider_id?: string;
}

export interface UpdateUser {
  email?: string;
  password_hash?: string;
  name?: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'moderator';
  is_active?: boolean;
  email_verified?: boolean;
  email_verified_at?: Date | null;
  provider?: 'local' | 'google' | 'facebook' | 'github';
  provider_id?: string;
  remember_token?: string | null;
  last_login_at?: Date | null;
  login_attempts?: number;
  locked_until?: Date | null;
}

export class UserModel {
  static async findById(id: number): Promise<User | null> {
    const users = await query<User[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return users[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const users = await query<User[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users[0] || null;
  }

  static async findByProvider(provider: string, providerId: string): Promise<User | null> {
    const users = await query<User[]>(
      'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
      [provider, providerId]
    );
    return users[0] || null;
  }

  static async create(user: CreateUser): Promise<User> {
    const result = await query<{ insertId: number }>(
      `INSERT INTO users (
        email, password_hash, name, avatar, role, provider, provider_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.email,
        user.password_hash || null,
        user.name,
        user.avatar || null,
        user.role || 'user',
        user.provider || 'local',
        user.provider_id || null
      ]
    );
    return this.findById(result.insertId) as Promise<User>;
  }

  static async update(id: number, user: UpdateUser): Promise<User | null> {
    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    if (user.email !== undefined) {
      updates.push('email = ?');
      values.push(user.email);
    }
    if (user.password_hash !== undefined) {
      updates.push('password_hash = ?');
      values.push(user.password_hash);
    }
    if (user.name !== undefined) {
      updates.push('name = ?');
      values.push(user.name);
    }
    if (user.avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(user.avatar);
    }
    if (user.role !== undefined) {
      updates.push('role = ?');
      values.push(user.role);
    }
    if (user.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(user.is_active);
    }
    if (user.email_verified !== undefined) {
      updates.push('email_verified = ?');
      values.push(user.email_verified);
    }
    if (user.email_verified_at !== undefined) {
      updates.push('email_verified_at = ?');
      values.push(user.email_verified_at?.toISOString() || null);
    }
    if (user.provider !== undefined) {
      updates.push('provider = ?');
      values.push(user.provider);
    }
    if (user.provider_id !== undefined) {
      updates.push('provider_id = ?');
      values.push(user.provider_id);
    }
    if (user.remember_token !== undefined) {
      updates.push('remember_token = ?');
      values.push(user.remember_token);
    }
    if (user.last_login_at !== undefined) {
      updates.push('last_login_at = ?');
      values.push(user.last_login_at?.toISOString() || null);
    }
    if (user.login_attempts !== undefined) {
      updates.push('login_attempts = ?');
      values.push(user.login_attempts);
    }
    if (user.locked_until !== undefined) {
      updates.push('locked_until = ?');
      values.push(user.locked_until?.toISOString() || null);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query<{ affectedRows: number }>(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async incrementLoginAttempts(id: number): Promise<void> {
    await query(
      'UPDATE users SET login_attempts = login_attempts + 1 WHERE id = ?',
      [id]
    );
  }

  static async resetLoginAttempts(id: number): Promise<void> {
    await query(
      'UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?',
      [id]
    );
  }

  static async lockAccount(id: number, lockDuration: number): Promise<void> {
    const lockUntil = new Date(Date.now() + lockDuration * 1000);
    await query(
      'UPDATE users SET locked_until = ? WHERE id = ?',
      [lockUntil.toISOString(), id]
    );
  }

  static async updateLastLogin(id: number): Promise<void> {
    await query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
  }
} 