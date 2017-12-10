import * as path from 'path';
import * as fs from 'fs';
const makeDir = require('make-dir');
import { workspace } from 'vscode';
import { CAKE_PACKAGES_CONFIG_NAME } from '../../constants';
import {
    createEmptyPackagesConfigAsXml,
    getDirErrorMessage,
    getFileErrorMessage,
    handleError,
    parseAndUpdatePackagesConfig,
    readCakeConfigFile
} from '../../shared/utils';

export function getModulesPathFromConfig(
    rootPath: string
): Promise<any | never> {
    return new Promise((resolve, reject) => {
        const config = readCakeConfigFile(rootPath);

        if (!config.Paths.Modules) {
            return reject(
                'Could not locate a valid Modules directory! Please configure cake.config or try again.'
            );
        }

        const modulesPath = path.join(rootPath, config.Paths.Modules);

        return resolve(modulesPath);
    });
}

export function ensureModulePathExist(
    modulesPath: string
): Promise<any | never> {
    if (!fs.existsSync(modulesPath)) {
        makeDir.sync(modulesPath);
    }
    return new Promise((resolve, reject) => {
        try {
        } catch (err) {
            return handleError(
                err,
                getDirErrorMessage('create', 'Modules'),
                reject
            );
        }
        return resolve(modulesPath);
    });
}

export function readModulesPackagesConfig(
    modulesPath: string
): Promise<any | never> {
    return new Promise((resolve, reject) => {
        const packageFilePath = path.join(
            modulesPath,
            CAKE_PACKAGES_CONFIG_NAME
        );
        if (!fs.existsSync(packageFilePath)) {
            return resolve({
                content: createEmptyPackagesConfigAsXml(),
                packageFilePath
            });
        }

        fs.readFile(packageFilePath, 'utf8', (err, data) => {
            if (err) {
                return handleError(
                    err,
                    getFileErrorMessage('read', packageFilePath),
                    reject
                );
            }

            return resolve({
                content: data,
                packageFilePath
            });
        });
    });
}

export function handleModuleWithContent({
    selectedPackageName,
    selectedVersion
}: {
    selectedPackageName: string;
    selectedVersion: string;
}): Promise<any | never> {
    if (!workspace.rootPath) {
        return Promise.reject(
            'Unable to locate a workspace root path! Please open a workspace and try again.'
        );
    }

    return getModulesPathFromConfig(workspace.rootPath)
        .then(ensureModulePathExist)
        .then(readModulesPackagesConfig)
        .then(
            ({
                content,
                packageFilePath
            }: {
                content: string;
                packageFilePath: string;
            }) =>
                parseAndUpdatePackagesConfig({
                    content,
                    packageFilePath,
                    selectedPackageName,
                    selectedVersion
                })
        );
}
