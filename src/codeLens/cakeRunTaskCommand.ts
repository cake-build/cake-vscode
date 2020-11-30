import { ExtensionContext } from 'vscode';
import { getPlatformSettingsValue, IExtensionSettings } from '../extensionSettings';
import { TerminalExecutor } from '../shared/utils';
import { ensureNotDirty, installCakeToolIfNeeded } from './shared';

export async function installCakeRunTaskCommand(
    taskName: string,
    fileName: string,
    settings: IExtensionSettings,
    context: ExtensionContext
) {
    await ensureNotDirty(fileName);
    await installCakeToolIfNeeded(settings, context);
    
    let buildCommand = getPlatformSettingsValue(settings.taskRunner.launchCommand);
    buildCommand = `${buildCommand} \"${fileName}\" --target=\"${taskName}\" --verbosity=${settings.taskRunner.verbosity}`;

    TerminalExecutor.runInTerminal(buildCommand);
}
