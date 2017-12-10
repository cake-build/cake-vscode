import * as fs from 'fs';
import { window } from 'vscode';

export default async function checkForExisting(path: string): Promise<boolean> {
    if (fs.existsSync(path)) {
        var message = `Overwrite the existing \'${path}\' file in this folder?`;
        var option = await window.showWarningMessage(message, 'Overwrite');
        return option === 'Overwrite';
    }

    return true;
}
