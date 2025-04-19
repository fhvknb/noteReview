'use server';

import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '123456',
  database: process.env.MYSQL_DATABASE || 'notesdb',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
};

let pool: mysql.Pool;

async function createPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    console.log('MySQL Connection Pool created');
  }
  return pool;
}

export async function getConnection() {
  const pool = await createPool();
  return pool.getConnection();
}

export async function query(sql: string, values: any[] = []) {
  let connection;
  try {
    connection = await getConnection();
    const [results,] = await connection.execute(sql, values);
    return results;
  } catch (error) {
    console.error('DB Query error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function initDatabase() {
  try {
    // Check if the notes table exists
    const tableCheckQuery = `
      SELECT COUNT(*) AS tableExists
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = 'notes'
    `;
    const tableCheckValues = [dbConfig.database];
    const tableCheckResult: any = await query(tableCheckQuery, tableCheckValues);

    if (tableCheckResult && tableCheckResult[0].tableExists === 0) {
      // If the notes table does not exist, create it
      const createTableQuery = `
        CREATE TABLE notes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          category VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          originalNote TEXT NOT NULL,
          summary TEXT NOT NULL
        )
      `;
      await query(createTableQuery);
      console.log('notes table created');

      // Optionally, insert some default data
      const insertDefaultDataQuery = `
        INSERT INTO notes (category, title, originalNote, summary) VALUES
          ('Research/Data Analysis', 'Note_1', 'Explored new methodologies for data analysis.', 'Data analysis methodologies exploration summary.'),
      `;
      await query(insertDefaultDataQuery);
      console.log('Default data insertion completed');
    } else {
      console.log('notes The table already exists.');
    }
  } catch (error) {
    console.error('Error occurred during table creation or initialization:', error);
    throw error;
  }
}

