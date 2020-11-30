import { ExtensionContext } from 'vscode';
import { IExtensionSettings } from '../extensionSettings';
import { CakeDebugTask } from './cakeDebugTask';

export async function installCakeDebugTaskCommand(
    taskName: string,
    fileName: string,
    debugConfig: IExtensionSettings,
    context: ExtensionContext
) {
    const debugTask = new CakeDebugTask(context);
    debugTask.debug(taskName, fileName, debugConfig);
}
