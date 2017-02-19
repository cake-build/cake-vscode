import {window, workspace, commands, ExtensionContext} from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {CakeExecutor} from './cakeExecutor';

let cake = new CakeExecutor("cake.execution");

export async function installCakeExecutor()
{
  // Check if there is an open folder in workspace
  if (workspace.rootPath === undefined) {
      window.showErrorMessage('You have not yet opened a folder.');
      return;
  }

  if(window.activeTextEditor == undefined) {
      window.showErrorMessage('You have not yet opened any file.');
      return;
  }

  cake.showTasks();
}