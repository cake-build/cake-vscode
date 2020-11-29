import { ExtensionContext, window, workspace } from 'vscode';
import * as fs from 'fs';
import { enums, interfaces } from '../shared';
import { CakeDebug } from '../shared/cakeDebug';
import { CakeTool } from '../shared/cakeTool';

export async function installCakeDebugCommand(context: ExtensionContext, hideWarning?: boolean): Promise<boolean> {
    // Check if there is an open folder in workspace
    if (workspace.rootPath === undefined) {
        window.showErrorMessage('You have not yet opened a folder.');
        return false;
    }

    const selection = await window.showQuickPick([
        enums.DebugType.NetTool,
        enums.DebugType.NetCore
    ]);

    if(!selection){
        return false;
    }

    const isCakeTool = selection as enums.DebugType === enums.DebugType.NetTool;
    const result = await (isCakeTool ? installCakeTool(context)  : installCakeDebug());
    const messages = {
        advice: isCakeTool ?
            'Cake Debug Dependencies correctly installed globally.' :
            'Cake Debug Dependencies correctly downloaded.',
        warning: isCakeTool ?
            'Cake.Tool is already installed globally' :
            'Cake.CoreCLR package has already been installed.',
        error: isCakeTool ?
            'Error installing Cake Debug Dependencies.' :
            'Error downloading Cake Debug Dependencies.'
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

export async function installCakeDebug(): Promise<interfaces.IInstallResult> {
    let debug = new CakeDebug();

    var targetPath = debug.getTargetPath();
    if (fs.existsSync(targetPath)) {
        return { installed: true, advice: false };
    }

    var result = await debug.downloadAndExtract();
    return { installed: result, advice: true };
}

export async function installCakeTool(context: ExtensionContext): Promise<interfaces.IInstallResult> {
    const tool = new CakeTool(context);
    const installationModified = await tool.ensureInstalled();
    return { installed: true, advice: installationModified };
}
