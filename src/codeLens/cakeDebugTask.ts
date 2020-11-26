import {
    window,
    debug,
    workspace,
    DebugConfiguration,
    ExtensionContext
} from 'vscode';
import { ensureNotDirty, installCakeToolIfNeeded } from './shared';
import { getPlatformSettingsValue, ICodeLensDebugTaskSettings, IExtensionSettings } from '../extensionSettings';

export class CakeDebugTask {
    constructor(private context: ExtensionContext) {}

    private _getDebuggerConfig(
        taskName: string,
        fileName: string,
        debugConfig: ICodeLensDebugTaskSettings
    ): Promise<DebugConfiguration> {
        return new Promise((resolve, reject) => {
            if (!taskName) {
                reject('Not a valid Cake task');
            }

            const program = getPlatformSettingsValue(debugConfig.program);

            const debuggerConfig: DebugConfiguration = {
                name: 'Cake: Task Debug Script',
                type: debugConfig.debugType,
                request: debugConfig.request,
                program: program,
                args: [
                    `${fileName}`,
                    `--target=${taskName}`,
                    '--debug',
                    `--verbosity=${debugConfig.verbosity}`
                ],
                cwd: debugConfig.cwd,
                stopAtEntry: debugConfig.stopAtEntry,
                console: debugConfig.console,
                logging: debugConfig.logging
            };

            resolve(debuggerConfig);
        });
    }

    public async debug(taskName: string, fileName: string, settings: IExtensionSettings) : Promise<boolean> {
        const debugConfig = settings.codeLens.debugTask;
        try{
            if (
                !workspace.workspaceFolders ||
                workspace.workspaceFolders.length < 1
            ) {
                throw new Error('No open workspace');
            }
            
            await ensureNotDirty(fileName);
            await installCakeToolIfNeeded(settings, this.context);
        
            const workspaceFolder = workspace.workspaceFolders[0];
            const debuggerConfig = await this._getDebuggerConfig(taskName, fileName, debugConfig);
            return await debug.startDebugging(workspaceFolder, debuggerConfig);
        } catch (reason: any) {

            window.showErrorMessage(
                `Failed to start Cake task debugger: ${reason}`
            );
            return false;
        }
    }
}
