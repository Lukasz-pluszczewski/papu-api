import { Router as router } from 'express';
import { ObjectID } from 'mongodb';
import _ from 'lodash';
import { find, findLast, insert, remove, replaceOne } from 'services/mongoDatabaseService';

import sjp from 'services/sjpParser';

export default ({ db }) => {
  const api = router();

  api.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      dbConnected: db.serverConfig.isConnected(),
    });
  });

  api.get('/recipes', async (req, res) => {
    const query = {};
    if (req.query.ingredient) {
      query.ingredients = { $elemMatch: { ingredient: req.query.ingredient } };
    }

    if (!_.isNil(req.query.type)) {
      query.type = parseInt(req.query.type);
    }

    find(db, 'recipes')(query)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  api.post('/recipes', async (req, res) => {
    insert(db, 'recipes')(req.body)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  api.put('/recipes/:id', async (req, res) => {
    replaceOne(db, 'recipes')({ _id: ObjectID(req.params.id) }, req.body)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  api.delete('/recipes/:id', async (req, res) => {
    remove(db, 'recipes')({ _id: req.params.id })
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  api.get('/ingredients', async (req, res) => {
    find(db, 'ingredients')({})
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  api.post('/ingredients', async (req, res) => {
    insert(db, 'ingredients')(req.body)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  api.get('/forms/:word', async (req, res) => {
    sjp
      .getForms(req.params.word)
      .then(result => res.json(result))
      .catch(error => res.status(500).json(error));
  });

  /* plans */
  api.get('/plans/current', async (req, res) => {
    findLast(db, 'currentPlan')({})
      .then(result => {
        res.status(200).json(result && result[0]);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  api.post('/plans/current', async (req, res) => {
    insert(db, 'currentPlan')(req.body)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  api.get('/plans/:id', async (req, res) => {
    find(db, 'plans')({ _id: ObjectID(req.params.id) })
      .then(result => {
        res.status(200).json(result && result[0]);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  api.get('/plans', async (req, res) => {
    find(db, 'plans')({}, { plan: false })
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  api.post('/plans', async (req, res) => {
    insert(db, 'plans')(req.body)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  return api;
};
