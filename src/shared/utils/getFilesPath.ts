import * as fs from 'fs';
import * as path from 'path';
import { flattenNestedArray, handleError } from './';

/**
 * Get files that match extension in regex on first level of given folder
 *
 * @param {string} folderPath
 * @param {RegExp} fileExtensionMatcher
 */
export default function getFilesPath(
    folderPath: string,
    fileExtensionMatcher: RegExp
): Promise<Array<string> | never> {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err: any, files: any) => {
            if (err) {
                return handleError(err, err.message, reject);
            }

            const promises = files.map(
                (fileName: any) =>
                    new Promise(
                        (resolve: (value: Array<string>) => any, reject) => {
                            const filePath = path.resolve(folderPath, fileName);
                            fs.stat(filePath, (err, stats) => {
                                if (err) {
                                    return handleError(
                                        err,
                                        err.message,
                                        reject
                                    );
                                }

                                if (stats) {
                                    if (
                                        stats.isFile() &&
                                        fileExtensionMatcher.test(filePath)
                                    ) {
                                        return resolve([filePath]);
                                    }
                                }
                                resolve([]);
                            });
                        }
                    )
            );

            Promise.all(promises).then(collection => {
                resolve(flattenNestedArray(collection));
            });
        });
    });
}
