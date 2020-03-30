import { ObjectID } from 'mongodb';
import { find, findLast, insert } from 'services/mongoDatabaseService';

const plans = {
  '/plans': {
    get: ({ db }) => find(db, 'plans')({}, { plan: false })
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
    post: ({ body, db }) => insert(db, 'plans')(body)
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
  },
  '/plans/current': {
    get: ({ db }) => findLast(db, 'currentPlan')({})
      .then(result => ({
        body: result && result[0],
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
    post: ({ body, db }) => insert(db, 'currentPlan')(body)
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
  },
  '/plans/:id': {
    get: ({ params, db }) => find(db, 'plans')({ _id: ObjectID(params.id) })
      .then(result => ({
        body: result && result[0],
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
  },
};

export default plans;
