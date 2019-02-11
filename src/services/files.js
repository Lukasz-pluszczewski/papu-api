import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

export const writeFile = (directory, fileName, data) => {
  return new Promise((resolve, reject) => {
    mkdirp(directory, error => {
      if (error) {
        return reject(error);
      }

      fs.writeFile(path.resolve(directory, fileName), data, error => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  });
};
