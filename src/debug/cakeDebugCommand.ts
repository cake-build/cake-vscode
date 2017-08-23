import { window, workspace } from 'vscode';
import * as fs from 'fs';
import { CakeDebug } from './cakeDebug';

export async function installCakeDebugCommand() {
    // Check if there is an open folder in workspace
    if (workspace.rootPath === undefined) {
        window.showErrorMessage('You have not yet opened a folder.');
        return;
    }

    var result = await installCakeDebug();

    if(result) {
        window.showInformationMessage("Cake Debug Dependencies correctly downloaded.");
    } else {
        window.showErrorMessage("Error downloading Cake Debug Dependencies");
    }
}

export async function installCakeDebug(): Promise<boolean> {
    // Create the debug object
    let debug = new CakeDebug();

    var targetPath = debug.getTargetPath();
    if (fs.existsSync(targetPath)) {
        window.showWarningMessage("Cake.CoreCLR package has already been installed.");
        return false;
    }

    var result = await debug.downloadAndExtract();
    return result;
}