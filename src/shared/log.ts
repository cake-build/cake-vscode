import { window, OutputChannel } from 'vscode';
import { OUTPUT_CHANNEL_NAME } from "../constants";

let channel: OutputChannel;

export function logToOutput(...items: string[]): void {
    var channel = getChannel(OUTPUT_CHANNEL_NAME);
    items.forEach(item => {
        channel.appendLine(item);
    });
}

export function logError(error: string, notify: boolean = true) {
    var channel = getChannel(OUTPUT_CHANNEL_NAME);
    channel.appendLine('Error encountered during Cake operation.')
    channel.appendLine(`E: ${error}`);

    if (notify) {
        window.showErrorMessage(error);
    }
}

function getChannel(name: string): OutputChannel {
    if (!channel) {
        channel = window.createOutputChannel(name);
    }

    return channel;
}