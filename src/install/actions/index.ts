import * as vscode from 'vscode';
import { DEFAULT_SCRIPT_NAME, CANCEL } from '../../constants';
import { messages } from "../../shared";
import InstallOptions from "../installOptions";
import { installCake } from './installCake';

export {installCake}

export function showScriptNameBox(): Thenable<string | undefined> {
    return vscode.window.showInputBox({
        placeHolder: messages.PROMPT_SCRIPT_NAME,
        value: DEFAULT_SCRIPT_NAME
    });
}

export function handleScriptNameResponse(scriptName: string): Thenable<InstallOptions> | Thenable<never> {
    if (!scriptName) {
        // user cancelled
        return Promise.reject(CANCEL);
    }
    return Promise.resolve(new InstallOptions(scriptName));
}

export function showBootstrapperOption(installOpts: InstallOptions): Thenable<InstallOptions | undefined> {
    /*return vscode.window.showQuickPick([' Yes', 'No'], {
        placeHolder: messages.CONFIRM_INSTALL_BOOTSTRAPPERS,
    }).then((value) => {
    if (!value) {
        Promise.reject(CANCEL);
    }
    installOpts.installBootstrappers = value == 'Yes';
    return installOpts;
    }); */
    if (!installOpts) {
        Promise.reject(CANCEL);
    }
    return getOption(messages.CONFIRM_INSTALL_BOOTSTRAPPERS, installOpts, (opts, value) => opts.installBootstrappers = value);
}

export function showConfigOption(installOpts: InstallOptions): Thenable<InstallOptions | undefined> {
    if (!installOpts) {
        Promise.reject(CANCEL);
    }
    return getOption(messages.CONFIRM_INSTALL_CONFIG, installOpts, (opts, value) => opts.installConfig = value);
}

function getOption(
    message: string,
    options: InstallOptions,
    callback: (opts: InstallOptions, value: boolean) => void
): Thenable<InstallOptions | undefined> {
    return new Promise((resolve, reject) => {
        vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: message
        }).then((value: string | undefined) => {
            if (!value) {
                reject(CANCEL)
            }
            callback(options, value == 'Yes');
            resolve(options);
        });
    });
}