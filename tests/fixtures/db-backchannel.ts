import * as mariadb from 'mariadb';
import path from 'path';
import fs from 'fs';

export class DbBackchannel {
  private static _instances: { [instanceCode: string]: DbBackchannel } = {};
  public static getByInstanceCode = async (instanceCode: string) => {
    if (!this._instances[instanceCode]) {
      const centralConnection = await mariadb.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });

      let result;
      try {
        result = await centralConnection.query<any>(`SELECT data FROM tenants WHERE instance_code = ?`, [instanceCode]);
        let { data } = result[0];

        const self = new DbBackchannel();
        // Create pool so that we can reuse connections
        self.tenantConnectionsPool = mariadb.createPool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: data.tenancy_db_username,
          password: data.tenancy_db_password,
          database: data.tenancy_db_name,
          multipleStatements: true,
          connectionLimit: 15
        });
        this._instances[instanceCode] = self;
      } catch (e) {
        console.error(`Error getting conn. pool for ${instanceCode}. Result: ${JSON.stringify(result)}`, e);
      } finally {
        await centralConnection.end()
      }
    }

    return this._instances[instanceCode];
  }

  /**
   * Use the static method `async DbBackchannel.getInstance()` to initialize a new object of this class.
   */
  private constructor() { }
  private tenantConnectionsPool!: mariadb.Pool;

  public async truncateAll(): Promise<void> {
    await this.runSqlFile(path.join(path.resolve(__dirname, 'sql'), '100-truncate-all.sql'));
  }

  public async seed(): Promise<void> {
    await this.runSqlFile(path.join(path.resolve(__dirname, 'sql'), '120-seed.sql'));
  }

  private async runSqlFile(filePath: string) {
    const sql = fs.readFileSync(filePath, 'utf8');
    await this.query(sql);
  }

  private async query(sql: string | mariadb.QueryOptions, values?: any) {
    const conn = await this.tenantConnectionsPool.getConnection();
    try {
      await conn.query(sql, values);
    } finally {
      await conn.release();
    }
  }
}
