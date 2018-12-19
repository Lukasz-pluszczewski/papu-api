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

export const insert = (db, collection) => (data) => {
  return new Promise((resolve, reject) => {
    if (Array.isArray(data)) {
      return db.collection(collection).insertMany(data, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    }
    db.collection(collection).insertOne(data, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

export const update = (db, collection) => (query, data) => {
  console.log('updating', query, data);
  return new Promise((resolve, reject) => {
    db.collection(collection).update(query, data, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

export const find = (db, collection) => (query, fields) => {
  return new Promise((resolve, reject) => {
    db.collection(collection).find(query, fields && { projection: fields }).toArray((err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

export const findLast = (db, collection) => (query, fields) => {
  return new Promise((resolve, reject) => {
    db.collection(collection).find(query, fields && { projection: fields }).sort({ $natural: -1 }).limit(1).toArray((err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

export const remove = (db, collection) => query => {
  return new Promise((resolve, reject) => {
    db.collection(collection).deleteOne(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};



export default createDatabase;