import * as vscode from 'vscode';
import { DEFAULT_SCRIPT_NAME, CANCEL } from '../../constants';
import { enums, messages } from '../../shared';
import InstallOptions from '../installOptions';
import { installCake } from './installCake';

export { installCake };

export function showScriptNameBox(): Thenable<string | undefined> {
    return vscode.window.showInputBox({
        placeHolder: messages.PROMPT_SCRIPT_NAME,
        value: DEFAULT_SCRIPT_NAME
    });
}

export function handleScriptNameResponse(
    scriptName: string | undefined
): Thenable<InstallOptions> | Thenable<never> {
    if (!scriptName) {
        // user cancelled
        return Promise.reject(CANCEL);
    }

    return Promise.resolve(new InstallOptions(scriptName));
}

export function showBootstrapperOption(
    installOpts: InstallOptions
): Thenable<InstallOptions | undefined> {
    if(installOpts) {
        if (!installOpts) {
            Promise.reject(CANCEL);
        }

        return getOption(
            messages.CONFIRM_INSTALL_BOOTSTRAPPERS,
            installOpts,
            (opts, value) => {
                if(opts) {
                    opts.installBootstrappers = value;
                    return opts;
                } else {
                    throw "Installation options are not defined."
                }
            }
        );
    } else {
        throw "Installation options are not defined";
    }
}

export function showBootstrapperTypeOption(
    installOpts: InstallOptions | undefined
): Thenable<InstallOptions | undefined> {
    if(installOpts) {
        if(installOpts.installBootstrappers) {
            return getBootstrapperOption(
                messages.CONFIRM_BOOTSTRAPPER_TYPE,
                installOpts,
                (opts, value) => {
                    if(opts) {
                        opts.bootstrapperType = value;
                        return opts;
                    } else {
                        throw "Installation options are not defined."
                    }
                }
            );
        } else {
            return Promise.resolve(installOpts);
        }
    } else {
        throw "Installation options are not defined";
    }
}

export function showConfigOption(
    installOpts: InstallOptions | undefined
): Thenable<InstallOptions | undefined> {
    if (!installOpts) {
        Promise.reject(CANCEL);
    }

    return getOption(
        messages.CONFIRM_INSTALL_CONFIG,
        installOpts,
        (opts, value) => {
            if(opts) {
                opts.installConfig = value;
                return opts;
            } else {
                throw "Installation options are not defined."
            }
        }
    );
}

export function showDebugOption(
    installOpts: InstallOptions | undefined
): Thenable<InstallOptions | undefined> {
    if (!installOpts) {
        Promise.reject(CANCEL);
    }
    return getOption(
        messages.CONFIRM_DEBUG_CONFIG,
        installOpts,
        (opts, value) => {
            if(opts) {
                opts.installDebug = value;
                return opts;
            } else {
                throw "Installation options are not defined."
            }
        }
    );
}

function getOption(
    message: string,
    options: InstallOptions | undefined,
    callback: (opts: InstallOptions | undefined, value: boolean) => void
): Thenable<InstallOptions | undefined> {
    return new Promise((resolve, reject) => {
        vscode.window
            .showQuickPick(['Yes', 'No'], {
                placeHolder: message
            })
            .then((value: string | undefined) => {
                if (!value) {
                    reject(CANCEL);
                }

                callback(options, value == 'Yes');
                resolve(options);
            });
    });
}

function getBootstrapperOption(
    message: string,
    options: InstallOptions | undefined,
    callback: (opts: InstallOptions | undefined, value: enums.RunnerType) => void): Thenable<InstallOptions | undefined> {
        return new Promise((resolve, reject) => {
            vscode.window
                .showQuickPick([enums.RunnerType.NetTool, enums.RunnerType.NetFramwork, enums.RunnerType.NetCore], {
                    placeHolder: message
                })
                .then((value: string | undefined) => {
                    if(!value) {
                        reject(CANCEL);
                    }

                    callback(options, value as enums.RunnerType);
                    resolve(options);
                });
        });
    }