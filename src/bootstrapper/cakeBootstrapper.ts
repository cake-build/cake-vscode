var request = require('request');
import vscode = require('vscode');
import * as path from 'path';
import { CakeBootstrapperInfo } from './cakeBootstrapperInfo';

export class CakeBootstrapper {
    private _info: CakeBootstrapperInfo;

    private static bootstrappers = [
        new CakeBootstrapperInfo(
            'powershell',
            'PowerShell',
            'Bootstrapper for Windows',
            'build.ps1',
            false
        ),
        new CakeBootstrapperInfo(
            'bash',
            'Bash',
            'Bootstrapper for Linux and OSX',
            'build.sh',
            true
        )
    ];

    constructor(info: CakeBootstrapperInfo) {
        this._info = info;
    }

    public getTargetPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, this._info.fileName);
        }

        return '';
    }

    public static getBootstrappers(): CakeBootstrapperInfo[] {
        return CakeBootstrapper.bootstrappers;
    }

    public download(stream: NodeJS.WritableStream): Thenable<boolean> {
        return new Promise((resolve, reject) => {
            // Get the Cake configuration.
            var config = vscode.workspace.getConfiguration('cake');
            if (!config) {
                reject('Could not resolve bootstrapper configuration.');
                return;
            }

            // Get the bootstrapper URI from the configuration.
            var uri = config['bootstrappers'][this._info.id];
            if (!uri) {
                reject(
                    'Could not resolve bootstrapper URI from configuration.'
                );
                return;
            }

            // Download the bootstrapper.
            request
                .get(uri, { timeout: 4000 })
                .on('response', function(response: any) {
                    if (response.statusCode === 200) {
                        resolve(true);
                    } else {
                        reject(
                            `Failed to download bootstrapper: ${
                                response.statusMessage
                            }`
                        );
                    }
                })
                .on('error', function(e: any) {
                    reject(`Failed to download bootstrapper: ${e}`);
                })
                .pipe(stream);
        });
    }
}
