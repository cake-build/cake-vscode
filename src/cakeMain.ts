'use strict';

import { commands, ExtensionContext } from 'vscode';
import { installCakeBootstrapper } from './bootstrapper/cakeBootstrapperCommand';
import { installCakeConfiguration } from './configuration/cakeConfigurationCommand';

export function activate(context: ExtensionContext): void {
    // Register the bootstrapper command.
    context.subscriptions.push(commands.registerCommand('cake.bootstrapper', async () => {
        installCakeBootstrapper();
    }));
    // Register the configuration command.
    context.subscriptions.push(commands.registerCommand('cake.configuration', async () => {
        installCakeConfiguration();
    }));
}

export function deactivate() {
}