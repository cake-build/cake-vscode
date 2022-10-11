var request = require('request');
var AdmZip = require('adm-zip');
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { window } from 'vscode';
import {
    CAKE_BAKERY_PACKAGE_URL,
    DEFAULT_RESPONSE_TIMEOUT
} from '../constants';
import { logger } from '../shared'

export class CakeBakery {
    private extensionPath : string;

    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
    }

    public getTargetPath(): string {
        return path.join(
            this.getInstallationPath(),
            'tools/Cake.Bakery.dll'
        );
    }

    public getInstallationPath(): string {
        return path.join(
            this.extensionPath,
            'Cake.Bakery'
        );
    }

    public downloadAndExtract(): Thenable<boolean> {
        const installationPath = this.getInstallationPath();
        const extensionPath = this.extensionPath;
        return new Promise((resolve, reject) => {
            // Download the NuGet Package
            try {
                if (!fs.existsSync(extensionPath)) {
                    fs.mkdirSync(extensionPath);
                }
            } catch (error) {
                window.showErrorMessage('Unable to create directory');
            }

            logger.logInfo("Downloading Cake.Bakery to " + extensionPath)

            var data: any[] = [],
                dataLen = 0;

            request
                .get(CAKE_BAKERY_PACKAGE_URL, {
                    timeout: DEFAULT_RESPONSE_TIMEOUT
                })
                .on('data', function(chunk: any) {
                    data.push(chunk);
                    dataLen += chunk.length;
                })
                .on('end', function() {
                    var buf = new Buffer(dataLen);

                    for (var i = 0, len = data.length, pos = 0; i < len; i++) {
                        data[i].copy(buf, pos);
                        pos += data[i].length;
                    }

                    var zip = new AdmZip(buf);
                    zip.extractAllTo(installationPath);
                    logger.logInfo("Cake.Bakery successfully installed to: " + installationPath)
                    resolve(true);
                })
                .on('error', function(e: any) {
                    const err = `Failed to download Cake Bakery from NuGet: ${e}`;
                    logger.logError(err);
                    reject(err);
                });
        });
    }

    public updateOmnisharpSettings() : Thenable<void> {
        return new Promise((resolve, reject) => {
            logger.logInfo("Updating Cake.Bakery path in omnisharp.");
            try {
                const omnisharpUserFolderPath = this.getOmnisharpUserFolderPath();
                if (!fs.existsSync(omnisharpUserFolderPath)) {
                    fs.mkdirSync(omnisharpUserFolderPath);
                }
            
                const targetPath = this.getTargetPath();
                const omnisharpCakeConfigFile = this.getOmnisharpCakeConfigFile();
                if (fs.existsSync(omnisharpCakeConfigFile)) {
                    // Read in file
                    //import omnisharpCakeConfig from omnisharpCakeConfigFile;
                    var omnisharpCakeConfig = JSON.parse(fs.readFileSync(omnisharpCakeConfigFile, 'utf-8'))
                    logger.logInfo(`existing bakery-path: ${omnisharpCakeConfig.cake.bakeryPath}`);
                    omnisharpCakeConfig.cake.bakeryPath = targetPath;
                    logger.logInfo(`new bakery-path: ${omnisharpCakeConfig.cake.bakeryPath}`);
                    fs.writeFileSync(omnisharpCakeConfigFile, JSON.stringify(omnisharpCakeConfig, null, 2));
            
                    // lets force a restart of the Omnisharp server to use new config
                    vscode.commands.executeCommand('o.restart');
                } else {
                    // create file
                    var newOmnisharpCakeConfig = { cake: { bakeryPath: targetPath }};
                    fs.writeFileSync(omnisharpCakeConfigFile, JSON.stringify(newOmnisharpCakeConfig));
                }
                logger.logInfo("Omnisharp setting successfully updated.")
                resolve();
            } catch (e) {
                const err = `Failed to update Omnisharp settings: ${e}`;
                logger.logError(err);
                reject(err);
            }
        });
    }
    

    private getOmnisharpUserFolderPath() : string {
        return path.join(os.homedir(), ".omnisharp");
    }
    
    private getOmnisharpCakeConfigFile() : string {
        return path.join(this.getOmnisharpUserFolderPath(), "omnisharp.json");
    }
}
