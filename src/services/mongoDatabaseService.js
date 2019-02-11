import { MongoClient } from 'mongodb';
import config from 'config';

const defaultCappedCollectionConfig = {
  max: 5,
  size: 5242880,
};

export const createCappedCollection = database => (name, config = {}) => {
  return new Promise((resolve, reject) => {
    const capped = database.collection(name);

    capped.find().count((err, count) => {
      if (err) {
        reject(err);
      }

      if (count === 0) {
        database.createCollection(
          name,
          {
            capped: true,
            ...config,
            ...defaultCappedCollectionConfig,
          },
          err => {
            if (err) {
              reject(err);
            }

            resolve();
          }
        );
      } else {
        resolve();
      }
    });
  });
};

export const recreateCappedCollection = database => (name, config = {}) => new Promise((resolve, reject) => {
  database.collection(name).drop(err => {
    if (err) {
      reject(err);
    }
    console.log('dropped collection');

    createCappedCollection(database)(name, config).then(resolve).catch(reject);
  });
});

export const createDatabase = () => new Promise((resolve, reject) => {
  MongoClient.connect(`mongodb://${config.dbHost}/`, (err, db) => {
    if (err) {
      return reject(err);
    }

    const database = db.db(config.dbName);

    createCappedCollection(database)('currentPlan')
      .then(() => resolve(database))
      .catch(reject);
  });
});

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
  return new Promise((resolve, reject) => {
    db.collection(collection).update(query, data, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

export const replaceOne = (db, collection) => (query, data) => {
  return new Promise((resolve, reject) => {
    console.log('will replace', collection, query, data);
    db.collection(collection).replaceOne(query, data, (err, result) => {
      console.log('replaced', err, result);
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

export const removeAll = (db, collection) => (query = {}) => {
  return new Promise((resolve, reject) => {
    db.collection(collection).deleteMany(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};


export default createDatabase;