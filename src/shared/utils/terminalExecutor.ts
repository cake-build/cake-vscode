import { CAKE_DEFAULT_TERMINAL } from './../../constants';
import { exec, execSync } from 'child_process';
import * as vscode from 'vscode';

export default class TerminalExecutor {
    public static runInTerminal(
        command: string,
        addNewLine: boolean = true,
        terminal: string = CAKE_DEFAULT_TERMINAL
    ): void {
        if (this.terminals[terminal] === undefined) {
            this.terminals[terminal] = vscode.window.createTerminal(terminal);
        }
        this.terminals[terminal].show();
        this.terminals[terminal].sendText(command, addNewLine);
    }

    public static exec(command: string) {
        return exec(command);
    }

    public static execSync(command: string) {
        return execSync(command, { encoding: 'utf8' });
    }

    public static onDidCloseTerminal(closedTerminal: vscode.Terminal): void {
        delete this.terminals[closedTerminal.name];
    }

    private static terminals: { [id: string]: vscode.Terminal } = {};
}
