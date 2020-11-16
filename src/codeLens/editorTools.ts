import { workspace } from 'vscode';

export async function ensureNotDirty(fileName: string) : Promise<boolean> {
    if (
        !workspace.workspaceFolders ||
        workspace.workspaceFolders.length < 1
    ) {
        throw new Error('No open workspace');
    }

    const document = workspace.textDocuments.find(d => d.fileName.toLowerCase() === fileName.toLowerCase());

    if(!document?.isDirty){
        return false;
    }

    await document.save();
    return true;
}