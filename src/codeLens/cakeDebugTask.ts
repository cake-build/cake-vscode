import {
    window,
    debug,
    workspace,
    DebugConfiguration
} from 'vscode';
import { ensureNotDirty } from './editorTools';
import { getPlatformSettingsValue, ICodeLensDebugTaskSettings } from '../extensionSettings';

export class CakeDebugTask {
    constructor() {}

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

    public async debug(taskName: string, fileName: string, debugConfig: any) : Promise<boolean> {
        try{
            if (
                !workspace.workspaceFolders ||
                workspace.workspaceFolders.length < 1
            ) {
                throw new Error('No open workspace');
            }
            if(await ensureNotDirty(fileName)) {
                window.showInformationMessage("Saved file before debugging task...");
            }
        
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
