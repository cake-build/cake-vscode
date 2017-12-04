import { window, workspace } from 'vscode';
import { truncateFilePath } from './';
import { CANCEL } from '../../constants';

function getPlaceholder(action: string): string {
    return `Which file do you wish to ${action.toLowerCase()} this dependency?`;
}

export default function showFileQuickPick(foundFiles: Array<string>, action: string): Thenable<string> | Thenable<never> {
    // Truncate used file paths for readability, mapping the truncated string to the full path
    // for easy retrieval once a truncated path is picked by the user.
    const rootPath = workspace.rootPath == null ? '' : workspace.rootPath;
    const truncatedPathMap = foundFiles.reduce((newMap, filePath) => {
        newMap[truncateFilePath(filePath, rootPath)] = filePath;
        return newMap;
    }, {});

    return window.showQuickPick(Object.keys(truncatedPathMap), {
        placeHolder: getPlaceholder(action)
    }).then<string | Promise<never>>((choice?: string) => {
        if (!choice) {
            // User canceled.
            return Promise.reject(CANCEL);
        }

        return truncatedPathMap[choice];
    });
}