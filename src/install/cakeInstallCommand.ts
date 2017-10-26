import { window } from 'vscode';
import {
    showScriptNameBox,
    showBootstrapperOption,
    handleScriptNameResponse,
    showConfigOption,
    showDebugOption,
    installCake
} from './actions'

import { CANCEL } from '../constants'
import { logger } from "../shared";

export function installCakeToWorkspaceCommand() {
    showScriptNameBox()
        .then(handleScriptNameResponse)
        .then(showBootstrapperOption)
        .then(showConfigOption)
        .then(showDebugOption)
        .then(installCake)
        .then(({message, fileName}) => {
            window.showInformationMessage(message);
            logger.logToOutput(fileName); // to suppress warnings
        })
        .then(undefined, (err) => {
            window.setStatusBarMessage('');
            if (err !== CANCEL) {
                window.showErrorMessage(err.message || err || 'We encountered an unknown error! Please try again.');
            } else {
                window.setStatusBarMessage('Cake installation cancelled.');
            }
        });
}