import mysql from 'mysql2/promise';
import { DATABASE_CONFIG } from './constants';

const pool = mysql.createPool({
  host: process.env.DB_HOST || DATABASE_CONFIG.host,
  user: process.env.DB_USER || DATABASE_CONFIG.user,
  password: process.env.DB_PASSWORD || DATABASE_CONFIG.password,
  database: process.env.DB_NAME || DATABASE_CONFIG.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const query = async <T>(sql: string, params?: (string | number | boolean | null)[]): Promise<T> => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const transaction = async <T>(callback: (connection: mysql.Connection) => Promise<T>): Promise<T> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export default pool;
