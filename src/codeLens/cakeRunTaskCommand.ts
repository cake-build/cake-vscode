import * as os from 'os';
import { window } from 'vscode';
import { IExtensionSettings } from '../extensionSettings';
import { TerminalExecutor } from '../shared/utils';
import { ensureNotDirty } from './editorTools';

export async function installCakeRunTaskCommand(
    taskName: string,
    fileName: string,
    settings: IExtensionSettings
) {
    if(await ensureNotDirty(fileName)) {
        window.showInformationMessage("Saved file before running task...");
    }

    let buildCommand = settings.taskRunner.launchCommand[os.platform()] || settings.taskRunner.launchCommand.default;
    buildCommand = `${buildCommand} \"${fileName}\" --target=\"${taskName}\" --verbosity=${settings.taskRunner.verbosity}`;

    TerminalExecutor.runInTerminal(buildCommand);
}
