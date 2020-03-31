import { ObjectID } from 'mongodb';

const plans = {
  '/plans': {
    get: ({ db }) => db.find('plans')({}, { plan: false })
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
    post: ({ body, db }) => db.insert('plans')(body)
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
  },
  '/plans/current': {
    get: ({ db }) => db.findLast('currentPlan')({})
      .then(result => ({
        body: result && result[0],
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
    post: ({ body, db }) => db.insert('currentPlan')(body)
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
  },
  '/plans/:id': {
    get: ({ params, db }) => db.find('plans')({ _id: ObjectID(params.id) })
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
