import mysql from 'mysql2/promise';

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export both pool and query function
export const db = {
  query: pool.query.bind(pool),
  execute: pool.execute.bind(pool)
};

export default pool; 