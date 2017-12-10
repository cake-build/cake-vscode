import { WORKSPACE_ROOTPATH_ERROR } from '../messages';

/**
 * Truncate file path using the given workspace root path
 *
 * @param {string} filePath,
 * @param {string} rootPath
 */
export default function truncateFilePath(
    filePath: string,
    rootPath: string | undefined
): string {
    if (!rootPath) {
        // Can be undefined if no folder is open in VS Code.
        throw new Error(
            WORKSPACE_ROOTPATH_ERROR
        );
    }

    return filePath.replace(rootPath, '');
}
