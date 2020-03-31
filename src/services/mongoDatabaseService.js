import { MongoClient } from 'mongodb';
import appConfig from 'config';

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

export const createDatabase = (config = appConfig) => new Promise((resolve, reject) => {
  MongoClient.connect(`mongodb://${config.dbHost}/`, { useNewUrlParser: true }, (err, db) => {
    if (err) {
      return reject(err);
    }

    const database = db.db(config.dbName);

    createCappedCollection(database)('currentPlan')
      .then(() => resolve(database))
      .catch(reject);
  });
});

const createMongoService = async (config = appConfig) => {
  const db = await createDatabase(config);

  return {
    db,
    insert: collection => data => {
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
    },
    update: collection => (query, data) => {
      return new Promise((resolve, reject) => {
        db.collection(collection).update(query, data, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },
    replaceOne: collection => (query, data) => {
      return new Promise((resolve, reject) => {
        db.collection(collection).replaceOne(query, data, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },
    find: collection => (query, fields) => {
      return new Promise((resolve, reject) => {
        db.collection(collection).find(query, fields && { projection: fields }).toArray((err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });
    },
    findLast: collection => (query, fields) => {
      return new Promise((resolve, reject) => {
        db.collection(collection).find(query, fields && { projection: fields }).sort({ $natural: -1 }).limit(1).toArray((err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });
    },
    remove: collection => query => {
      return new Promise((resolve, reject) => {
        db.collection(collection).deleteOne(query, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },
    removeAll: collection => query => {
      return new Promise((resolve, reject) => {
        db.collection(collection).deleteMany(query, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },
  };
};

export default createMongoService;
