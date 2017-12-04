import * as fs from 'fs';
import * as path from 'path';
import { flattenNestedArray, handleError } from './';

export default function getFilePath(rootPath: string, fileExtensionMatcher: RegExp): Promise<Array<string> | never> {
  return new Promise((resolve, reject) => {
    fs.readdir(rootPath, (err: any, files: any) => {
      if (err) {
        return handleError(err, err.message, reject);
      }

      const promises = files.map(
        (fileName: any) =>
          new Promise((resolve: (value: Array<string>) => any, reject) => {
            const filePath = path.resolve(rootPath, fileName);
            fs.stat(filePath, (err, stats) => {
              if (err) {
                return handleError(err, err.message, reject);
              }

              if (stats) {
                if (stats.isFile() && fileExtensionMatcher.test(filePath)) {
                  return resolve([filePath]);
                }
              }
              resolve([]);
            });
          })
      );

      Promise.all(promises).then(collection => {
        resolve(flattenNestedArray(collection));
      });
    });
  });
}
