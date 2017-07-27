import { window, workspace } from 'vscode';
import * as fs from 'fs';
import { CakeBuildFile } from './cakeBuildFile';

export async function installBuildFile() {
    // Check if there is an open folder in workspace
    if (workspace.rootPath === undefined) {
        window.showErrorMessage('You have not yet opened a folder.');
        return;
    }

    // Create the buildFile object
    let buildFile = new CakeBuildFile();

    var targetPath = buildFile.getTargetPath();
    if (fs.existsSync(targetPath)) {
        window.showWarningMessage("build.cake file has already been installed.");
        return;
    }

    var result = await buildFile.create();

    if(result) {
        window.showInformationMessage("Sample Build Cake File successfully created.");
    } else {
        window.showErrorMessage("Error creating Sample Build Cake File.");
    }
}