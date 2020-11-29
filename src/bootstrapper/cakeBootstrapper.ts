var request = require('request');
import vscode = require('vscode');
import * as path from 'path';
import { CakeBootstrapperInfo } from './cakeBootstrapperInfo';
import { enums } from '../shared';

export class CakeBootstrapper {
    private _info: CakeBootstrapperInfo;

    private static bootstrappers = [
        new CakeBootstrapperInfo(
            'dotnet-tool-powershell',
            '.NET Tool runner PowerShell',
            enums.RunnerType.NetTool,
            'Bootstrapper for .NET Tool on Windows',
            'build.ps1',
            false
        ),
        new CakeBootstrapperInfo(
            'dotnet-tool-bash',
            '.NET Tool runner Bash',
            enums.RunnerType.NetTool,
            'Bootstrapper for .NET Tool on Linux and macOS',
            'build.sh',
            true
        ),
        new CakeBootstrapperInfo(
            'dotnet-framework-powershell',
            '.NET Framework runner PowerShell',
            enums.RunnerType.NetFramwork,
            'Bootstrapper for .NET Framework on Windows',
            'build.ps1',
            false
        ),
        new CakeBootstrapperInfo(
            'dotnet-framework-bash',
            '.NET Framework runner Bash',
            enums.RunnerType.NetFramwork,
            'Bootstrapper for .NET Framework (Mono) on Linux and macOS',
            'build.sh',
            true
        ),
        new CakeBootstrapperInfo(
            'dotnet-core-powershell',
            '.NET Core runner PowerShell',
            enums.RunnerType.NetCore,
            'Bootstrapper for .NET Core on Windows',
            'build.ps1',
            false
        ),
        new CakeBootstrapperInfo(
            'dotnet-core-bash',
            '.NET Core runner Bash',
            enums.RunnerType.NetCore,
            'Bootstrapper for .NET Core on Linux and macOS',
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

    public static getBootstrappersByType(bootstrapperType: enums.RunnerType): CakeBootstrapperInfo[] {
        var filteredBootstrappers = CakeBootstrapper.bootstrappers.filter(bootstrapper => bootstrapper.type === bootstrapperType);

        return filteredBootstrappers;
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
