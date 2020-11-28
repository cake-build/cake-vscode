import * as vscode from 'vscode';
import { logger } from '../../shared';
import InstallOptions from '../installOptions';
import { ERROR_INVALID_SETTINGS, ERROR_NO_WORKSPACE } from '../../constants';
import { installBootstrappers } from './bootstrapper';
import { installBuildFile } from '../../buildFile/cakeBuildFileCommand';
import { installCakeConfiguration } from '../../configuration/cakeConfigurationCommand';
import { installCakeDebug } from '../../debug/cakeDebugCommand';

export function installCake(
    installOpts: InstallOptions | undefined
): Promise<{ message: string; fileName: string }> {
    if(installOpts) {
        return new Promise((resolve, reject) => {
            if (!installOpts) {
                logger.logError(ERROR_INVALID_SETTINGS, true);
                reject(ERROR_INVALID_SETTINGS);
            }

            // Check if there is an open folder in workspace
            if (vscode.workspace.rootPath === undefined) {
                vscode.window.showErrorMessage(ERROR_NO_WORKSPACE);
                reject(ERROR_NO_WORKSPACE);
            }

            logSettingsToOutput(installOpts);
            vscode.window.setStatusBarMessage(
                'Installing Cake to workspace with requested options...'
            );
            var results = new Array<Thenable<void>>();
            results.push(
                installBuildFile(installOpts.scriptName).then(
                    v => {
                        logResult(
                            v,
                            `Cake script successfully created at '${
                                installOpts.scriptName
                            }'.`,
                            'Error encountered while creating default build script.'
                        );
                    },
                    err => {
                        logResult(false, '', err);
                    }
                )
            );
            if (installOpts.installBootstrappers) {
                results.push(
                    installBootstrappers()
                        .then(_ =>
                            logResult(true, 'Bootstrappers successfully created.')
                        )
                        .catch(err =>
                            logResult(
                                false,
                                '',
                                `Error encountered while creating bootstrappers (${err}).`
                            )
                        )
                );
            }
            if (installOpts.installConfig) {
                results.push(
                    installCakeConfiguration().then(v => {
                        logResult(
                            v,
                            "Configuration file successfully created at 'cake.config'.",
                            'Error encountered while creating configuration file.'
                        );
                    })
                );
            }

            Promise.all(results)
                .then(
                    _ => {
                        // TODO: Is a selection CoreCLR/global tool needed?
                        if (installOpts.installDebug) {
                            installCakeDebug().then(v => {
                                logResult(
                                    v.installed,
                                    'Debug dependencies successfully installed.',
                                    'Error encountered while install debugging dependencies.'
                                );
                                vscode.window.showInformationMessage(
                                    "Add a new 'Cake' debug configuration to get started debugging your script."
                                );
                            })
                        }

                        // Clear the status bar, and display final notification
                        vscode.window.setStatusBarMessage('');

                        resolve({
                            message:
                                'Successfully installed Cake to current workspace.',
                            fileName: `./${installOpts.scriptName}`
                        });
                    },
                    err => {
                        reject(err);
                    }
                )
                .catch(err => reject(err));
        });
    } else {
        // TODO: should probably do something more here
        throw "Install options are undefined";
    }
}

function logResult(result: boolean, success: string, failure?: string) {
    failure = failure ? failure : 'An error has occurred.';
    if (result) {
        logger.logToOutput(success);
    } else {
        logger.logError(failure, true);
    }
}

function logSettingsToOutput(installOpts: InstallOptions | undefined): void {
    if(installOpts) {
        logger.logToOutput(
            'Installing Cake to current workspace:',
            `  - Script name: '${installOpts.scriptName}'`,
            `  - Installing: script${
                installOpts.installBootstrappers ? ', bootstrappers' : ''
            }${installOpts.installConfig ? ', cake.config' : ''}${
                installOpts.installDebug ? ', debugging dependencies' : ''
            }`
        );
    } else {
        // TODO: should probably do something here
    }
}
