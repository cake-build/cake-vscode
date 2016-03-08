// 
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as bootstrapper from '../src/bootstrapper';
import * as stream from './memorystream';

// Defines a Mocha test suite to group tests of similar kind together
suite("Cake Bootstrapper Tests", () => {

	// Defines a Mocha unit test
	test("show return build.ps1 in buildFilename property when platform is win32", () => {
        let bt = new bootstrapper.Bootstrapper("win32");
        assert.strictEqual(bt.buildFilename, 'build.ps1');
	});
    
    test("show return build.sh in buildFilename property when platform isn't win32", () => {
        let bt = new bootstrapper.Bootstrapper("darwin");
        assert.strictEqual(bt.buildFilename, 'build.sh');
	});
    
    test("should download the OSX/Linux build script version", async () => {
        let bt = new bootstrapper.Bootstrapper("darwin");
        let ms = new stream.MemoryStream();
        await bt.download(ms);
        assert.equal(ms.toString().startsWith("#!/bin/bash"), true);
	});
    
    test("should download the PowerShell build script version", async () => {
        let bt = new bootstrapper.Bootstrapper("win32");
        let ms = new stream.MemoryStream();
        await bt.download(ms);
        assert.equal(ms.toString().startsWith("<#"), true);
	});
    
});