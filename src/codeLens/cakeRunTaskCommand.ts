import { window } from 'vscode';
import { getPlatformSettingsValue, IExtensionSettings } from '../extensionSettings';
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

    let buildCommand = getPlatformSettingsValue(settings.taskRunner.launchCommand);
    buildCommand = `${buildCommand} \"${fileName}\" --target=\"${taskName}\" --verbosity=${settings.taskRunner.verbosity}`;

    TerminalExecutor.runInTerminal(buildCommand);
}
