import * as os from 'os';
import { IExtensionSettings } from '../extensionSettings';
import { TerminalExecutor } from '../shared/utils';

export async function installCakeRunTaskCommand(
    taskName: string,
    fileName: string,
    settings: IExtensionSettings
) {
    let buildCommand = settings.taskRunner.buildScript[os.platform()] || settings.taskRunner.buildScript.default;
    buildCommand = `${buildCommand} --script=\"${fileName}\" --target=\"${taskName}\" --verbosity=${settings.codeLens.runTask.verbosity}`;

    TerminalExecutor.runInTerminal(buildCommand);
}
