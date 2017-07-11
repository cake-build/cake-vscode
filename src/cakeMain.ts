'use strict';

import { commands, ExtensionContext } from 'vscode';
import { installCakeBootstrapper } from './bootstrapper/cakeBootstrapperCommand';
import { installCakeConfiguration } from './configuration/cakeConfigurationCommand';
import { installCakeExecutor } from "./execution/cakeExecutorCommand";

export function activate(context: ExtensionContext): void {
    // Register the bootstrapper command.
    context.subscriptions.push(commands.registerCommand('cake.bootstrapper', async () => {
        installCakeBootstrapper();
    }));
    // Register the configuration command.
    context.subscriptions.push(commands.registerCommand('cake.configuration', async () => {
        installCakeConfiguration();
    }));
    // Register the exeuction command.
    context.subscriptions.push(commands.registerCommand("cake.execution", async() => {
        installCakeExecutor();
    }));
}

export function deactivate() { 
}