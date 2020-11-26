import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { window } from 'vscode';
import { Version } from '../shared/version';

export class CakeTool {

    private getCakeVersionFromProc(proc: ChildProcessWithoutNullStreams): Promise<Version|null> {
        return new Promise((resolve, reject) => {
            const regex = new RegExp(/^cake\.tool\s+([\d\.]+(-\S+)?)/im); // https://regex101.com/r/nC8uxu/2
            let ver: Version|null = null;
            proc.on('error', (error) => {
                reject(error);
            });

            proc.stdout.on('data', (data: Buffer) => {
                if(ver !== null){
                    return;
                }
                const txt = data.toString();
                const match = regex.exec(txt);
                if(match) {
                    ver = Version.parse(match[1])
                }
            });

            proc.on('close', () => {
                resolve(ver);
            });
        });
    }

    public async getAvailableVersion(): Promise<Version|null> {
        const proc = spawn('dotnet', ['tool', 'search', 'cake.tool']);
        const ver = await this.getCakeVersionFromProc(proc);
        return ver;
    }

    /**
     * returns the currently installed version, or null if no version is installed.
     */
    public async getInstalledVersion(): Promise<Version|null> {
        const proc = spawn('dotnet', ['tool', 'list', '--global']);
        const ver = await this.getCakeVersionFromProc(proc);
        return ver;
    }
    
    public install(): Thenable<boolean> {
        return new Promise((resolve, reject) => {
            const proc = spawn('dotnet', ['tool', 'install', 'Cake.Tool', '--global']);
            
            proc.on('error', (error) => {
                reject(error);
            });

            proc.on('close', () => {
                resolve(true);
            });
        });
    }

    public update(): Thenable<boolean> {
        return new Promise((resolve, reject) => {
            const proc = spawn('dotnet', ['tool', 'update', 'Cake.Tool', '--global']);
            
            proc.on('error', (error) => {
                reject(error);
            });

            proc.on('close', () => {
                resolve(true);
            });
        });
    }

    /**
     * ensures Cake.Tool is installed,
     * asking for an update, if a newer version is available.
     * @returns `true`, if Cake.Tool was actively installed or updated. `false` if Cake.Tool was already installed and up-to-date.
     */
    public async ensureInstalled(): Promise<boolean> {
        const installedVersion = await this.getInstalledVersion();

        if(installedVersion === null) {
            await this.install();
            return true;
        }
    
        const availableVersion = await this.getAvailableVersion();
        if(availableVersion === null) {
            // cake.tool is installed, but we were unable to detect if it's the newest version
            // probably ok..
            return false;
        }
    
        if(installedVersion.greaterThan(availableVersion, true)) {
            return false;
        }
    
        // ask for updates
        const selection = await window.showQuickPick(['Yes','No'], {
            placeHolder: `Cake.Tool version ${availableVersion.toString()} is available. Update now?`
        });
    
        if(selection !== 'Yes') {
            return false;
        }
    
        await this.update();
        return true;
    }
}