import {window, workspace} from 'vscode';
import * as fs from 'fs';
import {CakeConfiguration} from './cakeConfiguration';

export async function installCakeConfiguration()
{
  // Check if there is an open folder in workspace
  if (workspace.rootPath === undefined) {
      window.showErrorMessage('You have not yet opened a folder.');
      return;
  }

  // Create the configuration object
  let configuration = new CakeConfiguration();

  // Does the configuration already exist?
  var targetPath = configuration.getTargetPath();
  if (fs.existsSync(targetPath)) {
      var message = `Overwrite the existing cake.config file in this folder?`;
      var option = await window.showWarningMessage(message, 'Overwrite');
      if (option !== 'Overwrite') {
          return;
      }
  }

  // Download the configuration and save it to disk.
  var file = fs.createWriteStream(targetPath);
  var result = await configuration.download(file);
  if (result) {
      window.showInformationMessage('Cake configuration downloaded successfully.');
  } else {
      window.showErrorMessage('Error downloading Cake configuration.');
  }
}