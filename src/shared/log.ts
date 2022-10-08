import { window, OutputChannel, extensions } from 'vscode';
import { OUTPUT_CHANNEL_NAME } from '../constants';

interface IPackageJson {
    // see https://code.visualstudio.com/api/references/extension-manifest
    name: string;
    version: string;
}

let channel: OutputChannel;

export function logToOutput(...items: string[]): void {
    var channel = getChannel(OUTPUT_CHANNEL_NAME);
    items.forEach(item => {
        channel.appendLine(item);
    });
}

export function logError(error: string, notify: boolean = true) {
    var channel = getChannel(OUTPUT_CHANNEL_NAME);
    channel.appendLine('Error encountered during Cake operation.');
    channel.appendLine(`E: ${error}`);

    if (notify) {
        window.showErrorMessage(error);
    }
}

export function logInfo(info: string, notify: boolean = false) {
    var channel = getChannel(OUTPUT_CHANNEL_NAME);
    channel.appendLine(`I: ${info}`);

    if (notify) {
        window.showInformationMessage(info);
    }
}

function getChannel(name: string): OutputChannel {
    if (!channel) {
        channel = window.createOutputChannel(name);
        const thisExtension = (extensions.getExtension("cake-build.cake-vscode")?.packageJSON ?? {}) as IPackageJson;
        channel.appendLine(`This is ${thisExtension.name}, version ${thisExtension.version}`);
    }

    return channel;
}
