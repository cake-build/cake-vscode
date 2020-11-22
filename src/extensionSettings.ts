import * as vscode from 'vscode';

interface ILaunchCommandSettings {
    default: string;
    [platform: string]: string;
}

export interface ITaskRunnerSettings {
    autoDetect: boolean;
    scriptsIncludePattern: string;
    scriptsExcludePattern: string;
    taskRegularExpression: string;
    launchCommand: ILaunchCommandSettings;
    verbosity: "diagnostic" | "minimal" | "normal" | "quiet" | "verbose";
}

export interface IBootstrappersSettings {
    "dotnet-framework-powershell": string;
    "dotnet-framework-bash": string;
    "dotnet-core-powershell": string;
    "dotnet-core-bash": string;
    "dotnet-tool-powershell": string;
    "dotnet-tool-bash": string;
}

export interface IConfigurationSettings {
    config: string;
}

export interface ICodeLensDebugTaskSettings {
    verbosity: "diagnostic" | "minimal" | "normal" | "quiet" | "verbose";
    debugType: "mono" | "coreclr";
    request: string;
    program: string;
    cwd: string;
    stopAtEntry: boolean;
    console: "internalConsole" | "integratedTerminal" | "externalTerminal";
    logging: {
        exceptions: boolean;
        moduleLoad: boolean;
        programOutput: boolean;
        engineLogging: boolean;
        browserStdOut: boolean;
    }
}

export interface ICodeLensSettings {
    showCodeLens: boolean;
    scriptsIncludePattern: string;
    taskRegularExpression: string;
    debugTask: ICodeLensDebugTaskSettings;
}

export interface ICodeSymbolsSettings {
    contextRegularExpression: string;
    taskRegularExpression: string;
}

export interface IExtensionSettings {
    taskRunner: ITaskRunnerSettings;
    bootstrappers: IBootstrappersSettings;
    configuration: IConfigurationSettings;
    codeLens: ICodeLensSettings;
    codeSymbols: ICodeSymbolsSettings;
}

export function getExtensionSettings(): IExtensionSettings {
    var settings = vscode.workspace.getConfiguration('cake') as unknown as IExtensionSettings;
    var taskRunner = settings.taskRunner;

    // extend "cake.taskRunner.launchCommand" here, because the default of `{"default":"...", "win32":"..."}`
    // can not (!) be part of the vs-internal settings defaults or else the platform-specific setting
    // can never be overridden. (i.e. win32 will always be set.)
    const defaultCommand = "./build.sh";
    let launchCommand = settings.taskRunner.launchCommand;
    if (!launchCommand) {
        launchCommand = {
            default: defaultCommand,
            win32: "powershell -ExecutionPolicy ByPass -File build.ps1"
        }
    }

    // make sure that there is always "cake.taskRunner.launchCommand.default" - even if it's not in the settings.
    if (!launchCommand.default) {
        launchCommand = {
            ...launchCommand,
            default: defaultCommand
        }
    }

    return {
        ...settings,
        taskRunner: {
            ...taskRunner,
            launchCommand: launchCommand
        }
    }
}