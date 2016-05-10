'use strict';

var request = require('request');
import vscode = require('vscode');
import * as path from 'path';
import {CakeBootstrapperInfo} from './cakeBootstrapperInfo';

export class CakeBootstrapper {

    private _info: CakeBootstrapperInfo;

    private static bootstrappers = [
        new CakeBootstrapperInfo("win32", "Windows", "build.ps1"),
        new CakeBootstrapperInfo("darwin", "OS X", "build.sh"),
        new CakeBootstrapperInfo("linux", "Linux", "build.sh")
    ];

    constructor(info: CakeBootstrapperInfo) {
        this._info = info;
    }

    public getTargetPath(): string {
        return path.join(vscode.workspace.rootPath, this._info.fileName);
    }

    public static getBootstrappers(): CakeBootstrapperInfo[] {
        var result = [];
        let current = CakeBootstrapper.bootstrappers.find(e => e.platform == process.platform);
        if (current) {
            result.push(current);
        }
        for(var info of CakeBootstrapper.bootstrappers) {
            if(current && info.platform == current.platform) {
                continue;
            }
            result.push(info);
        }
        return result;
    }

    public download(stream: NodeJS.WritableStream): Thenable<boolean> {
        return new Promise((resolve, reject) => {

            // Get the Cake configuration.
            var config = vscode.workspace.getConfiguration("cake");
            if(!config) {
                reject("Could not resolve bootstrapper configuration.");
                return;
            }

            // Get the bootstrapper URI from the configuration.
            var uri = config['bootstrappers'][this._info.platform];
            if (!uri) {
                reject("Could not resolve bootstrapper URI from configuration.");
                return;
            }

            // Download the bootstrapper.
            request.get(uri, { timeout: 4000 })
                .on('response', function (response) {
                    if (response.statusCode === 200) {
                        resolve(true);
                    }
                    else {
                        reject(`Failed to download bootstrapper: ${response.statusMessage}`);
                    }
                })
                .on('error', function (e) {
                    reject(`Failed to download bootstrapper: ${e}`);
                })
                .pipe(stream);
        });
    }
}
