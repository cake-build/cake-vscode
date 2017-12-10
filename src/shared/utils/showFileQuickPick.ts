import { window, workspace } from 'vscode';
import { truncateFilePath } from './';
import { CANCEL } from '../../constants';

function _getPlaceholder(action: string): string {
    return `Which file do you wish to ${action.toLowerCase()} this dependency?`;
}

/**
 * Show quick pick to choose one file from given files
 *
 * @param {string[]} files
 * @param {string} action
 */
export default function showFileQuickPick(
    files: Array<string>,
    action: string
): Thenable<string> | Thenable<never> {
    // Truncate used file paths for readability, mapping the truncated string to the full path
    // for easy retrieval once a truncated path is picked by the user.
    const rootPath = workspace.rootPath == null ? '' : workspace.rootPath;
    const truncatedPathMap = files.reduce((newMap: any, filePath: string) => {
        newMap[truncateFilePath(filePath, rootPath)] = filePath;
        return newMap;
    }, {});

    return window
        .showQuickPick(Object.keys(truncatedPathMap), {
            placeHolder: _getPlaceholder(action)
        })
        .then<string | never>((choice?: string) => {
            if (!choice) {
                // User canceled.
                return Promise.reject(CANCEL);
            }

            return truncatedPathMap[choice];
        });
}
