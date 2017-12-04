var request = require('request');
var AdmZip = require('adm-zip');
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as utils from "./../shared/utils";

export class CakeBakery {
    private config: utils.Config;

    constructor() {
        const DEFAULT_TOOLS = "tools";
        const DEFAULT_ADDINS = "tools/Addins";
        const DEFAULT_MODULES = "tools/Modules";

        const CONFIG_NAME = "cake.config";
        if (!vscode.workspace.rootPath) {
            this.config = { Nuget: { Source: '', UseInProcessClient: false, LoadDependencies: false }, Paths: { Tools: '', Addins: '', Modules: '' }, Settings: { SkipVerification: false } };
        } else {
            this.config = utils.readConfigFile<utils.Config>(CONFIG_NAME) || { Nuget: { Source: '', UseInProcessClient: false, LoadDependencies: false }, Paths: { Tools: DEFAULT_TOOLS, Addins: DEFAULT_ADDINS, Modules: DEFAULT_MODULES }, Settings: { SkipVerification: false } };;
        }
    }

    public getTargetPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, this.config.Paths.Tools, "Cake.Bakery.exe");
        }
        return "";
    }

    public getNupkgDestinationPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, this.config.Paths.Tools, "Cake.Bakery");
        }
        return "";
    }

    public getToolFolderPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, this.config.Paths.Tools);
        }
        return "";
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
                vscode.window.showErrorMessage("Unable to create directory");
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