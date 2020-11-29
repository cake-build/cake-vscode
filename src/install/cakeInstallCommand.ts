import { window, ExtensionContext } from 'vscode';
import {
    showScriptNameBox,
    showBootstrapperOption,
    showConfigOption,
    showBootstrapperTypeOption,
    showDebugOption,
    showDebugTypeOption,
    installCake
} from './actions'

import { CANCEL } from '../constants'
import { logger } from "../shared";

export function installCakeToWorkspaceCommand(context: ExtensionContext) {
    showScriptNameBox(context)
        .then(showBootstrapperOption)
        .then(showBootstrapperTypeOption)
        .then(showConfigOption)
        .then(showDebugOption)
        .then(showDebugTypeOption)
        .then(installCake)
        .then(({message, fileName}) => {
            window.showInformationMessage(message);
            logger.logToOutput(fileName); // to suppress warnings
        })
        .then(undefined, (err: any) => {
            window.setStatusBarMessage('');
            if (err !== CANCEL) {
                window.showErrorMessage(err.message || err || 'We encountered an unknown error! Please try again.');
            } else {
                window.setStatusBarMessage('Cake installation cancelled.');
            }
        });
}
