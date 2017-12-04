export default function truncateFilePath(filePath: string, rootPath: string | undefined): string {
    if (!rootPath) { // Can be undefined if no folder is open in VS Code.
        throw new Error('Unable to locate a workspace root path! Please open a workspace and try again.');
    }

    // return filePath.replace(rootPath, '{root}');
    return filePath.replace(rootPath, '');
}