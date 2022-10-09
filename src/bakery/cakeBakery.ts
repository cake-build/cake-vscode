var request = require('request');
var AdmZip = require('adm-zip');
import * as path from 'path';
import * as fs from 'fs';
import { window } from 'vscode';
import {
    CAKE_BAKERY_PACKAGE_URL,
    DEFAULT_RESPONSE_TIMEOUT
} from '../constants';

export class CakeBakery {
    private extensionPath : string;

    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
    }

    public getTargetPath(): string {
        return path.join(
            this.extensionPath,
            'Cake.Bakery/tools/Cake.Bakery.dll'
        );
    }

    public getNupkgDestinationPath(): string {
        return path.join(
            this.extensionPath,
            'Cake.Bakery'
        );
    }

    public getToolFolderPath(): string {
        return path.join(
            this.extensionPath);
    }

    public downloadAndExtract(): Thenable<boolean> {
        return new Promise((resolve, reject) => {
            // Download the NuGet Package
            let vm = this;
            try {
                if (!fs.existsSync(vm.getToolFolderPath())) {
                    fs.mkdirSync(vm.getToolFolderPath());
                }
            } catch (error) {
                window.showErrorMessage('Unable to create directory');
            }

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
                    zip.extractAllTo(vm.getNupkgDestinationPath());
                    resolve(true);
                })
                .on('error', function(e: any) {
                    reject(`Failed to download Cake Bakery from NuGet: ${e}`);
                });
        });
    }
}
