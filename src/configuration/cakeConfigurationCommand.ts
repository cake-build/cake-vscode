import { window, workspace } from 'vscode';
import * as fs from 'fs';
import { CakeConfiguration } from './cakeConfiguration';
import { utils } from '../shared';
import { CANCEL } from '../constants';

export async function installCakeConfigurationCommand() {
    // Check if there is an open folder in workspace
    if (workspace.rootPath === undefined) {
        window.showErrorMessage('You have not yet opened a folder.');
        return;
    }

    var result = await installCakeConfiguration();

    if (result) {
        window.showInformationMessage(
            'Cake configuration downloaded successfully.'
        );
    } else {
        window.showErrorMessage('Error downloading Cake configuration.');
    }
}

export async function installCakeConfiguration(): Promise<boolean> {
    // Create the configuration object
    let configuration = new CakeConfiguration();

    // Does the configuration already exist?
    var targetPath = configuration.getTargetPath();
    var ready = utils.checkForExisting(targetPath);

    if (!ready) {
        Promise.reject(CANCEL);
    }

    // Download the configuration and save it to disk.
    var file = fs.createWriteStream(targetPath);
    var result = await configuration.download(file);
    return result;
}
