import * as path from 'path'
import { window, workspace } from 'vscode';
import * as fs from 'fs';
import * as ini from 'ini';

export async function checkForExisting(path: string): Promise<boolean> {
    if (fs.existsSync(path)) {
        var message = `Overwrite the existing \'${path}\' file in this folder?`;
        var option = await window.showWarningMessage(message, 'Overwrite');
        return option === 'Overwrite';
    }

    return true;
}

export function readConfigFile<T>(fileName: string): T | undefined {
    if (!workspace.rootPath || !fs.existsSync(path.join(workspace.rootPath, fileName))) {
        return undefined;
    }
    return ini.parse(fs.readFileSync(path.join(workspace.rootPath, fileName), "utf-8"));
}

export interface Config {
    Nuget: {
        Source?: string,
        UseInProcessClient?: boolean,
        LoadDependencies?: boolean
    },
    Paths: {
        Tools: string,
        Addins?: string,
        Modules?: string
    },
    Settings: {
        SkipVerification?: boolean
    }
}
