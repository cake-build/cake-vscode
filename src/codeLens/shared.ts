import { workspace } from 'vscode';
import { CakeTool } from '../debug/cakeTool';
import { IExtensionSettings } from '../extensionSettings';
import { logError, logInfo } from '../shared/log';

export async function ensureNotDirty(fileName: string) : Promise<void> {
    if (
        !workspace.workspaceFolders ||
        workspace.workspaceFolders.length < 1
    ) {
        throw new Error('No open workspace');
    }

    const document = workspace.textDocuments.find(d => d.fileName.toLowerCase() === fileName.toLowerCase());

    if(!document?.isDirty){
        return;
    }

    await document.save();
    logInfo("Saved file before running task...", true);
}

export async function installCakeToolIfNeeded(settings: IExtensionSettings) {
    if(settings.codeLens.installNetTool) {
        const cakeTool = new CakeTool();
        try {
            await cakeTool.ensureInstalled();
        }
        catch (ex) {
            logError("Error installing Cake .NET Tool", true);
            logError(ex);
        }
    }
}