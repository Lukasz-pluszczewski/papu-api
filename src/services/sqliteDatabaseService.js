import { createConnection } from 'typeorm';
import path from 'path';
import entities from '../entities';

export const createDatabase = async () => {
  const options = {
    type: 'sqlite',
    database: `${path.resolve(process.env.NODE_PATH, '..')}/data/db.sqlite`,
    entities,
    logging: true,
    synchronize: true,
  };

  return await createConnection(options);
};


export default createDatabase;