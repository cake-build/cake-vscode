import {
    window,
    debug,
    workspace,
    DebugConfiguration
} from 'vscode';

export class CakeDebugTask {
    constructor() {}

    private _getDebuggerConfig(
        taskName: string,
        fileName: string,
        debugConfig: any
    ): Promise<DebugConfiguration> {
        return new Promise((resolve, reject) => {
            if (!taskName) {
                reject('Not a valid Cake task');
            }

            const debuggerConfig: DebugConfiguration = {
                name: 'Cake: Task Debug Script (CoreCLR)',
                type: debugConfig.debugType,
                request: debugConfig.request,
                program: debugConfig.program,
                args: [
                    `${fileName}`,
                    `--target=\"${taskName}\"`,
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

    public debug(taskName: string, fileName: string, debugConfig: any) {
        return this._getDebuggerConfig(taskName, fileName, debugConfig)
            .then(debuggerConfig => {
                if (
                    !workspace.workspaceFolders ||
                    workspace.workspaceFolders.length < 1
                ) {
                    throw new Error('No open workspace');
                }

                const workspaceFolder = workspace.workspaceFolders[0];

                return debug.startDebugging(workspaceFolder, debuggerConfig);
            })
            .catch((reason: any) => {
                window.showErrorMessage(
                    `Failed to start Cake task debugger: ${reason}`
                );
            });
    }
}
