import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export query function
export const db = {
  query: async <T extends RowDataPacket[]>(
    sql: string,
    values: any[] = []
  ): Promise<[T, ResultSetHeader]> => {
    try {
      const [results] = await pool.execute<T>(sql, values);
      return [results as T, {} as ResultSetHeader];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
}; 