'use strict';
import * as https from 'https';


export class Bootstrapper {
    
    private _buildFilename : string;
    
    constructor(private platform : string) {
        this._buildFilename = "build." + ( (this.platform === "win32") ? "ps1" : "sh" );
    }
    
    get buildFilename() : string {
        return this._buildFilename;
    }
    
    download(stream : NodeJS.WritableStream) : Thenable<boolean> {
        return new Promise((resolve, reject) => {
            
            var url = "https://raw.githubusercontent.com/cake-build/bootstrapper/master/res/scripts/"+this.buildFilename;
            
            https.get(url, (res)=>{
                res.pipe(stream);
                
                resolve(true);
            }).on("error", (e) => {
                reject(e);
            });
        });
    }
}
