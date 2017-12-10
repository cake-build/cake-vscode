import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { parseAndUpdatePackagesConfig } from '../../../src/shared/utils';

export default function describeHandlePackagesConfigTests() {
    const configsPath = path.join(__dirname, '..', '..', '..', '..', 'test', 'mocks', 'files');

    suite('handlePackagesConfig', () => {
        test('should add package to empty packages config', async() => {
            const given = fs.readFileSync(`${configsPath}/emptyPackages.config`, 'utf8');
            const packageFilePath = 'notused';
            const selectedPackageName = 'Cake.LongPath.Module';
            const selectedVersion = '0.4.0';
            const expected = fs.readFileSync(`${configsPath}/singlePackages.config`, 'utf8');
            const result = await parseAndUpdatePackagesConfig({
                content: given,
                packageFilePath,
                selectedPackageName,
                selectedVersion
            });
            assert.equal(result.filePath, packageFilePath);
            assert.equal(result.message, selectedPackageName);
            assert.equal(result.content, expected);
        });
        test('should update package version on config with single package', async() => {
            const given = fs.readFileSync(`${configsPath}/singlePackages.config`, 'utf8');
            const packageFilePath = 'notused';
            const selectedPackageName = 'Cake.LongPath.Module';
            const selectedVersion = '0.5.0';
            const expected = fs.readFileSync(`${configsPath}/singleUpdatedPackages.config`, 'utf8');
            const result = await parseAndUpdatePackagesConfig({
                content: given,
                packageFilePath,
                selectedPackageName,
                selectedVersion
            });
            assert.equal(result.filePath, packageFilePath);
            assert.equal(result.message, selectedPackageName);
            assert.equal(result.content, expected);
        });
        test('should add package to existing packages config', async() => {
            const given = fs.readFileSync(`${configsPath}/singlePackages.config`, 'utf8');
            const packageFilePath = 'notused';
            const selectedPackageName = 'Cake.ShortPath.Module';
            const selectedVersion = '0.6.0';
            const expected = fs.readFileSync(`${configsPath}/multiPackages.config`, 'utf8');
            const result = await parseAndUpdatePackagesConfig({
                content: given,
                packageFilePath,
                selectedPackageName,
                selectedVersion
            });
            assert.equal(result.filePath, packageFilePath);
            assert.equal(result.message, selectedPackageName);
            assert.equal(result.content, expected);
        });
        test('should update package version on existing config with multiples packages', async() => {
            const given = fs.readFileSync(`${configsPath}/multiPackages.config`, 'utf8');
            const packageFilePath = 'notused';
            const selectedPackageName = 'Cake.ShortPath.Module';
            const selectedVersion = '0.8.0';
            const expected = fs.readFileSync(`${configsPath}/multiUpdatedPackages.config`, 'utf8');
            const result = await parseAndUpdatePackagesConfig({
                content: given,
                packageFilePath,
                selectedPackageName,
                selectedVersion
            });
            assert.equal(result.filePath, packageFilePath);
            assert.equal(result.message, selectedPackageName);
            assert.equal(result.content, expected);
        });
    });
}
