import { ExtensionContext, window, workspace } from 'vscode';
import { interfaces } from '../shared';
import { CakeTool } from '../shared/cakeTool';

export async function installCakeDebugCommand(context: ExtensionContext, hideWarning?: boolean): Promise<boolean> {
    // Check if there is an open folder in workspace
    if (workspace.rootPath === undefined) {
        window.showErrorMessage('You have not yet opened a folder.');
        return false;
    }

    const result = await (installCakeTool(context));
    const messages = {
        advice: 'Cake Debug Dependencies correctly installed globally.',
        warning: 'Cake.Tool is already installed globally',
        error: 'Error installing Cake Debug Dependencies.'
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

export async function installCakeTool(context: ExtensionContext): Promise<interfaces.IInstallResult> {
    const tool = new CakeTool(context);
    const installationModified = await tool.ensureInstalled();
    return { installed: true, advice: installationModified };
}
