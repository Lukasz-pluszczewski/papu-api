import simpleExpress from 'simple-express-framework';

import checkPassword from 'middleware/checkPassword';
import config from './config';
import routes from './routes';

import createDatabase from './services/mongoDatabaseService';

(async function () {
  if (!config.password && process.env.ENV !== 'development') {
    throw new Error('Password not set. Set the value in ADMIN_PASSWORD env variable.');
  }

  const db = await createDatabase();

  simpleExpress({
    port: config.port,
    routes,
    routeParams: { db },
    expressMiddlewares: [
      checkPassword(config.password),
    ],
  })
    .then(({ app }) => console.log(`App started on port ${app.server.address().port}`))
    .catch(error => console.log('App initialization failed', error));
})();
