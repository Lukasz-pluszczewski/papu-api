import _ from 'lodash';
import { ObjectID } from 'mongodb';
import { find, findLast, insert, remove, replaceOne } from 'services/mongoDatabaseService';

const ingredients = {
  '/ingredients': {
    get: ({ db }) => find(db, 'ingredients')({})
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
    post: ({ db, body }) => insert(db, 'ingredients')(body)
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
  },
};

export default ingredients;
