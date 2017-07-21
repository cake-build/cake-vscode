//
// Please refer to their documentation on https://mochajs.org/ for help.
//
import * as assert from 'assert';

import {CakeBootstrapper} from '../src/bootstrapper/cakeBootstrapper';

// Defines a Mocha test suite to group tests of similar kind together
suite("Bootstrapper", () => {

    suite("#getPlatforms()", () => {
        test("should return OS X at first position when platform is darwin", () => {
            Object.defineProperty(process, 'platform', { value: 'darwin' });
            var platforms = CakeBootstrapper.getBootstrappers();
            assert.strictEqual(platforms[0].label, 'OS X');
        });

        test("should return Windows at first position when platform is win32", () => {
            Object.defineProperty(process, 'platform', { value: 'win32' });
            let platforms = CakeBootstrapper.getBootstrappers();
            assert.strictEqual(platforms[0].label, 'Windows');
        });

        test("should return Linux at first position when platform is linux", () => {
            Object.defineProperty(process, 'platform', { value: 'linux' });
            let platforms = CakeBootstrapper.getBootstrappers();
            assert.strictEqual(platforms[0].label, 'Linux');
        });

        test("should return all supported platforms, without a specific order, even if the current platform is unknown", () => {
            Object.defineProperty(process, 'platform', { value: 'my-new-os' });
            let platforms = CakeBootstrapper.getBootstrappers();
            assert.strictEqual(platforms.length, 3);
        });
    });
});