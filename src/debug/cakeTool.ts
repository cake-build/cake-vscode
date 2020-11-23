import { spawn } from 'child_process';

export class CakeTool {
    
    public isInstalled(): Thenable<boolean> {
        return new Promise((resolve, reject) => {
            // TODO: Do we need to check the version?! Update it?!
            const proc = spawn('dotnet', ['tool', 'list', '--global']);
            let found = false;
            
            proc.on('error', (error) => {
                reject(error);
            });

            proc.stdout.on('data', (data: Buffer) => {
                if(found) { return; }
                const txt = data.toString();
                found = txt.toLowerCase().indexOf('cake.tool') > -1;
            });

            proc.on('close', () => {
                resolve(found);
            });
        });
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
}