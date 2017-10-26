var request = require('request');
var AdmZip = require('adm-zip');
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class CakeBakery {

    public getTargetPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, "tools/Cake.Bakery/tools/Cake.Bakery.exe");
        }
        return "";
    }

    public getNupkgDestinationPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, "tools/Cake.Bakery");
        }
        return "";
    }

    public getToolFolderPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, "tools");
        }
        return "";
    }

    public downloadAndExtract(): Thenable<boolean> {
        return new Promise((resolve, reject) => {
            // Download the NuGet Package
            let vm = this;
            if (!fs.existsSync(vm.getToolFolderPath())) {
                fs.mkdirSync(vm.getToolFolderPath());
            }

            var data: any[] = [], dataLen = 0;

            request.get("http://nuget.org/api/v2/package/Cake.Bakery/", { timeout: 10000 })
                .on('data', function (chunk: any) {
                    data.push(chunk);
                    dataLen += chunk.length;
                })
                .on('end', function () {
                    var buf = new Buffer(dataLen);

                    for (var i = 0, len = data.length, pos = 0; i < len; i++) {
                        data[i].copy(buf, pos);
                        pos += data[i].length;
                    }

                    var zip = new AdmZip(buf);
                    zip.extractAllTo(vm.getNupkgDestinationPath());
                    resolve(true);
                })
                .on('error', function (e: any) {
                    reject(`Failed to download Cake Bakery from NuGet: ${e}`);
                })
        });
    }
}