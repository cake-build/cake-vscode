var request = require('request');
import vscode = require('vscode');
import * as path from 'path';

export class CakeConfiguration {

    public getTargetPath(): string {
        if (vscode.workspace.rootPath) {
            return path.join(vscode.workspace.rootPath, "cake.config");
        }

        return "";
    }

    public download(stream: NodeJS.WritableStream): Thenable<boolean> {
        return new Promise((resolve, reject) => {

            // Get the Cake configuration.
            var config = vscode.workspace.getConfiguration("cake");
            if (!config) {
                reject("Could not resolve configuration configuration.");
                return;
            }

            // Get the bootstrapper URI from the configuration.
            var uri = config['configuration']['config'];
            if (!uri) {
                reject("Could not resolve configuration URI from configuration.");
                return;
            }

            // Download the bootstrapper.
            request.get(uri, { timeout: 4000 })
                .on('response', function (response: any) {
                    if (response.statusCode === 200) {
                        resolve(true);
                    }
                    else {
                        reject(`Failed to download configuration: ${response.statusMessage}`);
                    }
                })
                .on('error', function (e: any) {
                    reject(`Failed to download configuration: ${e}`);
                })
                .pipe(stream);
        });
    }
}