import mysql from 'mysql2/promise';

console.log('Database configuration:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connection successful');
    connection.release();
  })
  .catch(error => {
    console.error('Database connection failed:', error);
  });

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  try {
    console.log('Executing query:', sql, 'with params:', params);
    const [rows] = await pool.execute(sql, params);
    console.log('Query result:', rows);
    return rows as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool; 