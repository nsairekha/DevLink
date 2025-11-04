import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 4000,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  multipleStatements: true,
  ssl: {
    // TiDB Cloud requires TLS 1.2+ secure connection
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true,
  },
});

pool.getConnection()
  .then(connection => {
    console.log(`✅ Connected to MySQL database ${process.env.DB_NAME} on thread ${connection.threadId}`);
    connection.release();
  })
  .catch(error => {
    console.error(`❌ Error connecting to MySQL database: ${error.message}`);
  });
