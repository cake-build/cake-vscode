import { CakeDebugTask } from './cakeDebugTask';

export async function installCakeDebugTaskCommand(
    taskName: string,
    fileName: string,
    debugConfig: any
) {
    const debugTask = new CakeDebugTask();
    debugTask.debug(taskName, fileName, debugConfig);
}
