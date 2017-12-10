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
import * as fs from 'fs';
import * as os from 'os';

let taskProvider: vscode.Disposable | undefined;

export function activate(context: vscode.ExtensionContext): void {
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

    function onConfigurationChanged() {
        let autoDetect = vscode.workspace
            .getConfiguration('cake')
            .get('taskRunner.autoDetect');
        if (taskProvider && !autoDetect) {
            taskProvider.dispose();
            taskProvider = undefined;
        } else if (!taskProvider && autoDetect) {
            taskProvider = vscode.workspace.registerTaskProvider('cake', {
                provideTasks: async () => {
                    return await getCakeScriptsAsTasks();
                },
                resolveTask(_task: vscode.Task): vscode.Task | undefined {
                    return undefined;
                }
            });
        }
    }

    vscode.workspace.onDidChangeConfiguration(onConfigurationChanged);
    onConfigurationChanged();
}

export function deactivate() {
    if (taskProvider) {
        taskProvider.dispose();
    }
}

interface CakeTaskDefinition extends vscode.TaskDefinition {
    script: string;
    file?: string;
}

async function getCakeScriptsAsTasks(): Promise<vscode.Task[]> {
    let workspaceRoot = vscode.workspace.rootPath;
    let emptyTasks: vscode.Task[] = [];

    if (!workspaceRoot) {
        return emptyTasks;
    }

    try {
        let cakeConfig = vscode.workspace.getConfiguration('cake');
        let files = await vscode.workspace.findFiles(
            cakeConfig.taskRunner.scriptsIncludePattern,
            cakeConfig.taskRunner.scriptsExcludePattern
        );

        if (files.length === 0) {
            return emptyTasks;
        }

        const result: vscode.Task[] = [];

        files.forEach(file => {
            const contents = fs.readFileSync(file.fsPath).toString();

            let taskRegularExpression = new RegExp(
                cakeConfig.taskRunner.taskRegularExpression,
                'g'
            );

            let matches,
                taskNames = [];

            while ((matches = taskRegularExpression.exec(contents))) {
                taskNames.push(matches[1]);
            }

            taskNames.forEach(taskName => {
                const kind: CakeTaskDefinition = {
                    type: 'cake',
                    script: taskName
                };

                let buildCommand = `./build.sh --target \"${taskName}\"`;

                if (os.platform() === 'win32') {
                    buildCommand = `powershell -ExecutionPolicy ByPass -File build.ps1 -target \"${taskName}\"`;
                }

                const buildTask = new vscode.Task(
                    kind,
                    `Run ${taskName}`,
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
