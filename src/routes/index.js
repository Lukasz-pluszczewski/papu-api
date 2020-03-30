import recipes from './recipes';
import ingredients from './ingredients';
import plans from './plans';
import forms from './forms';
import backup from './backup';

export default {
  '/health': ({ db }) => ({
    status: 'healthy',
    dbConnected: db.serverConfig.isConnected(),
  }),
  ...recipes,
  ...ingredients,
  ...plans,
  ...forms,
  ...backup,
};
