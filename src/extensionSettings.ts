import * as vscode from 'vscode';
import * as os from 'os';

interface IPlatformSettings<T> {
    default: T;
    [platform: string]: T;
}

interface ILaunchCommandSettings 
    extends IPlatformSettings<string> {
}

export interface ITaskRunnerSettings {
    autoDetect: boolean;
    installNetTool: boolean;
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

export interface ICodeLensDebugTaskProgramSettings 
    extends IPlatformSettings<string> {
}

export interface ICodeLensDebugTaskSettings {
    verbosity: "diagnostic" | "minimal" | "normal" | "quiet" | "verbose";
    debugType: "mono" | "coreclr";
    request: string;
    program: ILaunchCommandSettings;
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
    installNetTool: boolean;
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

export function getPlatformSettingsValue<T>(settings: IPlatformSettings<T>): T {
    return settings[os.platform()] || settings.default;
}

export function getExtensionSettings(): IExtensionSettings {
    const settings = vscode.workspace.getConfiguration('cake') as unknown as IExtensionSettings;
    const taskRunner = settings.taskRunner;
    const codeLens = settings.codeLens;

    // extend "cake.taskRunner.launchCommand" here, because the default of `{"default":"...", "win32":"..."}`
    // can not (!) be part of the vs-internal settings defaults or else the platform-specific setting
    // can never be overridden. (i.e. win32 will always be set.)
    const launchCommand = _ensureDefaultsOnLaunchCommand(taskRunner.launchCommand);

    // also extend "cake.codeLens.debugTask.program" here, of the same reason as above.
    const debugTaskProgram = _ensureDefaultsOnDebugTaskProgram(codeLens.debugTask.program);


    return {
        ...settings,
        taskRunner: {
            ...taskRunner,
            launchCommand: launchCommand
        },
        codeLens: {
            ...codeLens,
            debugTask: {
                ...codeLens.debugTask,
                program: debugTaskProgram
            }
        }
    }
}

function _ensureDefaultsOnLaunchCommand(launchCommand: ILaunchCommandSettings): ILaunchCommandSettings {
    const defaultVal = {
        default: "~/.dotnet/tools/dotnet-cake",
        win32: "dotnet-cake.exe"
    };

    return _ensureDefaultsOnPlatformSetting(launchCommand, defaultVal);
}

function _ensureDefaultsOnDebugTaskProgram(program: ICodeLensDebugTaskProgramSettings): ICodeLensDebugTaskProgramSettings {
    const defaultVal = {
        default: "~/.dotnet/tools/dotnet-cake",
        win32: "dotnet-cake.exe"
    };

    return _ensureDefaultsOnPlatformSetting(program, defaultVal);
}

function _ensureDefaultsOnPlatformSetting<T extends IPlatformSettings<TInner>, TInner>(inputVal: T, defaultVal: T): T {
    if(!inputVal) {
        return defaultVal;
    }

    // ensure "default" is always set.
    if(!inputVal.default){
        inputVal = {
            ...inputVal,
            default: defaultVal.default
        }
    }

    return inputVal;
}