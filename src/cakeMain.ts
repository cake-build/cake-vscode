'use strict';

import { commands, ExtensionContext } from 'vscode';
import { installCakeBootstrapper } from './bootstrapper/cakeBootstrapperCommand';

export function activate(context: ExtensionContext): void {
    // Register the bootstrapper command.
    context.subscriptions.push(commands.registerCommand('cake.bootstrapper', async () => {
        installCakeBootstrapper();
    }));
}

export function deactivate() {
}