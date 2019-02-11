import { Router as router } from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import _ from 'lodash';
import log from 'all-log';
import { ObjectID } from 'mongodb';

import config from 'config';
import { find, findLast, insert, removeAll, recreateCappedCollection } from 'services/mongoDatabaseService';
import { writeFile } from 'services/files';

const createBackup = async db => {
  const recipes = await find(db, 'recipes')({});
  const plans = await find(db, 'plans')({});
  const currentPlan = await findLast(db, 'currentPlan')({});

  return JSON.stringify({
    recipes,
    plans,
    currentPlan,
    timestamp: Date.now().valueOf(),
    name: config.backupName,
  });
};

const saveSecurityBackup = async db => {
  const securityBackup = await createBackup(db);

  const backupPath = path.resolve(__dirname, '../../backup');

  await writeFile(backupPath, `${JSON.parse(securityBackup).timestamp}-backup.json`, securityBackup);

  return backupPath;
};

const restoreBackup = async (backupJson, db) => {
  const backup = JSON.parse(backupJson);

  if (!backup.name) {
    throw new Error(`Backup seems to be invalid. No backup name found`);
  }
  if (backup.name !== config.backupName) {
    throw new Error(`Backup seems to be created on different instance. Expected backup name is "${config.backupName}" but "${backup.name}" found`);
  }

  const { recipes, plans, currentPlan } = backup;

  const backupPath = await saveSecurityBackup(db);

  console.log(`Restoring backup. Created additional backup in ${backupPath}`);

  await removeAll(db, 'recipes')();
  await removeAll(db, 'plans')();
  await recreateCappedCollection(db, 'currentPlan');

  delete currentPlan[0]._id;

  return Promise.all([
    insert(db, 'recipes')(recipes),
    insert(db, 'plans')(plans),
    insert(db, 'currentPlan')(currentPlan[0]),
  ]);
};

export default ({ db }) => {
  const api = router();

  api.get('/backup', (req, res) => {
    createBackup(db)
      .then(results => {
        res.json(results);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  api.post('/backup', fileUpload(), (req, res) => {
    restoreBackup(req.files.backup.data, db)
      .then(() => {
        res.json({ message: 'Restored backup' });
      })
      .catch(error => {
        console.log('Backup restoring error', error);
        res.status(500).json(error);
      });
  });

  api.delete('/everything', async (req, res) => {
    if (!req.query || !req.query.iamsure) {
      return res.status(400).json({ message: 'Add iamsure query param and think twice! This will remove everything from the DB!' });
    }

    const backupPath = await saveSecurityBackup(db);

    await removeAll(db, 'recipes')();
    await removeAll(db, 'plans')();
    await recreateCappedCollection(db, 'currentPlan');

    console.log(`Cleared DB. Created additional backup in ${backupPath}`);

    res.json({ message: `Cleared DB. Created additional backup.` });
  });

  return api;
};
