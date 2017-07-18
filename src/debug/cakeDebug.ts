'use strict';

var request = require('request');
var AdmZip = require('adm-zip');
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class CakeDebug {
    public getTargetPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, "tools/Cake.CoreCLR/Cake.dll");
        }

        return "";
    }

    public getNupkgPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, "tools/Cake.CoreCLR.zip");
        }

        return "";
    }

    public getNupkgDestinationPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, "tools/Cake.CoreCLR");
        }

        return "";
    }

    public downloadAndExtract(): Thenable<boolean> {
        return new Promise((resolve, reject) => {
            // Download the NuGet Package
            let vm = this;
            request.get("http://nuget.org/api/v2/package/Cake.CoreCLR/", { timeout: 10000 })
                .on('end', function () {
                    var zip = new AdmZip(vm.getNupkgPath());
                    zip.extractAllTo(vm.getNupkgDestinationPath());
                    resolve(true);
                })
                .on('error', function (e: any) {
                    reject(`Failed to download debug dependencies: ${e}`);
                })
                .pipe(fs.createWriteStream(this.getNupkgPath()))
        });
    }
}