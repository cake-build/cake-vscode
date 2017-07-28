import { window, workspace } from 'vscode';
import * as fs from 'fs';
import { CakeDebug } from './cakeDebug';

export async function installCakeDebug() {
    // Check if there is an open folder in workspace
    if (workspace.rootPath === undefined) {
        window.showErrorMessage('You have not yet opened a folder.');
        return;
    }

    // Create the debug object
    let debug = new CakeDebug();

    var targetPath = debug.getTargetPath();
    if (fs.existsSync(targetPath)) {
        window.showWarningMessage("Cake.CoreCLR package has already been installed.");
        return;
    }

    var result = await debug.downloadAndExtract();

    if (result) {
        window.showInformationMessage("Cake Debug Dependencies correctly downloaded.");
    } else {
        window.showErrorMessage("Error downloading Cake Debug Dependencies");
    }
}