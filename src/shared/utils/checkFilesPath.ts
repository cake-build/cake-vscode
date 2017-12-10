import { handleError, getFilesPath } from './';
import {
    CAKE_FILE_EXTENSION_MATCHER,
    CAKE_FILE_EXTENSION
} from './../../constants';

/**
 * Check files that match extension in regex on first level of given folder
 *
 * @param {string} folderPath
 * @param {string} fileExtension
 * @param {RegExp} fileExtensionMatcher
 */
export function checkFilesPath(
    folderPath: string,
    fileExtensionMatcher: RegExp,
    fileExtension: string,
    folderMessage: string
): Promise<Array<string> | never> {
    return getFilesPath(folderPath, fileExtensionMatcher).then<
        Array<string> | never
    >((foundFiles: Array<string>) => {
        if (foundFiles.length < 1) {
            return handleError<Promise<never>>(
                null,
                `Cannot find any ${fileExtension} file on the ${folderMessage} of your project! Please try again.`,
                Promise.reject.bind(Promise)
            );
        }
        return foundFiles;
    });
}

/**
 * Check cake files on first level of given folder
 *
 * @param {string} folderPath
 */
export function checkCakeFilesPath(
    folderPath: string
): Promise<Array<string> | never> {
    return checkFilesPath(
        folderPath,
        CAKE_FILE_EXTENSION_MATCHER,
        CAKE_FILE_EXTENSION,
        'root'
    );
}
