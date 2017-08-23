import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { DEFAULT_SCRIPT_NAME } from "../constants";

export class CakeBuildFile {

    constructor(public scriptName: string = DEFAULT_SCRIPT_NAME) { }

    public getTargetPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, this.scriptName);
        }

        return "";
    }

    public create(): Thenable<boolean> {
        return new Promise((resolve, reject) => {
            try {
                let buildFile = fs.createWriteStream(this.getTargetPath(), {
                    flags: 'a'
                });

                buildFile.write('///////////////////////////////////////////////////////////////////////////////\n');
                buildFile.write('// ARGUMENTS\n');
                buildFile.write('///////////////////////////////////////////////////////////////////////////////\n');
                buildFile.write('\n');
                buildFile.write('var target = Argument("target", "Default");\n');
                buildFile.write('var configuration = Argument("configuration", "Release");\n');
                buildFile.write('\n');
                buildFile.write('///////////////////////////////////////////////////////////////////////////////\n');
                buildFile.write('// SETUP / TEARDOWN\n');
                buildFile.write('///////////////////////////////////////////////////////////////////////////////\n');
                buildFile.write('\n');
                buildFile.write('Setup(ctx =>\n');
                buildFile.write('{\n');
                buildFile.write('   // Executed BEFORE the first task.\n');
                buildFile.write('   Information("Running tasks...");\n');
                buildFile.write('});\n');
                buildFile.write('\n');
                buildFile.write('Teardown(ctx =>\n');
                buildFile.write('{\n');
                buildFile.write('   // Executed AFTER the last task.\n');
                buildFile.write('   Information("Finished running tasks.");\n');
                buildFile.write('});\n');
                buildFile.write('\n');
                buildFile.write('///////////////////////////////////////////////////////////////////////////////\n');
                buildFile.write('// TASKS\n');
                buildFile.write('///////////////////////////////////////////////////////////////////////////////\n');
                buildFile.write('\n');
                buildFile.write('Task("Default")\n');
                buildFile.write('.Does(() => {\n');
                buildFile.write('   Information("Hello Cake!");\n');
                buildFile.write('});\n');
                buildFile.write('\n');
                buildFile.write('RunTarget(target);');
                buildFile.end();
                resolve(true);
            } catch (error) {
                reject(false);
            }
        });
    }
}