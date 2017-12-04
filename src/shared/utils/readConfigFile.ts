import * as path from 'path'
import { workspace } from 'vscode';
import * as fs from 'fs';
import * as ini from 'ini';

export default function readConfigFile<T>(fileName: string): T | undefined {
    if (!workspace.rootPath || !fs.existsSync(path.join(workspace.rootPath, fileName))) {
        return undefined;
    }
    return ini.parse(fs.readFileSync(path.join(workspace.rootPath, fileName), "utf-8"));
}