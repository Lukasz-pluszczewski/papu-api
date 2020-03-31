import _ from 'lodash';
import { ObjectID } from 'mongodb';

const recipes = {
  '/recipes': {
    get: ({ query, db }) => {
      const mongoQuery = {};
      if (query.ingredient) {
        mongoQuery.ingredients = { $elemMatch: { ingredient: query.ingredient } };
      }

      if (!_.isNil(query.type)) {
        mongoQuery.type = parseInt(query.type);
      }

      return db.find('recipes')(mongoQuery)
        .then(result => ({
          body: result,
        }))
        .catch(error => ({
          status: 500,
          body: error,
        }));
    },
    post: ({ body, db }) => db.insert('recipes')(body)
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
  },
  '/recipes/:id': {
    put: ({ params, body, db }) =>
      db.replaceOne('recipes')({ $or: [{ _id: ObjectID(params.id) }, { _id: params.id }] }, body) // for some unknown reason some documents cannot be found using only one of these methods
        .then(result => ({
          body: result,
        }))
        .catch(error => ({
          status: 500,
          body: error,
        })),
    delete: ({ params, db }) =>
      db.remove('recipes')({ $or: [{ _id: ObjectID(params.id) }, { _id: params.id }] })
        .then(result => ({
          body: result,
        }))
        .catch(error => ({
          status: 500,
          body: error,
        })),
  },
};

export default recipes;
