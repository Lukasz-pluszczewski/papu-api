import { MongoClient } from 'mongodb';
import config from 'config';

export const createDatabase = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb://${config.dbHost}/`, (err, db) => {
      if (err) {
        return reject(err);
      }

      const database = db.db(config.dbName);

      // Capped collection.
      const capped = database.collection('currentPlan');

      capped.find().count((err, count) => {
        if (err) {
          reject(err);
        }

        if (count === 0) {
          database.createCollection(
            'currentPlan',
            {
              capped: true,
              max: 5,
              size: 5242880,
            },
            err => {
              if (err) {
                reject(err);
              }

              resolve(database);
            }
          );
        } else {
          resolve(database);
        }
      });
    });
  });
};


export default createDatabase;