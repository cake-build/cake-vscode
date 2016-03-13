// 
// Please refer to their documentation on https://mochajs.org/ for help.
//
import * as assert from 'assert';

import {MemoryStream} from './memorystream';
import {Bootstrapper} from '../src/bootstrapper';

// Defines a Mocha test suite to group tests of similar kind together
suite("Bootstrapper", () => {


    suite("#getPlatformOptions()", () => {
        test("should return OSX at first position when platform is darwin", () => {
            let platforms = Bootstrapper.getPlatformOptions('darwin');
            assert.strictEqual(platforms[0], 'OSX');
        });
        
        test("should return Windows at first position when platform is win32", () => {
            let platforms = Bootstrapper.getPlatformOptions('win32');
            assert.strictEqual(platforms[0], 'Windows');
        });
        
        test("should return Linux at first position when platform is linux", () => {
            let platforms = Bootstrapper.getPlatformOptions('linux');
            assert.strictEqual(platforms[0], 'Linux');
        });
        
        test("should return all supported platforms, without a specific order, even if the current platform is unknown", () => {
            let platforms = Bootstrapper.getPlatformOptions('my-new-os');
            assert.strictEqual(platforms.length, 3);
        });
    });

	// Defines a Mocha unit test
    suite("#download()", () => {
        test("should return build.ps1 in buildFilename property when platformName is Windows", () => {
            let bt = new Bootstrapper("Windows");
            assert.strictEqual(bt.buildFilename, 'build.ps1');
        });
        
        test("should return build.sh in buildFilename property when platform name OSX", () => {
            let bt = new Bootstrapper("OSX");
            assert.strictEqual(bt.buildFilename, 'build.sh');
        });
        
        test("should return build.sh in buildFilename property when platform name Linux", () => {
            let bt = new Bootstrapper("Linux");
            assert.strictEqual(bt.buildFilename, 'build.sh');
        });
        
        test("should download OSX build script version", async () => {
            let bt = new Bootstrapper("OSX");
            let ms = new MemoryStream();
            await bt.download(ms);
            assert.equal(ms.toString().startsWith("#!/bin/bash"), true);
        });
        
        test("should download Linux build script version", async () => {
            let bt = new Bootstrapper("Linux");
            let ms = new MemoryStream();
            await bt.download(ms);
            assert.equal(ms.toString().startsWith("#!/bin/bash"), true);
        });
        
        test("should download PowerShell build script version", async () => {
            let bt = new Bootstrapper("Windows");
            let ms = new MemoryStream();
            await bt.download(ms);
            assert.equal(ms.toString().startsWith("<#"), true);
        });
    });
    
});