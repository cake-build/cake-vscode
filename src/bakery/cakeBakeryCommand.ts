import { commands, window } from 'vscode';
import * as fs from 'fs';
import { CakeBakery } from './cakeBakery';
import { logger } from '../shared'

export async function updateCakeBakeryCommand(extensionPath: string) {
    // Install Cake Bakery
    try {
        var result = await forceInstallBakery(extensionPath);
        if (result) {
            commands.executeCommand('o.restart');
            window.showInformationMessage(
                'Intellisense support (Cake.Bakery) for Cake files was installed.'
            );
        } else {
            window.showErrorMessage(
                'Error downloading intellisense support (Cake.Bakery) for Cake files.'
            );
        }
    } catch (e: unknown) {
        logger.logError("Intellisense support (Cake.Bakery) for Cake files NOT installed!\r\n> "+e, false)
    }
}

export async function forceInstallBakery(extensionPath: string): Promise<boolean> {
    let bakery = new CakeBakery(extensionPath);

    var targetPath = bakery.getInstallationPath();
    logger.logInfo("Force-updating Cake.Bakery in " + targetPath);
    if (fs.existsSync(targetPath)) {
        fs.rmdirSync(targetPath, {recursive: true});
    }

    const success = await bakery.downloadAndExtract();
    await bakery.updateOmnisharpSettings();
    return success;
}
