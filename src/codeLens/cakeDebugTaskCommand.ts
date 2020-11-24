import { IExtensionSettings } from '../extensionSettings';
import { CakeDebugTask } from './cakeDebugTask';

export async function installCakeDebugTaskCommand(
    taskName: string,
    fileName: string,
    debugConfig: IExtensionSettings
) {
    const debugTask = new CakeDebugTask();
    debugTask.debug(taskName, fileName, debugConfig);
}
