import path from 'path';
import fileUpload from 'express-fileupload';
import { wrapMiddleware } from 'simple-express-framework';

import config from 'config';
import { find, findLast, insert, removeAll, recreateCappedCollection } from 'services/mongoDatabaseService';
import { writeFile } from 'services/files';

const createBackup = async db => {
  const recipes = await db.find('recipes')({});
  const plans = await db.find('plans')({});
  const currentPlan = await db.findLast('currentPlan')({});

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

  await db.removeAll('recipes')();
  await db.removeAll('plans')();
  await recreateCappedCollection(db, 'currentPlan');

  delete currentPlan[0]._id;

  return Promise.all([
    db.insert('recipes')(recipes),
    db.insert('plans')(plans),
    db.insert('currentPlan')(currentPlan[0]),
  ]);
};

export default {
  '/backup': {
    get: ({ db }) => createBackup(db)
      .then(results => ({
        body: results,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
    post: [
      wrapMiddleware(fileUpload()),
      ({ req, db }) => restoreBackup(req.files.backup.data, db)
        .then(() => ({
          body: { message: 'Restored backup' },
        }))
        .catch(error => {
          console.log('Backup restoring error', error);
          return {
            status: 500,
            body: error,
          };
        }),
    ],
  },
  '/everything': {
    delete: async ({ query, db }) => {
      if (!query.iamsure) {
        return {
          status: 400,
          body: { message: 'Add iamsure query param and think twice! This will remove everything from the DB!' },
        };
      }

      const backupPath = await saveSecurityBackup(db);

      await db.removeAll('recipes')();
      await db.removeAll('plans')();
      await recreateCappedCollection(db.db, 'currentPlan');

      console.log(`Cleared DB. Created additional backup in ${backupPath}`);

      return {
        body: { message: `Cleared DB. Created additional backup.` },
      };
    },
  }
};
