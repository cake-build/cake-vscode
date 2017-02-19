import * as vscode from "vscode";
import * as os from "os";

export class CakeExecutor {
    private eol = "\n";
    private windows = os.platform() === "win32";
    private staticBarItem: vscode.StatusBarItem;
    private tasks: vscode.QuickPickItem[] = [];
    private watcher: vscode.FileSystemWatcher;

    constructor(commandId) {
        this.initialize(commandId)
    }

    private createBuildCommand(taskName) {
        if (this.windows) {
            return `powershell -ExecutionPolicy ByPass -File build.ps1 -target \"${taskName}\"`;

        } else {
            return `./build.sh --target \"${taskName}\"`;
        }
    }

    private findTasks(text: string): string[] {
        let lines = text.split(this.eol);
        let taskLines = lines.filter(x => x.indexOf("Task(\"") !== -1);
        let tasks = taskLines.map(x => x.match(/"(.*?)"/)[1]);
        return tasks;
    }

    private updateTask(file: vscode.Uri) {
        let open = vscode.workspace.openTextDocument(file.fsPath);
        open.then(file => {
            let text = file.getText();
            let tasks = this.findTasks(text)
            this.tasks = [];

            tasks.forEach(x => {
                let task = { label: x, description: "" };
                this.tasks.push(task);
            });
        });
    }

    private async initializeTasks() {
        let find = vscode.workspace.findFiles("build.cake", "**/node_modules/**", 1);

        return new Promise<vscode.Uri>((resolve, reject) => {
            find.then(files => {
                if (files.length > 0) {
                    resolve(files[0]);
                }
            })
        });
    }

    private showTerminal() {
        vscode.commands.executeCommand("workbench.action.terminal.focus");
    }

    private runCommand(result) {
        let editor = vscode.window.activeTextEditor;
        let document = editor.document;
        let eol = editor.document.lineCount + 1;
        let position = editor.selection.active;
        var startPos = new vscode.Position(eol, 0);
        var endPos = new vscode.Position(eol, result.length);
        var selStartPos = new vscode.Position(eol - 1, 0);
        var newSelection = new vscode.Selection(selStartPos, endPos);
        editor.edit((edits) => {
            edits.insert(startPos, '\n' + result);
        }).then(() => {
            this.showTerminal();
            vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
            editor.selection = newSelection;
            vscode.commands.executeCommand('workbench.action.terminal.runSelectedText');
            vscode.commands.executeCommand('undo');
        }, ()  => {
            vscode.window.showErrorMessage("Unable to run task");
        })
    }

    private async initialize(commandId) {
        var uri = await this.initializeTasks();
        this.updateTask(uri);

        this.watcher = vscode.workspace.createFileSystemWatcher("**/*.cake");
        this.watcher.onDidChange(uri => {
            this.updateTask(uri);
        });

        if (!this.staticBarItem) {
            this.staticBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
            this.staticBarItem.text = "$(terminal) Cake";
            this.staticBarItem.command = commandId;
            this.staticBarItem.show();
        }
    }

    public showTasks() {
        let options = { placeholder: "Select task name" };
        let quickPick = vscode.window.showQuickPick(this.tasks, options);
        quickPick.then(result => {
            if(result !== undefined) {
                var task = result.label;
                var command = this.createBuildCommand(task);
                this.runCommand(command);
            }
        });
    }

    dispose() {
        this.watcher.dispose();
        this.staticBarItem.dispose();
        this.tasks = [];
    }
}