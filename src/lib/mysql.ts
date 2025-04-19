'use server';

import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'notesdb',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
};

let pool: mysql.Pool;

async function createPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    console.log('MySQL Connection Pool 생성');
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
    console.error('DB 쿼리 오류:', error);
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
          originalNote TEXT,
          summary TEXT
        )
      `;
      await query(createTableQuery);
      console.log('notes 테이블 생성 완료');

      // Optionally, insert some default data
      const insertDefaultDataQuery = `
        INSERT INTO notes (category, originalNote, summary) VALUES
          ('Meeting/Internal', '# Hi, *Pluto*!.', '# 盆底修复方法与注意事项'),
          ('Research/Data Analysis', 'Explored new methodologies for data analysis.', 'Data analysis methodologies exploration summary.'),
          ('Personal/Grocery', 'Things to buy from the grocery store.', 'List of grocery items.'),
          ('start/Important', 'Key points for the upcoming presentation.', 'Outline of presentation key points.')
      `;
      await query(insertDefaultDataQuery);
      console.log('기본 데이터 삽입 완료');
    } else {
      console.log('notes 테이블이 이미 존재합니다.');
    }
  } catch (error) {
    console.error('테이블 생성 또는 초기화 중 오류 발생:', error);
    throw error;
  }
}
