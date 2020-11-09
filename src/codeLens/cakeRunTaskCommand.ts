import * as os from 'os';
import { IExtensionSettings } from '../extensionSettings';
import { TerminalExecutor } from '../shared/utils';

export async function installCakeRunTaskCommand(
    taskName: string,
    fileName: string,
    settings: IExtensionSettings
) {
    let buildCommand = settings.taskRunner.launchCommand[os.platform()] || settings.taskRunner.launchCommand.default;
    buildCommand = `${buildCommand} \"${fileName}\" --target=\"${taskName}\" --verbosity=${settings.taskRunner.verbosity}`;

    TerminalExecutor.runInTerminal(buildCommand);
}
