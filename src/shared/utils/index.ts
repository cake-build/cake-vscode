import { checkFilesPath, checkCakeFilesPath } from './checkFilesPath';
import checkForExisting from './checkForExisting';
import { Config } from './config';
import flattenNestedArray from './flattenNestedArray';
import getFetchOptions from './getFetchOptions';
import getFilesPath from './getFilesPath';
import {
    getDirErrorMessage,
    getFileErrorMessage,
    handleError
} from './handleError';
import {
    writeContentToFile,
    writeLinesToFile,
} from './handleWriteFile';
import {
    createEmptyPackagesConfigAsXml,
    updatePackagesConfig,
    parseAndUpdatePackagesConfig
} from './handlePackagesConfig';
import { readConfigFile, readCakeConfigFile } from './readConfigFile';
import showFileQuickPick from './showFileQuickPick';
import truncateFilePath from './truncateFilePath';
import { window } from 'vscode';

const showInformationMessage = window.showInformationMessage.bind(window);

export {
    checkFilesPath,
    checkCakeFilesPath,
    checkForExisting,
    Config,
    flattenNestedArray,
    getFetchOptions,
    getFilesPath,
    getDirErrorMessage,
    getFileErrorMessage,
    createEmptyPackagesConfigAsXml,
    updatePackagesConfig,
    parseAndUpdatePackagesConfig,
    handleError,
    readConfigFile,
    readCakeConfigFile,
    showFileQuickPick,
    truncateFilePath,
    showInformationMessage,
    writeContentToFile,
    writeLinesToFile
};
