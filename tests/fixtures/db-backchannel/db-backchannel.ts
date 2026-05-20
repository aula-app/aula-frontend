import * as mariadb from 'mariadb';
import path from 'path';
import fs from 'fs';
import { RoomData, UserData } from '../../support/types';
import { gensym } from '../../support/utils';

// @TODO: make this work not only on GH Action, but also locally
export class DbBackchannel {
  private static _instances: { [instanceCode: string]: DbBackchannel } = {};
  public static getByInstanceCode = async (instanceCode: string) => {
    if (!this._instances[instanceCode]) {
      const self = new DbBackchannel();
      const centralConnection = await mariadb.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });
      try {
        let result = await centralConnection.query<any>(`SELECT data FROM tenants WHERE instance_code = ?`, [instanceCode]);
        let { data } = result[0];
        // if (!data) {
        //   const filePath = path.join(path.resolve(__dirname, 'sql'), '010-tenant.sql');
        //   const sql = fs.readFileSync(filePath, 'utf8');
        //   await centralConnection.query(sql, { instance_code: instanceCode });
        //   result = await centralConnection.query<any>(`SELECT data FROM tenants WHERE instance_code = ?`, [instanceCode]);
        //   data = result[0].data;
        // }

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

  public async insertRoom(roomData: RoomData) {
    const hashId = gensym('room-hashid-' + roomData.name);
    await this.query({
      namedPlaceholders: true,
      sql: `
        INSERT INTO \`au_rooms\` (
          room_name, description_internal, hash_id, status, type
        ) VALUES (
          :name, :description, :hash_id, 1, 0
        );
      `}, {
      name: roomData.name,
      description: roomData.description,
      hash_id: hashId
    });
    await this.query({
      namedPlaceholders: true,
      sql: `
        INSERT INTO \`au_rel_rooms_users\` (
          room_name, description_internal, hash_id, status, type
        ) VALUES (
          :name, :description, :hash_id, 1, 0
        );
      `}, {
      name: roomData.name,
      description: roomData.description,
      hash_id: hashId
    });
    // UPDATE \`au_users_basedata\` (
  }

  public async insertUser(userData: UserData) {
    userData.hashId ||= gensym('user-hashid-');
    // password is always bcrypt(4, 'aula')
    // await conn.query(`SELECT 1`);
    await this.query({
      namedPlaceholders: true,
      sql: `
        INSERT INTO \`au_users_basedata\` (
          displayname, realname, username, email, pw, hash_id, 
          userlevel, about_me, registration_status, status, created, last_update, presence, pw_changed, roles
        ) VALUES (
          :displayname, :realname, :username, :email, 
          '$2a$04$nacjQt60gWeND/lAhkUQW./9JkP3cxDSswXHOnzDI3wCsxe3NQzum',
          :hash_id, :userlevel, :about,
          2, 1, NOW(), NOW(), 1, 1, '[]'
        );
      `}, {
      displayname: userData.displayName,
      realname: userData.realName,
      username: userData.username,
      email: userData.email || null,
      hash_id: userData.hashId,
      userlevel: userData.role,
      about: userData.about
    });
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
