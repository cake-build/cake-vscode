'use strict';

import {window, workspace, commands, ExtensionContext} from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {Bootstrapper} from './bootstrapper';

export function activate(context: ExtensionContext) : void {

	let disposable = commands.registerCommand('cake.bootstrapper', async () => {
        
        var platformName = await window.showQuickPick(Bootstrapper.getPlatformOptions(process.platform));
        
        if (platformName == null)
            return;
        
        //check if there is an open folder in workspace
        if (workspace.rootPath === undefined) {
            window.showErrorMessage('You have not yet opened a folder.');
            return;
        }
        
        let bootstrapper = new Bootstrapper(platformName);
        var buildFilePath = path.join(workspace.rootPath, bootstrapper.buildFilename);
        
        if (fs.existsSync(buildFilePath)) {
            var option = await window.showWarningMessage(`Overwrite the existing ${bootstrapper.buildFilename} file in this folder ?`, 'Overwrite');
            
            if (option !== 'Overwrite')
                return;
        }
        
        var file = fs.createWriteStream(buildFilePath);
        var result = await bootstrapper.download(file);

        if (result) {
            
            if (process.platform !== 'win32')
                fs.chmod(buildFilePath, 0o755);

            window.showInformationMessage('Cake bootstrapper downloaded successfully');
        } else {
            window.showErrorMessage('Error downloading Cake bootstrapper');
        }
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
}