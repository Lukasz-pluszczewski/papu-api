import { Router as router } from 'express';
import { ObjectID } from 'mongodb';
import { find, findLast, insert, remove, update } from 'services/mongoDatabaseService';
import fileUpload from 'express-fileupload';
import _ from 'lodash';
import log from 'all-log';

const createBackup = async db => {
  const recipes = await find(db, 'recipes')({});
  const plans = await find(db, 'plans')({});
  const currentPlan = await find(db, 'currentPlan')({});

  return JSON.stringify({
    recipes,
    plans,
    currentPlan,
    timestamp: Date.now().valueOf(),
    name: 'papu-data-backup',
  });
};

export default ({ db }) => {
  const api = router();

  api.get('/backup', (req, res) => {
    createBackup(db)
      .then(res.json)
      .catch(res.status(500).json);
  });

  api.post('/backup', fileUpload(), async (req, res) => {
    log('req.files', JSON.parse(req.files.backup.data));
    res.json({ message: ':)' });
    // res.status(500).json(error);
  });

  return api;
};
