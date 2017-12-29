import { window, workspace } from 'vscode';
import * as fs from 'fs';
import { CakeDebug } from './cakeDebug';

export async function installCakeDebugCommand(hideWarning?: boolean): Promise<boolean> {
    // Check if there is an open folder in workspace
    if (workspace.rootPath === undefined) {
        window.showErrorMessage('You have not yet opened a folder.');
        return false;
    }

    var result = await installCakeDebug();

    if (result.installed) {
        if (result.advice) {
            window.showInformationMessage(
                'Cake Debug Dependencies correctly downloaded.'
            );
        } else if (!hideWarning) {
            window.showWarningMessage(
                'Cake.CoreCLR package has already been installed.'
            );
        }
    } else {
        window.showErrorMessage('Error downloading Cake Debug Dependencies');
        return false;
    }

    return true;
}

export async function installCakeDebug(): Promise<any> {
    let debug = new CakeDebug();

    var targetPath = debug.getTargetPath();
    if (fs.existsSync(targetPath)) {
        return { installed: true, advice: false };
    }

    var result = await debug.downloadAndExtract();
    return { installed: result, advice: true };
}
