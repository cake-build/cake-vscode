import { window, workspace } from 'vscode';
import { CakeBuildFile } from './cakeBuildFile';
import { messages, utils } from "../shared";
import { DEFAULT_SCRIPT_NAME, CANCEL } from "../constants";

export async function installBuildFileCommand() {
    // Check if there is an open folder in workspace
    if (workspace.rootPath === undefined) {
        window.showErrorMessage('You have not yet opened a folder.');
        return;
    }

    var name = await window.showInputBox({
        placeHolder: messages.PROMPT_SCRIPT_NAME,
        value: DEFAULT_SCRIPT_NAME
    });

    if (!name) {
        window.showWarningMessage('No script name provided! Try again and make sure to provide a file name.');
        return;
    }

    var result = await installBuildFile(name);

    if (result) {
        window.showInformationMessage("Sample Build Cake File successfully created.");
    } else {
        window.showErrorMessage("Error creating Sample Build Cake File.");
    }
}

export async function installBuildFile(fileName: string): Promise<boolean> {
    // Create the buildFile object
    let buildFile = new CakeBuildFile(fileName);

    var targetPath = buildFile.getTargetPath();
    var ready = await utils.checkForExisting(targetPath);

    if (!ready) {
        Promise.reject(CANCEL);
    }

    var result = await buildFile.create();
    return result;
}

/*
export function installBuildFile(fileName: string): Thenable<boolean> {
    return new Promise((resolve, reject) => {
        // Create the buildFile object
        let buildFile = new CakeBuildFile(fileName);

        var targetPath = buildFile.getTargetPath();
        utils.checkForExisting(targetPath)
            .then(v => {
                if (!v) {
                    reject(CANCEL);
                }
                buildFile.create()
                    .then(_ => resolve(true), _ => reject(false));
            }, _ => reject(false));
    })

}
*/