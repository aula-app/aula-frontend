import * as mariadb from 'mariadb';
import path from 'path';
import fs from 'fs';

async function runSqlFile(client: mariadb.Connection, filePath: string) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await client.query(sql);
}

// @TODO: make this work not only on GH Action, but also locally
export async function cleanupAllTestData(): Promise<void> {
  let conn;
  try {
    // Use central DB to find tenant DB connection parameters of the DB used for tests
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    const result = await conn.query<any>(`SELECT data FROM tenants WHERE instance_code = "SINGLE"`);
    const { data } = result[0];

    // Create pool so that we can pass whole files (multipleStatements: true) for easier setup
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: data.tenancy_db_username,
      password: data.tenancy_db_password,
      database: data.tenancy_db_name,
      multipleStatements: true
    });

    const baseDir = path.resolve(__dirname, 'db');
    await runSqlFile(conn, path.join(baseDir, 'truncate-all.sql'));
    await runSqlFile(conn, path.join(baseDir, 'seed.sql'));

  } finally {
    if (conn) conn.destroy();
  }
}

export async function cleanupAuthStates(): Promise<void> {
  const authStatesDir = path.join(process.cwd(), 'tests/auth-states');
  try {
    if (fs.existsSync(authStatesDir)) {
      for (const file of fs.readdirSync(authStatesDir)) {
        fs.unlinkSync(path.join(authStatesDir, file));
        console.info(`  ✅ Deleted: ${file}`);
      }
      console.info('🧹 Cleaned up auth-states directory');
    }
  } catch (error) {
    console.error('❌ Error cleaning up auth-states:', error);
  }
}
