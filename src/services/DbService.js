import config from 'config';
import low from 'lowdb';
import lodashId from 'lodash-id';
import FileSync from 'lowdb/adapters/FileSync';
import initial from 'models/initial';

export const dbService = {
  database: null,
  initializeDb() {
    const adapter = new FileSync(config.db.fileName);
    const db = low(adapter);
    db._.mixin(lodashId);

    db.defaults(initial).write();
    dbService.database = db;
    return db;
  },
  getDb() {
    if (dbService.database) {
      return dbService.database;
    }
    return dbService.initializeDb();
  },
};

export default dbService.getDb;
