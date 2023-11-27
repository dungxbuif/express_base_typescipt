import { PrismaClient } from '@prisma/client';
import AbstractDatabase from './database.abstract';
import IConnectOption from './intefaces/connect-option.interface';

class AppDatabase extends AbstractDatabase {
   private _database: any;
   private _databases: Record<string, any> = {};
   private _databaseNames: string[] = [];
   instance<T>(name?: string): T {
      if (typeof name === 'undefined') return this._database;
      return this._databases[name];
   }

   public async connect<T>(options?: IConnectOption<T>): Promise<void> {
      const alias = options?.alias;
      const config = options?.config || {};
      this._database = new PrismaClient(config);
      if (typeof alias === 'undefined' && !this._database) {
         this._database = new PrismaClient(config);
         await this._database.$connect();
      } else {
         if (this._databaseNames.includes(alias)) {
            console.error('Database alias already exists');
            process.exit(0);
         }
         this._databases[alias] = await new PrismaClient(config);
         await this._databases[alias].$connect();
         this._databaseNames.push(alias);
      }
   }

   public async disconnect(): Promise<void> {
      this._database.$disconnect();
      process.exit(0);
   }
}
const appDatabase = new AppDatabase();
export default appDatabase;
