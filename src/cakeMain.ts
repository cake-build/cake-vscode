import * as vscode from 'vscode';
import { installAddAddinCommand } from './addPackage/cakeAddAddinCommand';
import { installAddToolCommand } from './addPackage/cakeAddToolCommand';
import { installAddModuleCommand } from './addPackage/cakeAddModuleCommand';
import { installCakeBootstrapperCommand } from './bootstrapper/cakeBootstrapperCommand';
import { installCakeConfigurationCommand } from './configuration/cakeConfigurationCommand';
import { installCakeDebugCommand } from './debug/cakeDebugCommand';
import { installBuildFileCommand } from './buildFile/cakeBuildFileCommand';
import { installCakeToWorkspaceCommand } from './install/cakeInstallCommand';
import { installCakeBakeryCommand } from './bakery/cakeBakeryCommand';
import { installCakeRunTaskCommand } from './codeLens/cakeRunTaskCommand';
import { installCakeDebugTaskCommand } from './codeLens/cakeDebugTaskCommand';
import { CakeCodeLensProvider } from './codeLens/cakeCodeLensProvider';
import { CakeDocumentSymbolProvider} from './documentSymbols/cakeDocumentSymbolProvider';
import { TerminalExecutor } from './shared/utils';
import { getExtensionSettings, ICodeLensSettings, ITaskRunnerSettings } from './extensionSettings';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

let taskProvider: vscode.Disposable | undefined;
let codeLensProvider: CakeCodeLensProvider;
let documentSymbolProvider: CakeDocumentSymbolProvider;

interface CakeTaskDefinition extends vscode.TaskDefinition {
    script: string;
    file?: string;
}

export function activate(context: vscode.ExtensionContext): void {
    const config = getExtensionSettings();

    // Register the add addin command.
    context.subscriptions.push(
        vscode.commands.registerCommand('cake.addAddin', async () => {
            installAddAddinCommand();
        })
    );
    // Register the add tool command.
    context.subscriptions.push(
        vscode.commands.registerCommand('cake.addTool', async () => {
            installAddToolCommand();
        })
    );
    // Register the add module command.
    context.subscriptions.push(
        vscode.commands.registerCommand('cake.addModule', async () => {
            installAddModuleCommand();
        })
    );
    // Register the bootstrapper command.
    context.subscriptions.push(
        vscode.commands.registerCommand('cake.bootstrapper', async () => {
            installCakeBootstrapperCommand();
        })
    );
    // Register the configuration command.
    context.subscriptions.push(
        vscode.commands.registerCommand('cake.configuration', async () => {
            installCakeConfigurationCommand();
        })
    );
    // Register the debug command.
    context.subscriptions.push(
        vscode.commands.registerCommand('cake.debug', async () => {
            installCakeDebugCommand();
        })
    );
    // Register the build file command.
    context.subscriptions.push(
        vscode.commands.registerCommand('cake.buildFile', async () => {
            installBuildFileCommand();
        })
    );
    // Register the interactive install command.
    context.subscriptions.push(
        vscode.commands.registerCommand('cake.install', async () => {
            installCakeToWorkspaceCommand();
        })
    );
    // Register the interactive install command.
    context.subscriptions.push(
        vscode.commands.registerCommand('cake.intellisense', async () => {
            installCakeBakeryCommand();
        })
    );
    // Subscribe to terminal close event to remove reference from executor
    context.subscriptions.push(
        vscode.window.onDidCloseTerminal((closedTerminal: vscode.Terminal) => {
            TerminalExecutor.onDidCloseTerminal(closedTerminal);
        })
    );
    // Register code lens provider and tasks
    _registerCodeLens(config.codeLens, context);

    vscode.workspace.onDidChangeConfiguration(onConfigurationChanged);
    onConfigurationChanged();
}

function onConfigurationChanged() {
    const config = getExtensionSettings();

    _verifyTasksRunner(config.taskRunner);
    _verifyCodeLens(config.codeLens);
}

function _verifyTasksRunner(config: ITaskRunnerSettings) {
    if (taskProvider && !config.autoDetect) {
        taskProvider.dispose();
        taskProvider = undefined;
        return;
    }

    if (!taskProvider && config.autoDetect) {
        taskProvider = vscode.workspace.registerTaskProvider('cake', {
            provideTasks: async () => {
                return await _getCakeScriptsAsTasks();
            },
            resolveTask(_task: vscode.Task): vscode.Task | undefined {
                return undefined;
            }
        });
    }
}

async function _getCakeScriptsAsTasks(): Promise<vscode.Task[]> {
    let workspaceRoot = vscode.workspace.rootPath;
    let emptyTasks: vscode.Task[] = [];

    if (!workspaceRoot) {
        return emptyTasks;
    }

    try {
        const config = getExtensionSettings().taskRunner;
        let files = await vscode.workspace.findFiles(
            config.scriptsIncludePattern,
            config.scriptsExcludePattern
        );

        if (files.length === 0) {
            return emptyTasks;
        }

        const result: vscode.Task[] = [];

        const addFileName = files.length > 1;

        files.forEach(file => {
            const contents = fs.readFileSync(file.fsPath).toString();

            let taskRegularExpression = new RegExp(
                config.taskRegularExpression,
                'g'
            );

            let matches: RegExpExecArray | null;
            let taskNames: string[] = [];

            while ((matches = taskRegularExpression.exec(contents))) {
                taskNames.push(matches[1]);
            }

            const buildCommandBase = config.launchCommand[os.platform()] || config.launchCommand.default;
            let taskNamePrefix = "";
            if(addFileName){
                taskNamePrefix = path.basename(file.fsPath) + ": ";
            }

            taskNames.forEach(taskName => {
                const kind: CakeTaskDefinition = {
                    type: 'cake',
                    script: taskName
                };

                const buildCommand = `${buildCommandBase} \"${file.fsPath}\"  --target=\"${taskName}\" --verbosity=${config.verbosity}`;

                const buildTask = new vscode.Task(
                    kind,
                    `Run ${taskNamePrefix}${taskName}`,
                    'Cake',
                    new vscode.ShellExecution(`${buildCommand}`),
                    []
                );
                buildTask.group = vscode.TaskGroup.Build;

                result.push(buildTask);
            });
        });

        return result;
    } catch (e) {
        return [];
    }
}

function _registerCodeLens(
    config: any,
    context: vscode.ExtensionContext
): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'cake.runTask',
            async (taskName: string, fileName: string) => {
                installCakeRunTaskCommand(
                    taskName,
                    fileName,
                    getExtensionSettings()
                );
            }
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'cake.debugTask',
            async (taskName: string, fileName: string) => {

                const result = await installCakeDebugCommand(true);

                if(!result)
                    return;

                installCakeDebugTaskCommand(
                    taskName,
                    fileName,
                    getExtensionSettings().codeLens.debugTask
                );
            }
        )
    );

    codeLensProvider = new CakeCodeLensProvider(config.taskRegularExpression);
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            {
                language: 'csharp',
                pattern: config.scriptsIncludePattern
            },
            codeLensProvider
        )
    );

    documentSymbolProvider = new CakeDocumentSymbolProvider();
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            {
                language: 'csharp',
                scheme: 'file'
            }, 
            documentSymbolProvider
        )
    );
}

function _verifyCodeLens(config: ICodeLensSettings): void {
    codeLensProvider.showCodeLens = config.showCodeLens;
}

export function deactivate() {
    if (taskProvider) {
        taskProvider.dispose();
    }
}
