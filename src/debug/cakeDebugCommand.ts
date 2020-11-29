import { ExtensionContext, window, workspace } from 'vscode';
import * as fs from 'fs';
import { CakeDebug } from './cakeDebug';
import { CakeTool } from './cakeTool';

export async function installCakeDebugCommand(context: ExtensionContext, hideWarning?: boolean): Promise<boolean> {
    // Check if there is an open folder in workspace
    if (workspace.rootPath === undefined) {
        window.showErrorMessage('You have not yet opened a folder.');
        return false;
    }

    const selection = await window.showQuickPick([
        'Cake.Tool',
        'Cake.CoreCLR'
    ]);

    if(!selection){
        return false;
    }

    const isCakeTool = selection === 'Cake.Tool';
    const result = await (isCakeTool ? installCakeTool(context)  : installCakeDebug());
    const messages = {
        advice: isCakeTool ?
            'Cake Debug Dependencies correctly installed globally.' :
            'Cake Debug Dependencies correctly downloaded.',
        warning: isCakeTool ? 
            'Cake.Tool is already installed globally' :
            'Cake.CoreCLR package has already been installed.',
        error: isCakeTool ? 
            'Error installing Cake Debug Dependencies' : 
            'Error downloading Cake Debug Dependencies'
    }

    if (result.installed) {
        if (result.advice) {
            window.showInformationMessage(messages.advice);
        } else if (!hideWarning) {
            window.showWarningMessage(messages.warning);
        }
    } else {
        window.showErrorMessage(messages.error);
        return false;
    }

    return true;
}

interface IInstallResult {
    installed: boolean;
    advice: boolean;
}

export async function installCakeDebug(): Promise<IInstallResult> {
    let debug = new CakeDebug();

    var targetPath = debug.getTargetPath();
    if (fs.existsSync(targetPath)) {
        return { installed: true, advice: false };
    }

    var result = await debug.downloadAndExtract();
    return { installed: result, advice: true };
}

async function installCakeTool(context: ExtensionContext): Promise<IInstallResult> {
    const tool = new CakeTool(context);
    const installationModified = await tool.ensureInstalled();
    return { installed: true, advice: installationModified };
}
