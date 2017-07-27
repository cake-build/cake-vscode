import * as vscode from 'vscode';
import {
    showScriptNameBox, showBootstrapperOption, handleScriptNameResponse, showConfigOption, installCake
} from './actions'

import { CANCEL } from './constants'

export function installCakeToWorkspace() {
    showScriptNameBox()
        .then(handleScriptNameResponse)
        .then(showBootstrapperOption)
        .then(showConfigOption)
        .then(installCake)
        .then((value: string) => {
            vscode.window.showInformationMessage(value);
        })
        .then(undefined, (err) => {
            vscode.window.setStatusBarMessage('');
            if (err !== CANCEL) {
                vscode.window.showErrorMessage(err.message || err || 'We encountered an unknown error! Please try again.');
            } else {
                vscode.window.setStatusBarMessage('Cake installation cancelled!');
            }
        });
}