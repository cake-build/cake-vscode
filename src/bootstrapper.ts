'use strict';
//import * as request from 'request';
var request = require('request');

export class Bootstrapper {
    private baseUrl : string = 'http://cakebuild.net/bootstrapper/';
    private static supportedPlatforms = {'win32':'Windows','darwin':'OSX','linux':'Linux'};
    private _buildFilename : string;
    
    constructor(private platformName : string) {
        this._buildFilename = 'build.' + ( (/^win/i.test(platformName)) ? 'ps1' : 'sh' );
    }
    
    public static getPlatformOptions(platform : string) : string[] {
        
        let orderedPlatforms =[];
        
        let currentPlatformName = Bootstrapper.supportedPlatforms[platform];
        if (currentPlatformName != null)
            orderedPlatforms.push(currentPlatformName);
         
        for (let key in Bootstrapper.supportedPlatforms) {
            if (key !== platform)
                orderedPlatforms.push(Bootstrapper.supportedPlatforms[key]);
        }
        
        return orderedPlatforms;
    }
    
    get buildFilename() : string {
        return this._buildFilename;
    }
    
    download(stream : NodeJS.WritableStream) : Thenable<boolean> {
        return new Promise((resolve, reject) => {
            
            request
            .get(this.baseUrl + this.platformName, {timeout:4000})
            .on('response', function(response) {
                if (response.statusCode === 200) 
                    resolve(true);
                else
                    reject(response.statusMessage);
            })
            .on('error', function(e) {
                reject(e);
            })
            .pipe(stream);
        });
    }
}
