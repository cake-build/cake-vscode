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
import { CakeDocumentSymbolProvider } from './documentSymbols/cakeDocumentSymbolProvider';
import { TerminalExecutor } from './shared/utils';
import { getExtensionSettings, getPlatformSettingsValue, ICodeLensSettings, ICodeSymbolsSettings, ITaskRunnerSettings } from './extensionSettings';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { CakeTool } from './shared/cakeTool';
import { spawn } from 'child_process';

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
            installCakeDebugCommand(context);
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
            installCakeToWorkspaceCommand(context);
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

    _registerSymbolProvider(config.codeSymbols, context);

    vscode.workspace.onDidChangeConfiguration(x => onConfigurationChanged(context, x));
    onConfigurationChanged(context, null as unknown as vscode.ConfigurationChangeEvent);
}

function onConfigurationChanged(
    context: vscode.ExtensionContext,
    event: vscode.ConfigurationChangeEvent) {
    if(event && !event.affectsConfiguration("cake")) {
        // we're not affected
        return;
    }
    const config = getExtensionSettings();

    _verifyTasksRunner(config.taskRunner, context);
    _verifyCodeLens(config.codeLens);
    _verifySymbolProvider(config.codeSymbols);
}

function _verifyTasksRunner(config: ITaskRunnerSettings,
    context: vscode.ExtensionContext) {
    if (taskProvider && !config.autoDetect) {
        taskProvider.dispose();
        taskProvider = undefined;
        return;
    }

    if (!taskProvider && config.autoDetect) {
        taskProvider = vscode.workspace.registerTaskProvider('cake', {
            provideTasks: async () => {
                return await _getCakeScriptsAsTasks(context);
            },
            resolveTask(_task: vscode.Task): vscode.Task | undefined {
                return undefined;
            }
        });
    }
}

async function _getCakeScriptsAsTasks(context: vscode.ExtensionContext): Promise<vscode.Task[]> {
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

            const buildCommandBase = getPlatformSettingsValue(config.launchCommand);
            let taskNamePrefix = "";
            if(addFileName){
                taskNamePrefix = path.basename(file.fsPath) + ": ";
            }

            taskNames.forEach(taskName => {
                const kind: CakeTaskDefinition = {
                    type: 'cake',
                    script: taskName
                };

                const buildTask = new vscode.Task(
                    kind,
                    vscode.TaskScope.Workspace,
                    `Run ${taskNamePrefix}${taskName}`,
                    'Cake',
                    new vscode.CustomExecution(getCakeToolExecution({
                        command: buildCommandBase, 
                        script: file.fsPath, 
                        taskName,
                        verbosity: config.verbosity
                    }, config, context)),
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
                    getExtensionSettings(),
                    context
                );
            }
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'cake.debugTask',
            async (taskName: string, fileName: string) => {
                installCakeDebugTaskCommand(
                    taskName,
                    fileName,
                    getExtensionSettings(),
                    context
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
}

function _registerSymbolProvider(
    config: ICodeSymbolsSettings,
    context: vscode.ExtensionContext
): void {

    documentSymbolProvider = new CakeDocumentSymbolProvider(config);
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

function _verifySymbolProvider(_config: ICodeSymbolsSettings): void {
    documentSymbolProvider.reconfigure(_config);
}

function _verifyCodeLens(config: ICodeLensSettings): void {
    codeLensProvider.showCodeLens = config.showCodeLens;
}

export function deactivate() {
    if (taskProvider) {
        taskProvider.dispose();
    }
}

function getCakeToolExecution(
    cfg: ICakeTaskRunnerConfig,
    settings: ITaskRunnerSettings,
    context: vscode.ExtensionContext) 
    : (resolvedDefinition: vscode.TaskDefinition) => Thenable<vscode.Pseudoterminal> {

        return (_: vscode.TaskDefinition) => {
            return new Promise<vscode.Pseudoterminal>((now) => now(new CakeTaskWrapper(cfg, settings, context)));
        };
}

class CakeTaskWrapper implements vscode.Pseudoterminal {

    private readonly writeEmitter = new vscode.EventEmitter<string>();
	public onDidWrite: vscode.Event<string> = this.writeEmitter.event;
	private readonly closeEmitter = new vscode.EventEmitter<number>();
    public onDidClose: vscode.Event<number> = this.closeEmitter.event;
    private isCanceled = false;
    
    constructor(private cfg: ICakeTaskRunnerConfig, 
        private settings: ITaskRunnerSettings,
        private context: vscode.ExtensionContext) {
    }

    public close(): void {
        this.isCanceled = true;
    }

    public open(_: vscode.TerminalDimensions | undefined): void {
        this.runTask();
    }

    private async runTask() : Promise<void>{
        if(this.settings.installNetTool) {
            const cakeTool = new CakeTool(this.context);
            await cakeTool.ensureInstalled();
        }
        if(this.isCanceled){
            return;
        }

        // run the task
        const proc = spawn(this.cfg.command,
            [`${this.cfg.script}`, `--target="${this.cfg.taskName}"`, `--verbosity=${this.cfg.verbosity}`],
            {
                shell: true, // not sure, why a shell is needed here.
            });
        this.writeEmitter.fire(`started command: ${proc.spawnargs.join(" ")}${os.EOL}`);
        let exit = 0;
        
        proc.on('error', (error) => {
            this.setColorRed();
            this.writeEmitter.fire(`ERROR: ${error.name}${os.EOL}${error.message}${os.EOL}`);
            if(error.stack){
                this.writeEmitter.fire(error.stack+os.EOL);
            }
            this.resetColor();
            exit = 1;
        });

        proc.stdout.on('data', (data: Buffer) => {
            const txt = data.toString();
            this.writeEmitter.fire(txt);
        });
        proc.stderr.on('data', (data: Buffer) => { 
            const txt = data.toString();
            this.setColorRed();
            this.writeEmitter.fire(txt);
            this.resetColor();
        });

        proc.on('close', () => {
            this.closeEmitter.fire(exit);
            this.writeEmitter.dispose();
            this.closeEmitter.dispose();
        });
    }

    private setColorRed(): void {
        this.writeEmitter.fire('\x1b[31m')
    }
    private resetColor(): void {
        this.writeEmitter.fire('\x1b[39m')
    }
}

interface ICakeTaskRunnerConfig{
    command: string; 
    script: string;
    taskName: string;
    verbosity: string;
}